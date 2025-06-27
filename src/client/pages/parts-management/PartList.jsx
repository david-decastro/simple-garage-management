import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePagination } from "../../hooks/usePagination.js";
import ConfirmationModal from "../../modals/ConfirmationModal.jsx";
import PartsRepository from "../../repositories/PartsRepository.js";
import PartsTable from "./components/PartsTable.jsx";
import { IoMdAdd } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { MdWarning } from "react-icons/md";
import { PartListFilters } from "./components/PartListFilters.jsx";
import { sendNotification } from "../../plugins/notifications.jsx";
import { handleRequestError } from "../../utils/errorController.js";
import { IoFilter } from "react-icons/io5";

export default function PartList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [parts, setParts] = useState([]);
  const {
    page,
    size,
    sortBy,
    sortOrder,
    totalPages,
    turnPage,
    setPage,
    setTotalPages,
  } = usePagination({
    sortBy: "date",
    sortOrder: "desc",
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [partToDelete, setPartToDelete] = useState(null);

  const fetchParts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await PartsRepository.getAll(filters, {
        page,
        size,
        sortBy,
        sortOrder,
      });
      setParts(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (e) {
      handleRequestError(e);
    } finally {
      setLoading(false);
    }
  }, [filters, page, size, sortBy, sortOrder, setTotalPages]);

  useEffect(() => {
    fetchParts();
  }, [fetchParts, page]);

  const onPageChange = useCallback(
    (diff) => {
      turnPage(diff);
    },
    [turnPage]
  );

  const onFiltersChange = useCallback(
    (filters) => {
      setFilters(filters);
      setPage(1);
    },
    [setPage]
  );

  const openDeleteModal = (partId) => {
    setPartToDelete(partId);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setPartToDelete(null);
    setDeleteModal(false);
  };

  const deletePart = useCallback(async () => {
    closeDeleteModal();
    setLoading(true);
    try {
      await PartsRepository.delete(partToDelete._id);
      sendNotification({
        title: t("parts.notifications.delete.title"),
        message: t("parts.notifications.delete.message"),
        type: "success",
      });
      if (page > 1 && parts?.length === 1) {
        turnPage(-1);
      } else {
        await fetchParts();
      }
    } catch (e) {
      handleRequestError(e);
    } finally {
      setLoading(false);
    }
  }, [partToDelete?._id, t, page, parts?.length, turnPage, fetchParts]);

  return (
    <>
      <div className="main-container flex flex-col items-center">
        <div className="w-full bg-white p-6 rounded-xl">
          <div className="text-center">
            <span className="text-4xl text-primary">{t("parts.title")}</span>
          </div>
          <div className="flex flex-col items-end mt-4 mb-2">
            <div className="flex gap-2">
              <button
                className="flex justify-center items-center text-white bg-gray-600 px-3 py-2 rounded text-sm"
                title={t("common.filters")}
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <IoFilter
                  className={`text-xl transition-transform duration-300 ${
                    showFilters ? "rotate-180" : "rotate-0"
                  }`}
                />
                {Object.keys(filters).length > 0 && (
                  <span className="text-orange-400">*</span>
                )}
              </button>

              <button
                className="text-white bg-green-800 px-3 py-2 rounded"
                title={t("common.actions.new")}
                onClick={() => navigate("/parts/new")}
              >
                <IoMdAdd className="inline-block text-xl mr-2" />
                {t("common.actions.new")}
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 w-full flex justify-end mb-2">
                <PartListFilters onChange={onFiltersChange} />
              </div>
            )}
          </div>
          <div className="mx-auto">
            <PartsTable
              loading={loading}
              page={page}
              totalPages={totalPages}
              parts={parts}
              onPageChange={onPageChange}
              onDelete={openDeleteModal}
            />
          </div>
        </div>
      </div>
      {deleteModal && (
        <ConfirmationModal
          title={t("parts.messages.delete-title")}
          titleIcon={<MdWarning className="text-red-600 flex text-3xl" />}
          message={{
            i18nKey: "parts.messages.delete-confirm",
            values: {
              part: `${partToDelete.name}`,
            },
          }}
          acceptMsg={t("common.actions.remove")}
          acceptClassName={"bg-red-500"}
          onAccept={deletePart}
          onCancel={closeDeleteModal}
        />
      )}
    </>
  );
}
