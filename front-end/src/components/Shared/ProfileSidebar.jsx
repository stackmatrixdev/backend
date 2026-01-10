import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaCog, FaChevronDown, FaSignOutAlt, FaReact } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { IoSettingsOutline, IoTrophyOutline } from "react-icons/io5";
import logo from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Stores/authSlice";
export const ProfileSidebar = ({ currentComponent, onMenuClick }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const settingsItems = [
    { name: "Account Setting", go: "/profile-dashboard/user-acc" },
    { name: "Current Plan", go: "/profile-dashboard/plan" },
    { name: "Terms & Conditions", go: "/profile-dashboard/terms" },
    { name: "Privacy Policies", go: "/profile-dashboard/privacy" },
  ];
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const handleLogout = () => {
    navigate("/");
    dispatch(logout());
  };
  const menuLinks = [
    {
      icon: <MdOutlineDashboard size={22} />,
      label: "Dashboard",
      go: "/profile-dashboard/profile",
    },
    {
      icon: <FaReact size={22} />,
      label: "AI Assistant",
      go: "/dashboard",
    },
    {
      icon: <IoTrophyOutline size={22} />,
      label: "Certificate",
      go: "/profile-dashboard/certificates",
    },
  ];

  return (
    <div
      className="h-screen bg-[#97D0FA] flex flex-col items-center pt-10 relative"
      style={{ minWidth: 220 }}
    >
      {/* Logo */}
      <Link to={"/"}>
        <div className="flex items-center space-x-2 mb-12">
          <img src={logo} className="w-12" alt="" />
          <p className="text-[#011F47] font-bold text-2xl">
            Learnin<span className="text-primary">GPT</span>
          </p>
        </div>
      </Link>
      {/* Navigation Links */}
      <nav className="w-full flex flex-col items-center">
        <ul className="flex flex-col gap-2 items-center">
          {menuLinks.map((item, idx) => (
            <li key={idx} className="w-full">
              <NavLink
                to={item.go}
                className={({ isActive }) =>
                  `flex items-center w-48 h-12 pl-4 text-start rounded-lg transition-colors gap-3 font-semibold text-lg hover:bg-gradient-to-r hover:from-[#1E90FF] hover:to-[#0E5F98] hover:text-white ` +
                  (isActive
                    ? "bg-gradient-to-r from-[#1E90FF] to-[#0E5F98] text-white"
                    : "bg-transparent text-black hover:bg-[#e8f5ff]")
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Settings Dropdown */}
        <div className="relative w-full flex flex-col mt-2 items-center">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center w-48 h-12 p-4 text-start rounded-lg transition-colors gap-3 font-semibold text-lg bg-transparent text-black hover:bg-gradient-to-r hover:from-[#1E90FF] hover:to-[#0E5F98] hover:text-white"
          >
            <IoSettingsOutline size={20} />
            <span>Settings</span>
            <FaChevronDown size={18} className="ml-auto" />
          </button>
          {open && (
            <div className="absolute left-10 top-12 mt-1 w-48 bg-[#2885CA] text-black rounded-lg z-50">
              <div className="flex flex-col overflow-hidden gap-0.5">
                {settingsItems.map((item, idx) => (
                  <NavLink
                    key={idx}
                    to={item.go}
                    className={({ isActive }) =>
                      `px-4 py-2 text-sm text-left rounded-lg transition-colors ` +
                      (isActive
                        ? "bg-gradient-to-r from-[#1E90FF] to-[#0E5F98] text-white"
                        : "text-black hover:text-white hover:bg-[#1E90FF]/20")
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center">
        <button
          onClick={handleLogout}
          className="flex items-center justify-center font-normal text-lg space-x-2 px-4 py-2 text-black rounded-full transition-colors hover:bg-[#e8f5ff]"
        >
          <FaSignOutAlt size={20} />
          <span className="font-medium text-lg">Logout</span>
        </button>
      </div>
    </div>
  );
};
