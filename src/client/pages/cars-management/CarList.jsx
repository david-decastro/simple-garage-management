import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IoMdAdd } from "react-icons/io";
import CarsTable from "./components/CarsTable.jsx";
import { usePagination } from "../../hooks/usePagination.js";
import ConfirmationModal from "../../modals/ConfirmationModal.jsx";
import CarsRepository from "../../repositories/CarsRepository.js";
import { MdWarning } from "react-icons/md";
import { sendNotification } from "../../plugins/notifications.jsx";

export default function CarList() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [cars, setCars] = useState([]);
  const { page, size, sortBy, totalPages, turnPage, setTotalPages } =
    usePagination({
      sortBy: "brand",
    });
  const [loading, setLoading] = useState(true);

  // Delete modal
  const [deleteModal, setDeleteModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);

  const fetchCars = useCallback(async () => {
    setLoading(true);
    const response = await CarsRepository.getAll(null, {
      page,
      size,
      sortBy,
    });
    setCars(response.data);
    setTotalPages(response.pagination.totalPages);
    setLoading(false);
  }, [page, setTotalPages, size, sortBy]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars, page]);

  const onPageChange = useCallback(
    (diff) => {
      turnPage(diff);
    },
    [turnPage]
  );

  const openDeleteModal = (carId) => {
    setCarToDelete(carId);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setCarToDelete(null);
    setDeleteModal(false);
  };

  const deleteCar = useCallback(async () => {
    closeDeleteModal();
    setLoading(true);
    await CarsRepository.delete(carToDelete._id);
    sendNotification({
      title: t("cars.notifications.delete.title"),
      message: t("cars.notifications.delete.message"),
      type: "success",
    });
    if (page > 1 && cars?.length === 1) {
      turnPage(-1);
    } else {
      await fetchCars();
    }
    setLoading(false);
  }, [carToDelete?._id, t, page, cars?.length, turnPage, fetchCars]);

  return (
    <>
      <div className="main-container flex flex-col items-center">
        <div className="w-full bg-white p-6 rounded-xl">
          <div className="text-center">
            <span className="text-4xl text-primary">{t("cars.title")}</span>
          </div>
          <div className="text-right mt-4">
            <button
              className="text-white bg-green-800 px-3 py-2 my-2 rounded"
              title={t("common.actions.new")}
              onClick={() => navigate("/cars/new")}
            >
              <IoMdAdd className="inline-block text-xl mr-2" />
              {t("common.actions.new")}
            </button>
          </div>
          <div className="mx-auto">
            <CarsTable
              loading={loading}
              page={page}
              totalPages={totalPages}
              cars={cars}
              onPageChange={onPageChange}
              onDelete={openDeleteModal}
            />
          </div>
        </div>
      </div>
      {deleteModal && (
        <ConfirmationModal
          title={t("cars.messages.delete-title")}
          titleIcon={<MdWarning className="text-red-600 flex text-3xl" />}
          message={{
            i18nKey: "cars.messages.delete-confirm",
            values: { car: `${carToDelete.brand} ${carToDelete.model}` },
          }}
          acceptMsg={t("common.actions.remove")}
          acceptClassName={"bg-red-500"}
          onAccept={deleteCar}
          onCancel={closeDeleteModal}
        />
      )}
    </>
  );
}
