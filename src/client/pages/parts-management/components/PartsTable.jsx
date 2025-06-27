import { useTranslation } from "react-i18next";
import TableLoading from "../../../components/TableLoading.jsx";
import PaginationControls from "../../../components/PaginationControls.jsx";
import PartRow from "./PartRow.jsx";

export default function PartsTable({
  loading,
  page,
  totalPages,
  parts,
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
                {t("parts.fields.name")}
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/6">
                {t("parts.fields.barcode")}
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
            ) : parts.length === 0 ? (
              <tr>
                <td colSpan="100%" className="text-center text-primary py-4">
                  {t("common.no-data")}
                </td>
              </tr>
            ) : (
              parts.map((part) => (
                <PartRow key={part._id} part={part} onDelete={onDelete} />
              ))
            )}
          </tbody>
        </table>
      </div>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  );
}
