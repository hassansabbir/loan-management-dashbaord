import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home";
import FundingApplications from "../Pages/Dashboard/FundingApplications";
import Borrowers from "../Pages/Dashboard/Borrowers";
import BorrowerDetails from "../Pages/Dashboard/BorrowerDetails";
import Users from "../Pages/Dashboard/Users";
import OurTransactions from "../Pages/Dashboard/OurTransactions";
import Support from "../Pages/Dashboard/Support";
import Faqs from "../Pages/Dashboard/Faqs";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy";
import TermsAndCondition from "../Pages/Dashboard/TermsAndCondition";
import AboutUs from "../components/ui/Settings/AboutUs";
import Settings from "../Pages/Dashboard/Settings";
import Notifications from "../Pages/Dashboard/Notifications";
import User from "../Pages/Dashboard/User";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetPassword from "../Pages/Auth/ResetPassword";
import NotFound from "../NotFound";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Main />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/funding-applications",
        element: <FundingApplications />,
      },
      {
        path: "/borrowers",
        element: <Borrowers />,
      },
      {
        path: "/borrowers/:id",
        element: <BorrowerDetails />,
      },
      {
        path: "/transactions",
        element: <OurTransactions />,
      },
      {
        path: "/support",
        element: <Support />,
      },
      {
        path: "/faqs",
        element: <Faqs />,
      },
      {
        path: "/personal-information",
        element: <Settings defaultTab="profile" />,
      },
      {
        path: "/settings",
        element: <Settings defaultTab="profile" />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/terms-and-condition",
        element: <TermsAndCondition />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
      {
        path: "/notification",
        element: <Notifications />,
      },
      {
        path: "/notifications",
        element: <Notifications />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/profile/:id",
        element: <User />,
      },
      {
        path: "/change-password",
        element: <Settings defaultTab="password" />,
      },
    ],
  },
  {
    path: "/auth",
    element: (
      <PublicRoute>
        <Auth />
      </PublicRoute>
    ),
    children: [
      {
        path: "/auth",
        element: <Login />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
