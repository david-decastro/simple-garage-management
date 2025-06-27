import { useState } from "react";
import { useTranslation } from "react-i18next";
import InspectionNotesTab from "./InspectionNotesTab.jsx";
import InspectionPartsTab from "../inspection-parts/InspectionPartsTab.jsx";

export default function InspectionDetailTabs({ inspectionId, notes }) {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("inspections");

  return (
    <div className="mt-4 w-full">
      <div className="flex border-b border-gray-300">
        <button
          onClick={() => setActiveTab("inspections")}
          className={`px-4 py-2 -mb-px border-b-2 text-lg ${
            activeTab === "inspections"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {t("inspections.fields.notes")}
        </button>
        <button
          onClick={() => setActiveTab("parts")}
          className={`px-4 py-2 -mb-px border-b-2 text-lg ${
            activeTab === "parts"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Piezas
        </button>
      </div>

      <div className="pt-4">
        {activeTab === "inspections" && <InspectionNotesTab notes={notes} />}
        {activeTab === "parts" && (
          <InspectionPartsTab inspectionId={inspectionId} />
        )}
      </div>
    </div>
  );
}
