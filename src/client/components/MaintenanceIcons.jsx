import React from "react";
import { useTranslation } from "react-i18next";
import { maintenanceConfig } from "../enums/MaintenanceIcons.js";

const MaintenanceIcons = ({ inspection }) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      {Object.entries(maintenanceConfig).map(
        ([key, config]) =>
          inspection[config.field] && (
            <div key={key} className="text-lg" title={t(config.translationKey)}>
              <config.icon className={config.color} />
            </div>
          )
      )}
    </div>
  );
};

export default MaintenanceIcons;
