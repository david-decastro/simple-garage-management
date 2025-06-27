import { useTranslation } from "react-i18next";
import TableLoading from "../../../../components/TableLoading.jsx";
import PaginationControls from "../../../../components/PaginationControls.jsx";
import { useCallback, useEffect, useState } from "react";
import { usePagination } from "../../../../hooks/usePagination.js";
import ConfirmationModal from "../../../../modals/ConfirmationModal.jsx";
import InspectionPartRow from "./InspectionPartRow.jsx";
import InspectionsRepository from "../../../../repositories/InspectionsRepository.js";
import InspectionPartsRepository from "../../../../repositories/InspectionPartsRepository.js";
import InspectionPartDetailModal from "../../../../modals/InspectionPartDetailModal.jsx";
import { handleRequestError } from "../../../../utils/errorController.js";

export default function InspectionPartsTab({
  inspectionId,
  editing = false,
  reloadTrigger,
}) {
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
  const [deleteModal, setDeleteModal] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);

  const fetchInspectionParts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await InspectionsRepository.getParts(inspectionId, {
        page,
        size,
        sortBy,
      });
      setInspectionParts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (e) {
      handleRequestError(e);
    } finally {
      setLoading(false);
    }
  }, [inspectionId, page, setTotalPages, size, sortBy]);

  useEffect(() => {
    fetchInspectionParts();
  }, [fetchInspectionParts, inspectionId, reloadTrigger, setTotalPages]);

  const onPageChange = useCallback(
    (diff) => {
      turnPage(diff);
    },
    [turnPage]
  );

  const openDeleteModal = (inspectionPart) => {
    setItemSelected(inspectionPart);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setItemSelected(null);
    setDeleteModal(false);
  };

  const openDetailModal = (inspectionPart) => {
    setItemSelected(inspectionPart);
    setDetailModal(true);
  };

  const closeDetailModal = () => {
    setItemSelected(null);
    setDetailModal(false);
  };

  const deleteInspectionPart = useCallback(async () => {
    closeDeleteModal();
    setLoading(true);
    try {
      await InspectionPartsRepository.delete(itemSelected._id);
      if (page > 1 && inspectionParts?.length === 1) {
        turnPage(-1);
      } else {
        await fetchInspectionParts();
      }
    } catch (e) {
      handleRequestError(e);
    } finally {
      setLoading(false);
    }
  }, [
    fetchInspectionParts,
    page,
    turnPage,
    itemSelected,
    inspectionParts?.length,
  ]);

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
                  editing={editing}
                  key={inspectionPart._id}
                  inspectionPart={inspectionPart}
                  onDetail={() => openDetailModal(inspectionPart)}
                  onDelete={() => openDeleteModal(inspectionPart)}
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
      {deleteModal && (
        <ConfirmationModal
          message={{
            i18nKey: "parts.messages.delete-confirm",
            values: {
              part: `${itemSelected.name}`,
            },
          }}
          acceptClassName={"bg-red-500"}
          acceptMsg={t("common.actions.remove")}
          onAccept={deleteInspectionPart}
          onCancel={closeDeleteModal}
        />
      )}

      {detailModal && (
        <InspectionPartDetailModal
          inspectionPart={itemSelected}
          onClose={closeDetailModal}
        />
      )}
    </>
  );
}
