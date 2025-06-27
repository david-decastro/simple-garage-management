import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoMdAdd } from "react-icons/io";
import InspectionsTable from "./components/InspectionsTable.jsx";
import { usePagination } from "../../hooks/usePagination.js";
import ConfirmationModal from "../../modals/ConfirmationModal.jsx";
import InspectionsRepository from "../../repositories/InspectionsRepository.js";
import CarsRepository from "../../repositories/CarsRepository.js";
import { MdWarning } from "react-icons/md";
import { formatDate } from "../../plugins/filters.js";
import { sendNotification } from "../../plugins/notifications.jsx";
import { handleRequestError } from "../../utils/errorController.js";

export default function InspectionList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [inspections, setInspections] = useState([]);
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

  const [cars, setCars] = useState([]);
  const [filteredCar, setFilteredCar] = useState(null);
  const [loadingCars, setLoadingCars] = useState(true);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [inspectionToDelete, setInspectionToDelete] = useState(null);

  const fetchCars = useCallback(async () => {
    setLoadingCars(true);
    try {
      const data = await CarsRepository.getAllBasic(null, {
        sortBy: "brand",
      });
      setCars(data);
    } catch (e) {
      handleRequestError(e);
    } finally {
      setLoadingCars(false);
    }
  }, []);

  const fetchInspections = useCallback(async () => {
    setLoading(true);
    const filters = filteredCar ? { car: filteredCar } : {};
    try {
      const response = await InspectionsRepository.getAll(filters, {
        page,
        size,
        sortBy,
        sortOrder,
      });
      setInspections(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (e) {
      handleRequestError(e);
    } finally {
      setLoading(false);
    }
  }, [filteredCar, page, setTotalPages, size, sortBy, sortOrder]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  useEffect(() => {
    fetchInspections();
  }, [fetchInspections, page]);

  const onPageChange = useCallback(
    (diff) => {
      turnPage(diff);
    },
    [turnPage]
  );

  const openDeleteModal = (inspectionId) => {
    setInspectionToDelete(inspectionId);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setInspectionToDelete(null);
    setDeleteModal(false);
  };

  const deleteInspection = useCallback(async () => {
    closeDeleteModal();
    setLoading(true);
    try {
      await InspectionsRepository.delete(inspectionToDelete._id);
      sendNotification({
        title: t("inspections.notifications.delete.title"),
        message: t("inspections.notifications.delete.message"),
        type: "success",
      });
      if (page > 1 && inspections?.length === 1) {
        turnPage(-1);
      } else {
        await fetchInspections();
      }
    } catch (e) {
      handleRequestError(e);
    } finally {
      setLoading(false);
    }
  }, [
    inspectionToDelete?._id,
    t,
    page,
    inspections?.length,
    turnPage,
    fetchInspections,
  ]);

  const onFilterChange = useCallback(
    (e) => {
      setFilteredCar(e.target.value);
      setPage(1);
    },
    [setPage]
  );

  return (
    <>
      <div className="main-container flex flex-col items-center">
        <div className="w-full bg-white p-6 rounded-xl">
          <div className="text-center">
            <span className="text-4xl text-primary">
              {t("inspections.title")}
            </span>
          </div>
          <div className="text-right mt-4">
            <select
              id="car"
              disabled={loadingCars}
              className="w-auto border bg-white text-primary border-gray-500 rounded px-2 py-1 mr-2"
              onChange={onFilterChange}
            >
              <option value="">{t("inspections.filters.car")}</option>
              {cars.map((car) => (
                <option key={car._id} value={car._id}>
                  {`${car.brand} ${car.model}`}
                </option>
              ))}
            </select>
            <button
              className="text-white bg-green-800 px-3 py-2 my-2 rounded"
              title={t("common.actions.new")}
              onClick={() => navigate("/inspections/new")}
            >
              <IoMdAdd className="inline-block text-xl mr-2" />
              {t("common.actions.new")}
            </button>
          </div>
          <div className="mx-auto">
            <InspectionsTable
              loading={loading}
              page={page}
              totalPages={totalPages}
              inspections={inspections}
              onPageChange={onPageChange}
              onDelete={openDeleteModal}
            />
          </div>
        </div>
      </div>
      {deleteModal && (
        <ConfirmationModal
          title={t("inspections.messages.delete-title")}
          titleIcon={<MdWarning className="text-red-600 flex text-3xl" />}
          message={{
            i18nKey: "inspections.messages.delete-confirm",
            values: {
              inspection: `${inspectionToDelete.car.brand} ${inspectionToDelete.car.model}`,
              date: formatDate(inspectionToDelete.date),
            },
          }}
          acceptMsg={t("common.actions.remove")}
          acceptClassName={"bg-red-500"}
          onAccept={deleteInspection}
          onCancel={closeDeleteModal}
        />
      )}
    </>
  );
}
