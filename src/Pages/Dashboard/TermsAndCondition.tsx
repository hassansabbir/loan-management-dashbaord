import { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import toast from "react-hot-toast";
import {
  useGetSettingByKeyQuery,
  useUpdateSettingsMutation,
} from "@/redux/apiSlices/settingsSlice";

const TermsAndCondition = () => {
  const editor = useRef(null);
  const { data: fetchedContent, isLoading } = useGetSettingByKeyQuery("termsOfService");
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSettingsMutation();

  const [content, setContent] = useState("");

  useEffect(() => {
    if (typeof fetchedContent === "string") {
      setContent(fetchedContent);
    }
  }, [fetchedContent]);

  const handleSave = async () => {
    const textToSave = content || fetchedContent || "";
    if (!textToSave.trim()) {
      toast.error("Terms of Service content cannot be empty");
      return;
    }

    try {
      const res = await updateSettings({
        termsOfService: textToSave,
      }).unwrap();

      toast.success(res.message || "Terms of Service updated successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update Terms of Service");
    }
  };

  const config = {
    readonly: false,
    placeholder: "Write your Terms of Service content here...",
    height: 480,
    toolbarSticky: false,
    buttons: [
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "font",
      "fontsize",
      "brush",
      "paragraph",
      "|",
      "align",
      "ul",
      "ol",
      "|",
      "link",
      "table",
      "hr",
      "|",
      "undo",
      "redo",
    ],
  };

  return (
    <div className="space-y-5 pb-12">
      {/* Page Header matching standard dashboard style */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Review and update the platform's terms of service and commercial agreements.
        </p>
      </div>

      {/* Editor Card Container */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] space-y-4">
        {isLoading ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <div className="w-8 h-8 border-3 border-[#1B64F2]/20 border-t-[#1B64F2] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="rounded-xl overflow-hidden border border-gray-200">
              <JoditEditor
                key={fetchedContent ? "loaded" : "ready"}
                ref={editor}
                value={content || fetchedContent || ""}
                config={config}
                onBlur={(newContent) => setContent(newContent)}
                onChange={() => {}}
              />
            </div>

            {/* Save Action Button */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={isUpdating}
                className="px-8 py-2.5 rounded-xl bg-[#1B64F2] hover:bg-[#1451C9] text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TermsAndCondition;