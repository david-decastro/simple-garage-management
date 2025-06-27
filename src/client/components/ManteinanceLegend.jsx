import { useTranslation } from "react-i18next";
import { maintenanceConfig } from "../enums/MaintenanceIcons.js";

export default function MaintenanceLegend() {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 p-2 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {Object.entries(maintenanceConfig).map(([key, config]) => (
          <div key={key} className="flex items-center gap-2">
            <div className="text-lg">
              <config.icon className={config.color} />
            </div>
            <span className="text-sm text-gray-600">
              {t(config.translationKey)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
