import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "antd";
import { LuBell, LuUser } from "react-icons/lu";
import defaultAvatar from "../../assets/randomProfile2.jpg";
import { useGetProfileQuery } from "../../redux/apiSlices/authSlice";
import { getStoredUser, setStoredUser } from "../../utils/auth";
import { imageUrl } from "../../redux/api/baseApi";

const Header = () => {
  const { data: profileResponse, isLoading } = useGetProfileQuery();
  const cachedUser = getStoredUser();

  const user = profileResponse?.data || cachedUser;
  const name = user?.name || "Administrator";
  const role = user?.role || "SUPER_ADMIN";
  const rawImage = user?.image || user?.profileImg;

  // Persist fetched user profile to storage
  useEffect(() => {
    if (profileResponse?.data) {
      setStoredUser(profileResponse.data);
    }
  }, [profileResponse]);

  const avatarSrc = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `${imageUrl}${rawImage}`
    : null;

  return (
    <header className="h-14 px-6 flex items-center justify-end sticky top-0 z-30 bg-[#F4F7FC]/80 backdrop-blur-sm">
      {/* Right side Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Link
          to="/notification"
          className="w-9 h-9 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white transition-colors relative"
          title="Notifications"
        >
          <Badge dot color="#EF4444" offset={[-2, 3]}>
            <LuBell size={20} className="text-gray-600" />
          </Badge>
        </Link>

        {/* Subtle vertical divider */}
        <div className="w-[1px] h-6 bg-gray-200" />

        {/* User Profile */}
        <Link
          to="/personal-information"
          className="flex items-center gap-3 pl-2 py-1 pr-1 rounded-xl hover:bg-white/60 transition-colors"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {isLoading && !user?.name ? (
                <span className="inline-block w-20 h-4 bg-gray-200 animate-pulse rounded" />
              ) : (
                name
              )}
            </p>
            <p className="text-[11px] font-semibold text-gray-400 mt-0.5 tracking-wider">
              {isLoading && !user?.role ? (
                <span className="inline-block w-16 h-3 bg-gray-100 animate-pulse rounded mt-1" />
              ) : (
                role
              )}
            </p>
          </div>

          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 bg-white flex-shrink-0 flex items-center justify-center shadow-xs">
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultAvatar;
                }}
              />
            ) : (
              <div className="w-full h-full bg-blue-50 text-[#1B64F2] flex items-center justify-center font-bold text-sm">
                {name ? name.slice(0, 1).toUpperCase() : <LuUser size={18} />}
              </div>
            )}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
