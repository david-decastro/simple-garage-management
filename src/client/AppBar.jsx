import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GiAutoRepair } from "react-icons/gi";
import { FaCarSide, FaHome, FaCar, FaTimes } from "react-icons/fa";
import { TbPackages } from "react-icons/tb";

function AppBar() {
  const { t } = useTranslation();
  const location = useLocation();

  /* Mobile devices menu */
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-transparent p-4">
      <div className="flex items-center justify-between w-full">
        {/* Desktop */}
        <div className="flex items-center gap-x-6">
          <Link to="/" className="flex items-center gap-x-2">
            <img
              src="/logo.webp"
              alt="Kanano's Garage Logo"
              className="h-12 w-auto rounded-3xl"
            />
            <span className="text-white text-2xl md:text-3xl font-semibold">
              {"Simple Garage Management"}
            </span>
          </Link>

          <nav className="hidden md:flex gap-x-6">
            <Link
              to="/cars"
              className={`text-xl hover:text-red-400 transition flex items-center ${location.pathname === "/cars" ? "pointer-events-none text-red-500" : "text-white"}`}
            >
              <FaCarSide className="inline-block mr-2" />
              <span className="mr-2 text-xl">{t("menu.cars")}</span>
            </Link>
            <Link
              to="/inspections"
              className={`text-xl hover:text-red-400 transition flex items-center ${location.pathname === "/inspections" ? "pointer-events-none text-red-500" : "text-white"}`}
            >
              <GiAutoRepair className="inline-block mr-2" />
              <span>{t("menu.inspections")}</span>
            </Link>
            <Link
              to="/parts"
              className={`text-xl hover:text-red-400 transition flex items-center ${location.pathname === "/parts" ? "pointer-events-none text-red-500" : "text-white"}`}
            >
              <TbPackages className="inline-block mr-2" />
              <span>{t("menu.parts")}</span>
            </Link>
          </nav>
        </div>

        <div className="md:hidden flex items-center">
          <button
            className="text-white focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Hamburger menu overlay */}
      <div
        className={`${
          isOpen ? "fixed" : "hidden"
        } md:hidden inset-0 bg-gray-900 bg-opacity-95 z-50 min-h-screen`}
      >
        <div className="flex flex-col items-center justify-start pt-16 space-y-4">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="text-white text-xl hover:text-blue-400 transition flex items-center"
          >
            <FaHome className="inline-block mr-2" />
            <span>{t("menu.home")}</span>
          </Link>

          <Link
            to="/cars"
            onClick={() => setIsOpen(false)}
            className="text-white text-xl hover:text-blue-400 transition flex items-center"
          >
            <FaCar className="inline-block mr-2" />
            <span>{t("menu.cars")}</span>
          </Link>

          <Link
            to="/inspections"
            onClick={() => setIsOpen(false)}
            className="text-white text-xl hover:text-blue-400 transition flex items-center"
          >
            <GiAutoRepair className="inline-block mr-2" />
            <span>{t("menu.inspections")}</span>
          </Link>

          <Link
            to="/parts"
            onClick={() => setIsOpen(false)}
            className="text-white text-xl hover:text-blue-400 transition flex items-center"
          >
            <TbPackages className="inline-block mr-2" />
            <span>{t("menu.parts")}</span>
          </Link>

          {/* Botón para cerrar */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-blue-400 transition"
          >
            <FaTimes size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default AppBar;
