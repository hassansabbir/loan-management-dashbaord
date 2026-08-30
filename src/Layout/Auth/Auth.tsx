import { Outlet, Link } from "react-router-dom";

const Auth = () => {
  return (
    <div className="min-h-screen bg-[#F4F7FC] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle decorative background circles */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-50/80 rounded-full blur-3xl pointer-events-none" />

      {/* Main Auth Container */}
      <div className="w-full max-w-[480px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 p-8 sm:p-10 relative z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center mb-8">
          <Link to="/" className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-[#1B64F2] rounded-xl flex items-center justify-center text-white shadow-sm">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M4 10H20V12H4V10ZM4 14H20V16H4V14ZM4 18H20V20H4V18ZM12 3L2 8V10H22V8L12 3ZM10 10H14V20H10V10Z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-[#1B64F2] font-bold text-2xl leading-none">
                Loan
              </h1>
              <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-1">
                REVENUE FINANCING
              </p>
            </div>
          </Link>
        </div>

        {/* Auth Subpages (Login, ForgotPassword, etc.) */}
        <Outlet />
      </div>

      <p className="text-center text-xs text-gray-400 font-medium mt-6 relative z-10">
        Copyright © {new Date().getFullYear()} Loan Management. All rights reserved.
      </p>
    </div>
  );
};

export default Auth;