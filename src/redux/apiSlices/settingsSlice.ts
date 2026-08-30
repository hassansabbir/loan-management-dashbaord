import { api } from "../api/baseApi";

export interface SettingsData {
  privacyPolicy?: string;
  termsOfService?: string;
  [key: string]: any;
}

export const settingsSlice = api.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Get Setting by Key: GET /settings?key=privacyPolicy or termsOfService
    // Robustly handles both { data: "string" } and { data: { privacyPolicy: "..." } } formats
    getSettingByKey: builder.query<string, string>({
      query: (key) => ({
        method: "GET",
        url: `/settings?key=${key}`,
      }),
      transformResponse: (response: any, _meta, arg: string): string => {
        if (!response) return "";
        if (typeof response === "string") return response;

        const data = response?.data !== undefined ? response.data : response;

        if (typeof data === "string") return data;

        if (typeof data === "object" && data !== null) {
          // 1. Check for the requested key parameter directly
          if (arg && typeof data[arg] === "string") {
            return data[arg];
          }
          // 2. Explicit keys check
          if (typeof data.privacyPolicy === "string") return data.privacyPolicy;
          if (typeof data.termsOfService === "string") return data.termsOfService;
          if (typeof data.content === "string") return data.content;
          if (typeof data.value === "string") return data.value;

          // 3. Fallback to first string value in object
          for (const val of Object.values(data)) {
            if (typeof val === "string") return val;
          }
        }

        return "";
      },
      providesTags: ["Settings"],
    }),

    // 2. Get All Settings: GET /settings
    getAllSettings: builder.query<SettingsData, void>({
      query: () => ({
        method: "GET",
        url: "/settings",
      }),
      transformResponse: (response: any): SettingsData => {
        if (response?.data && typeof response.data === "object") {
          return response.data;
        }
        return response || {};
      },
      providesTags: ["Settings"],
    }),

    // 3. Update Settings: PUT /settings
    updateSettings: builder.mutation<
      { success: boolean; message: string; statusCode?: number; data?: any },
      Partial<SettingsData>
    >({
      query: (body) => ({
        method: "PUT",
        url: "/settings",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useGetSettingByKeyQuery,
  useGetAllSettingsQuery,
  useUpdateSettingsMutation,
} = settingsSlice;

export default settingsSlice;
