import { useNavigate } from "react-router-dom";
import logo from "../../../assets/admin-dashboard-images/main-logo.png";
import { Settings, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";

export const Sidebar = ({ currentComponent, onMenuClick }) => {
  const [open, setOpen] = useState(false);
  const dashboard = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M13 9V3h8v6zM3 13V3h8v10zm10 8V11h8v10zM3 21v-6h8v6zm2-10h4V5H5zm10 8h4v-6h-4zm0-12h4V5h-4zM5 19h4v-2H5zm4-2"
      ></path>
    </svg>
  );

  // const monetiazaionIcon = () => (
  //   <svg
  //     xmlns="http://www.w3.org/2000/svg"
  //     width={24}
  //     height={24}
  //     viewBox="0 0 32 32"
  //   >
  //     <path
  //       fill="currentColor"
  //       d="M7 4a1 1 0 0 0-.894.553l-4 8a1 1 0 0 0 .118 1.078l13 16a1 1 0 0 0 1.552 0l13-16a1 1 0 0 0 .118-1.078l-4-8A1 1 0 0 0 25 4zm-2.382 8l3-6h4.101l-1.5 6zm.483 2h5.164l3.227 10.328zm7.26 0h7.279L16 25.647zm9.374 0H26.9l-8.391 10.328zm5.647-2h-5.601l-1.5-6h4.101zm-7.663 0h-7.438l1.5-6h4.438z"
  //     ></path>
  //   </svg>
  // );

  const quizzIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M21.715 8.804v2.21a.75.75 0 1 1-1.5 0v-2.21a2 2 0 0 0-.13-.76l-7.3 4.38v8.19a1.6 1.6 0 0 0 .33-.14l2.53-1.4a.75.75 0 0 1 1 .29a.75.75 0 0 1-.3 1l-2.52 1.4a3.72 3.72 0 0 1-3.62 0l-6-3.3a3.79 3.79 0 0 1-1.92-3.27v-6.39c0-.669.18-1.325.52-1.9q.086-.155.2-.29a1 1 0 0 1 .12-.15a3.45 3.45 0 0 1 1.08-.93l6-3.31a3.81 3.81 0 0 1 3.62 0l6 3.31c.42.231.788.548 1.08.93l.12.15q.113.135.2.29a3.64 3.64 0 0 1 .49 1.9"
      ></path>
      <path
        fill="currentColor"
        d="M19.395 17.944a.76.76 0 0 1-.75-.75v-.31c.004-.32.105-.63.29-.89a1.6 1.6 0 0 1 .73-.56l.16-.09a.4.4 0 0 0 .09-.13q.015-.075 0-.15a.5.5 0 0 0 0-.16a.5.5 0 0 0-.15-.15a.6.6 0 0 0-.89.23a.75.75 0 1 1-1.36-.63a2.11 2.11 0 0 1 2.27-1.18a2 2 0 0 1 .85.36a1.89 1.89 0 0 1 .82 1.49c.002.267-.049.532-.15.78a1.8 1.8 0 0 1-.45.64c-.192.18-.421.316-.67.4v.35a.75.75 0 0 1-.79.75m-.02 1.7a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5"
      ></path>
    </svg>
  );

  const menuItems = [
    { icon: dashboard, label: "Dashboard", active: true },
    { icon: quizzIcon, label: "Quizz" },
    // { icon: monetiazaionIcon, label: "Monetization" },
  ];

  const settingsItems = ["Account", "Terms & Conditions", "Privacy Policies"];
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };
  return (
    <div className="h-full bg-[#97D0FA] shadow-sm flex flex-col items-center">
      {/* Logo */}
      <div className="p-6 mb-16">
        <img src={logo} className="w-[168px] h-[70px] mx-auto" alt="" />
      </div>

      {/* Navigation */}
      <nav className="">
        <ul className="">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentComponent === item.label;
            return (
              <li key={index}>
                <button
                  onClick={() => onMenuClick(item.label)}
                  className={`flex items-center w-48 h-12 pl-2 text-start rounded-lg transition-colors mb-5 gap-2
    ${
      isActive
        ? "bg-gradient-to-r from-[#1E90FF] to-[#0E5F98] text-white"
        : "text-black"
    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-normal text-xl">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="relative inline-block text-left">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center w-48 h-12 pl-2 text-start rounded-lg transition-colors mx-6 mb-5 gap-2"
        >
          <Settings className="w-5 h-5" />
          <span className="font-normal text-xl">Settings</span>
          <ChevronDown className="w-5 h-5" />
        </button>

        {/* Dropdown menu */}
        {open && (
          <div className="absolute left-6 top-10 mt-2 w-48 shadow-lg z-50">
            <div className="flex flex-col overflow-hidden gap-0.5">
              {settingsItems.map((item, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => onMenuClick(item)}
                    className="px-4 py-2 text-white text-sm text-left bg-[#0096FF] rounded-md"
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex items-center justify-center mx-auto px-4 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center font-normal text-xl space-x-3 px-3 py-2 text-black rounded-full transition-colors"
          >
            <LogOut color="#000000" />
            <span className="font-medium text-xl">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
