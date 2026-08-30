import GeneralStateSection from "@/components/ui/Home/GeneralStateSection";
import FundingChart from "@/components/ui/Home/FundingChart";
import RecentApplicationsTable from "@/components/ui/Home/RecentApplicationsTable";

const Home = () => {
  return (
    <div className="space-y-4 pb-6">
      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          System Overview
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Real-time revenue-based financing health metrics.
        </p>
      </div>

      {/* Top Stat Cards */}
      <GeneralStateSection />

      {/* Funding vs Repayments Chart */}
      <FundingChart />

      {/* Recent Applications Table */}
      <RecentApplicationsTable />
    </div>
  );
};

export default Home;
