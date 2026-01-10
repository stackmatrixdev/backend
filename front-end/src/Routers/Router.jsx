import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../Pages/Home/Home";
import DashboardMainPage from "../components/Admin/Dashboard/AdminDashboard";
import QuizCreator from "../components/Admin/Quizz/CreateNewQuizz";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import LoginForm from "../Pages/Auth/LoginForm";
import SignUpPage from "../Pages/Auth/SignUpPage";
import ForgotPasswordPage from "../Pages/Auth/ForgotPasswordPage";
import OtpPage from "../Pages/Auth/OtpPage";
import ResetPasswordPage from "../Pages/Auth/ResetPasswordPage";
import Dashboard from "../Pages/Dashboard/Dashboard";
import QuizResultPage from "../Pages/QuizInterface/QuizResultPage";
import Topics from "../Pages/Topics/Topics";
import MovingCarTabs from "../Pages/Overview/MovingCarTabs";
import Features from "../components/Features/Features";
import Terms from "../components/Terms&Policy/Terms";
import Privacy from "../components/Terms&Policy/Privacy";
import ContactPage from "../components/ContactPage/ContactPage";
import About from "../components/About/About";
import PricingSection from "../components/PricingSection/PricingSection";
import Profile from "../Pages/Home/Profile";
import ProfileDashboard from "../Pages/Dashboard/ProfileDashboard";
import Certificates from "../Pages/Home/Certificates";
import { UserAcc } from "../Pages/Home/UserAcc";
import Plan from "../Pages/Home/Plan";
import Form from "../components/BecomeInstructor/Form";
import QuizStart from "../Pages/QuizInterface/QuizStart";
import GuidedDashboard from "../Pages/Dashboard/GuidedDashboard";
import AdminTopics from "../components/Admin/Quizz/AdminTopics";
import CourseOverviewTab from "../Pages/Overview/CourseOverviewTab";
import AiCoachTab from "../Pages/Overview/AiCoachTab";
import DocumentationTab from "../Pages/Overview/DocumentationTab";
import CourseCompletionCertificate from "../Pages/Overview/CourseCompletionCertificate";
import ExamSimulatorTab from "../Pages/Overview/ExamSimulatorTab";
import PaymentSuccess from "../Pages/Payment/PaymentSuccess";
import PaymentCancel from "../Pages/Payment/PaymentCancel";

// Import route protection components
import { PrivateRoute, AdminRoute } from "./PrivetRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <h1>404</h1>,
  },
  {
    element: (
      <>
        <Navbar />
        <Outlet />
        <Footer />
      </>
    ),
    children: [
      {
        path: "/quiz",
        element: <QuizStart />,
      },
      {
        path: "/topics",
        element: <Topics />,
      },
      {
        path: "/overview/:id",
        element: <MovingCarTabs />,
        children: [
          {
            path: "course-overview",
            element: <CourseOverviewTab />,
          },
          {
            path: "documentation",
            element: <DocumentationTab />,
          },
          {
            path: "ai-coach",
            element: <AiCoachTab />,
          },

          {
            path: "exam-simulator",
            element: <ExamSimulatorTab />,
          },
          {
            path: "certification",
            element: <CourseCompletionCertificate />,
          },
          {
            path: "quiz-result",
            element: <QuizResultPage />,
          },
        ],
      },
      {
        path: "/features",
        element: <Features />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/privacy",
        element: <Privacy />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/pricing",
        element: <PricingSection />,
      },
      {
        path: "/form",
        element: <Form />,
      },
      {
        path: "/lang",
        element: <></>,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <SignUpPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/otp",
    element: <OtpPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute allowedRoles={["user", "admin"]}>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/guided",
    element: (
      <PrivateRoute allowedRoles={["user", "admin"]}>
        <GuidedDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <DashboardMainPage />
      </AdminRoute>
    ),
  },
  {
    path: "/profile-dashboard",
    element: (
      <PrivateRoute allowedRoles={["user", "admin"]}>
        <ProfileDashboard />
      </PrivateRoute>
    ),
    children: [
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "certificates",
        element: <Certificates />,
      },
      {
        path: "user-acc",
        element: <UserAcc />,
      },
      {
        path: "plan",
        element: <Plan />,
      },
      {
        path: "terms",
        element: <Terms />,
      },
      {
        path: "privacy",
        element: <Privacy />,
      },
    ],
  },
  {
    path: "/admin/create-quizz",
    element: (
      <AdminRoute>
        <QuizCreator />
      </AdminRoute>
    ),
  },
  {
    path: "/admin/topics",
    element: (
      <AdminRoute>
        <AdminTopics />
      </AdminRoute>
    ),
  },
  {
    path: "/payment/success",
    element: <PaymentSuccess />,
  },
  {
    path: "/payment/cancel",
    element: <PaymentCancel />,
  },
]);
