import { useTranslation } from "react-i18next";

export default function InspectionNotesTab({ notes }) {
  const { t } = useTranslation();

  if (notes) {
    return <span className="px-4">{notes}</span>;
  } else {
    return <span className="px-4">{t("inspections.detail.no-notes")}</span>;
  }
}
