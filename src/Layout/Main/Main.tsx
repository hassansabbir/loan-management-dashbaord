import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="min-h-screen bg-[#F4F7FC] flex text-[#0F172A]">
      {/* Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col ml-64 min-h-screen overflow-x-hidden">
        {/* Top Header Bar */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 px-6 pb-6 pt-0">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Main;
