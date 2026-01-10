import { useState } from "react";
import { Sidebar } from "../Sidebar/Sidebar";
import { StartCards } from "./StartCards";

import { Menu, X } from "lucide-react"; // Menu & Close icons যোগ হলো

import profile from "../../../assets/admin-dashboard-images/profile.png";
import { Quizz } from "../Quizz/Quizz";
// import Monetization from "../Monitization/Monitization";
import { Account } from "../Settings/Account";
import Privacy from "../Settings/Privacy";
import Terms from "../Settings/Terms";

export default function DashboardMainPage() {
  const [currentComponent, setCurrentComponent] = useState("Dashboard"); // New state to track the active component
  const [isOpen, setIsOpen] = useState(false); // sidebar toggle state

  const handleComponentChange = (component) => {
    setCurrentComponent(component);
    setIsOpen(false); // mobile এ menu item ক্লিক করলে sidebar auto-close হবে
  };
  return (
    <div className="flex bg-[#EEF6FF] font-poppins">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#1E90FF] text-white rounded-md"
      >
        {isOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen transform bg-white shadow-md z-40 transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0 lg:w-72`}
      >
        <Sidebar
          currentComponent={currentComponent}
          onMenuClick={handleComponentChange}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-0 lg:ml-72 min-h-screen">
        {/* Header */}
        <div className="bg-[#EEF6FF] px-6 h-20 flex items-center justify-end">
          <div className="flex items-center justify-end gap-9">
            {/* <MessageSquareDot color="#1E90FF" /> */}
            <img
              src={profile}
              alt="profile"
              className="w-12 h-12"
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 bg-[#EEF6FF]">
          {/* Conditionally render the component based on the state */}
          {currentComponent === "Dashboard" && (
            <div className="">
              {/* Status Cards */}
              <StartCards />
            </div>
          )}
          {currentComponent === "Quizz" && <Quizz />}
          {/* {currentComponent === "Monetization" && <Monetization />} */}
          {currentComponent === "Account" && <Account />}
          {currentComponent === "Terms & Conditions" && <Terms />}
          {currentComponent === "Privacy Policies" && <Privacy />}
        </div>
      </div>
    </div>
  );
}
