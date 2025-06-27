import { useTranslation } from "react-i18next";
import { useCallback, useEffect, useState } from "react";
import { usePagination } from "../../../hooks/usePagination.js";
import TableLoading from "../../../components/TableLoading.jsx";
import InspectionPartRow from "../../inspections-management/components/inspection-parts/InspectionPartRow.jsx";
import PaginationControls from "../../../components/PaginationControls.jsx";
import InspectionPartDetailModal from "../../../modals/InspectionPartDetailModal.jsx";
import InspectionPartsRepository from "../../../repositories/InspectionPartsRepository.js";
import { handleRequestError } from "../../../utils/errorController.js";

export default function CarDetailPartsTable({ carId }) {
  const { t } = useTranslation();
  const { page, size, sortBy, totalPages, turnPage, setTotalPages } =
    usePagination({
      setUrlParams: false,
      sortBy: "name",
      sortOrder: "desc",
    });

  const [loading, setLoading] = useState(true);
  const [inspectionParts, setInspectionParts] = useState([]);

  // Delete modal
  const [detailModal, setDetailModal] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);

  const fetchInspectionParts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await InspectionPartsRepository.getAll(
        { carId },
        {
          page,
          size,
          sortBy,
        }
      );
      setInspectionParts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (e) {
      handleRequestError(e);
    } finally {
      setLoading(false);
    }
  }, [carId, page, setTotalPages, size, sortBy]);

  useEffect(() => {
    fetchInspectionParts();
  }, [fetchInspectionParts, carId, setTotalPages]);

  const onPageChange = useCallback(
    (diff) => {
      turnPage(diff);
    },
    [turnPage]
  );

  const openDetailModal = (inspectionPart) => {
    setItemSelected(inspectionPart);
    setDetailModal(true);
  };

  const closeDetailModal = () => {
    setItemSelected(null);
    setDetailModal(false);
  };

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
              <th className="whitespace-nowrap px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/6">
                {t("parts.fields.quantity")}
              </th>
              <th className="whitespace-nowrap px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/6">
                {t("parts.fields.price")}
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
            ) : inspectionParts.length === 0 ? (
              <tr>
                <td colSpan="100%" className="text-center text-primary py-4">
                  {t("common.no-data")}
                </td>
              </tr>
            ) : (
              inspectionParts.map((inspectionPart) => (
                <InspectionPartRow
                  key={inspectionPart._id}
                  inspectionPart={inspectionPart}
                  onDetail={() => openDetailModal(inspectionPart)}
                />
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

      {/* MODALS */}
      {detailModal && (
        <InspectionPartDetailModal
          inspectionPart={itemSelected}
          onClose={closeDetailModal}
        />
      )}
    </>
  );
}
