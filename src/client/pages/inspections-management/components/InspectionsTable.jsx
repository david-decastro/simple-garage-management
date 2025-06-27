import { useTranslation } from "react-i18next";
import TableLoading from "../../../components/TableLoading.jsx";
import MaintenanceLegend from "../../../components/ManteinanceLegend.jsx";
import InspectionRow from "./InspectionRow.jsx";
import PaginationControls from "../../../components/PaginationControls.jsx";

export default function InspectionsTable({
  loading,
  page,
  totalPages,
  inspections,
  onDelete,
  onPageChange,
}) {
  const { t } = useTranslation();

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded border-gray-200">
          <thead>
            <tr className="bg-gray-200 border-b">
              <th className="whitespace-nowrap px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/8">
                {t("inspections.fields.date")}
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/6">
                {t("inspections.fields.car")}
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/6">
                {t("inspections.fields.type")}
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/6">
                {t("inspections.fields.maintenance")}
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/4">
                {t("common.actions.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="100%">
                  <TableLoading />
                </td>
              </tr>
            ) : inspections.length === 0 ? (
              <tr>
                <td colSpan="100%" className="text-center text-primary py-4">
                  {t("common.no-data")}
                </td>
              </tr>
            ) : (
              inspections.map((inspection) => (
                <InspectionRow
                  key={inspection._id}
                  inspection={inspection}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      <MaintenanceLegend />
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
