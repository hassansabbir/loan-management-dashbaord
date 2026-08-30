import i18next from "i18next";
import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { ConfigProvider } from "antd";
import App from "./App.tsx";
import global_en from "./Translation/en/en.global.json";
import global_es from "./Translation/es/es.global.json";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import { Toaster } from "react-hot-toast";

i18next.init({
  interpolation: {
    escapeValue: false,
  },
  lng: "en",
  resources: {
    en: {
      global: global_en,
    },
    es: {
      global: global_es,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18next}>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1B64F2",
              colorInfo: "#1B64F2",
              colorSuccess: "#10B981",
              colorWarning: "#F59E0B",
              colorError: "#EF4444",
              colorBgBase: "#FFFFFF",
              colorTextBase: "#0F172A",
              colorBorder: "#E2E8F0",
              borderRadius: 8,
              fontFamily: "'Poppins', 'Inter', sans-serif",
            },
          }}
        >
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#FFFFFF",
                color: "#0F172A",
                border: "1px solid #E2E8F0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                borderRadius: "10px",
                fontSize: "14px",
              },
            }}
          />
        </ConfigProvider>
      </Provider>
    </I18nextProvider>
  </React.StrictMode>
);

