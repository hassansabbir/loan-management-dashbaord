import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuFileText,
  LuUsers,
  LuArrowLeftRight,
  LuSettings,
  LuInfo,
  LuLogOut,
} from "react-icons/lu";
import toast from "react-hot-toast";
import { clearAuth } from "../../utils/auth";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LuLayoutDashboard },
  { label: "Funding Applications", href: "/funding-applications", icon: LuFileText },
  { label: "Borrowers", href: "/borrowers", icon: LuUsers },
  { label: "Transactions", href: "/transactions", icon: LuArrowLeftRight },
];

const systemNavItems: NavItem[] = [
  { label: "Settings", href: "/settings", icon: LuSettings },
  { label: "FAQ's", href: "/faqs", icon: LuInfo },
  { label: "Privacy Policy", href: "/privacy-policy", icon: LuInfo },
  { label: "Terms of Service", href: "/terms-and-condition", icon: LuInfo },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const handleLogout = () => {
    clearAuth();
    toast.success("Logged out successfully");
    navigate("/auth/login");
  };

  const renderNavList = (items: NavItem[]) => {
    return items.map((item) => {
      const Icon = item.icon;
      let isActive = false;

      if (item.href === "/") {
        isActive = currentPath === "/";
      } else if (item.href === "/settings") {
        isActive =
          currentPath === "/settings" ||
          currentPath === "/personal-information" ||
          currentPath === "/change-password";
      } else {
        isActive = currentPath === item.href || currentPath.startsWith(`${item.href}/`);
      }

      return (
        <Link
          key={item.label}
          to={item.href}
          className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-sm font-medium ${
            isActive
              ? "bg-[#1B64F2] text-white shadow-sm font-semibold"
              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Icon
            size={19}
            className={isActive ? "text-white" : "text-gray-400"}
          />
          <span>{item.label}</span>
        </Link>
      );
    });
  };

  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-40 select-none">
      {/* Brand Logo Header */}
      <div className="h-20 flex items-center px-6 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1B64F2] rounded-xl flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <svg
              width="22"
              height="22"
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
            <h1 className="text-[#1B64F2] font-bold text-lg leading-none tracking-tight">
              Loan
            </h1>
            <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-1">
              REVENUE FINANCING
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Main Section */}
        <div className="space-y-1">
          {renderNavList(mainNavItems)}
        </div>

        {/* System Section */}
        <div className="space-y-1">
          <p className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase px-3.5 mb-2">
            SYSTEM
          </p>
          {renderNavList(systemNavItems)}
        </div>
      </div>

      {/* Footer Area with Red Outline Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 rounded-xl text-red-500 font-semibold hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer text-sm"
        >
          <LuLogOut size={18} className="text-red-500" />
          <span>Logout</span>
        </button>
        <p className="text-center text-xs text-gray-400 font-medium mt-3">
          Copyright@app
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
