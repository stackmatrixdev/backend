import React from "react";
import { Phone, MapPin, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Stores/authSlice";

export default function ContactBar() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="bg-black border-b border-gray-800 font-Inter">
      {/* container: keep center alignment; add responsive padding instead of fixed width on small screens */}
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-0 lg:w-10/12 xl:w-11/12 2xl:w-10/12">
        {/* layout: stack on small screens, row on md+; keep spacing tight so visuals match */}
        <div className="flex justify-between items-center gap-2 md:gap-0 py-2 text-xs sm:text-sm text-white">
          {/* left cluster: allow wrapping on small screens without altering look */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 gap-2 sm:gap-0">
            <div className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
              <Phone size={14} className="text-gray-400" />
              <span className="truncate">256 214 203 215</span>
            </div>
            <div className="flex items-center space-x-2 hover:text-primary transition-colors cursor-pointer">
              <MapPin size={14} className="text-gray-400" />
              <span className="truncate">7529 E. Pecan St.</span>
            </div>
          </div>

          {/* right cluster: keep same visuals; just ensure touch target on small screens */}
          <div className="flex items-center space-x-2 cursor-pointer hover:text-primary transition-colors group">
            <User
              size={14}
              className="group-hover:scale-110 transition-transform"
            />
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="text-left md:text-right"
                aria-label="Logout"
              >
                Logout
              </button>
            ) : (
              <Link to={"/login"} aria-label="Login or Register">
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
