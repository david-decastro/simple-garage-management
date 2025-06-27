import { CgDetailsMore } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TableLoading from "../../../components/TableLoading.jsx";
import { formatDate } from "../../../plugins/filters.js";
import { useCallback, useEffect, useState } from "react";
import InspectionsRepository from "../../../repositories/InspectionsRepository.js";
import { usePagination } from "../../../hooks/usePagination.js";
import PaginationControls from "../../../components/PaginationControls.jsx";
import MaintenanceIcons from "../../../components/MaintenanceIcons.jsx";
import MaintenanceLegend from "../../../components/ManteinanceLegend.jsx";
import { handleRequestError } from "../../../utils/errorController.js";

export default function CarDetailInspectionsTable({ carId }) {
  const { t } = useTranslation();
  const { page, size, sortBy, totalPages, turnPage, setTotalPages } =
    usePagination({
      setUrlParams: false,
      sortBy: "date",
    });

  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInspections = async () => {
      setLoading(true);
      try {
        const response = await InspectionsRepository.getAll(
          { car: carId },
          {
            page,
            size,
            sortBy,
          }
        );
        setInspections(response.data);
        setTotalPages(response.pagination.totalPages);
      } catch (e) {
        handleRequestError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInspections();
  }, [carId, page, setTotalPages, size, sortBy]);

  const onPageChange = useCallback(
    (diff) => {
      turnPage(diff);
    },
    [turnPage]
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded border-gray-200">
        <thead>
          <tr className="bg-gray-200 border-b">
            <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/8">
              {t("inspections.fields.date")}
            </th>
            <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/4">
              {t("inspections.fields.type")}
            </th>
            <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/4">
              {t("inspections.fields.mileage")}
            </th>
            <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/4">
              {t("inspections.fields.maintenance")}
            </th>
            <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/4">
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
              <Row key={inspection._id} inspection={inspection} />
            ))
          )}
        </tbody>
      </table>
      <MaintenanceLegend />
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

function Row({ inspection }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <tr
      key={inspection._id}
      className="border-b-0 last:border-b-inherit hover:bg-gray-50"
    >
      <td className="px-6 py-4 text-lg text-gray-700 inline-flex items-center">
        <span> {formatDate(inspection.date)} </span>
      </td>
      <td className="px-6 py-4 text-lg text-gray-700">
        {t(`enum.inspection-type.${inspection.type}`)}
      </td>
      <td className="px-6 py-4 text-lg text-gray-700">
        {`${inspection.mileage.toLocaleString()} km`}
      </td>
      <td className="pl-6">
        <MaintenanceIcons inspection={inspection} />
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        <button
          className="inline-block bg-blue-600 text-white px-3 py-2 mr-2 rounded"
          title={t("common.actions.detail")}
          onClick={() => navigate(`/inspections/${inspection._id}`)}
        >
          <CgDetailsMore />
        </button>
      </td>
    </tr>
  );
}
