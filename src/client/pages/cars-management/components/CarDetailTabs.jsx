import { useState } from "react";
import CarDetailInspectionsTable from "./CarDetailInspectionsTable.jsx";
import { useTranslation } from "react-i18next";
import CarDetailPartsTable from "./CarDetailPartsTable.jsx";

export default function CarDetailTabs({ carId }) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("inspections");

  return (
    <div className="mt-4 w-full">
      <div className="flex border-b border-gray-300">
        <button
          onClick={() => setActiveTab("inspections")}
          className={`px-4 py-2 -mb-px border-b-2 font-medium ${
            activeTab === "inspections"
              ? "border-red-500 text-red-500"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {t("inspections.title")}
        </button>
        <button
          onClick={() => setActiveTab("parts")}
          className={`px-4 py-2 -mb-px border-b-2 font-medium ${
            activeTab === "parts"
              ? "border-red-500 text-red-500"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {t("parts.title")}
        </button>
      </div>

      <div className="pt-4">
        {activeTab === "inspections" && (
          <CarDetailInspectionsTable carId={carId} />
        )}
        {activeTab === "parts" && <CarDetailPartsTable carId={carId} />}
      </div>
    </div>
  );
}
