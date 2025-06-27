import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CarsRepository from "../../repositories/CarsRepository.js";
import Loading from "../Loading.jsx";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { getCarIcon } from "../../components/CarBrandIcons.js";
import CarDetailTabs from "./components/CarDetailTabs.jsx";
import { formatDate } from "../../plugins/filters.js";
import { MdDelete, MdWarning } from "react-icons/md";
import ConfirmationModal from "../../modals/ConfirmationModal.jsx";
import { sendNotification } from "../../plugins/notifications.jsx";
import { handleRequestError } from "../../utils/errorController.js";

export default function CarDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [carImg, setCarImg] = useState("/car-default.webp");
  const [loading, setLoading] = useState(true);

  const [deleteModal, setDeleteModal] = useState(false);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const data = await CarsRepository.get(id);
        setCar(data);
      } catch (e) {
        handleRequestError(e);
        navigate("/cars");
      }
      try {
        const img = await CarsRepository.getImage(id);
        if (img) {
          setCarImg(img);
        }
      } catch (e) {}
      setLoading(false);
    };

    fetchCar();
  }, [id]);

  const onOpenDeleteModal = useCallback(() => {
    setDeleteModal(true);
  }, []);

  const onCloseDeleteModal = useCallback(() => {
    setDeleteModal(false);
  }, []);

  const onDelete = useCallback(async () => {
    setLoading(true);
    try {
      await CarsRepository.delete(car._id);
      sendNotification({
        title: t("cars.notifications.delete.title"),
        message: t("cars.notifications.delete.message"),
        type: "success",
      });
      navigate("/cars");
    } catch (e) {
      handleRequestError(e);
    } finally {
      setLoading(false);
    }
  }, [car?._id, navigate, t]);

  if (loading) {
    return <Loading />;
  }

  if (!car) {
    return (
      <div className="text-center mt-8">{t("common.error.not-found")}</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 text-primary">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between">
          <button className="text-xl" onClick={() => navigate("/cars")}>
            <FaArrowLeft />
          </button>
          <div className="flex gap-2">
            <button
              className="inline-block justify-items-center bg-[#FFA500] w-6 h-8 rounded"
              title={t("common.actions.edit")}
              onClick={() => navigate(`/cars/${car._id}/edit`)}
            >
              <FaEdit />
            </button>
            <button
              className="inline-block justify-items-center bg-red-700 text-white w-6 h-8 rounded"
              title={t("common.actions.remove")}
              onClick={onOpenDeleteModal}
            >
              <MdDelete />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <div className="flex justify-center">
            <img
              src={carImg}
              alt={car.model}
              className="relative w-[500px] h-[300px] rounded-lg object-cover"
            />
          </div>
          <div className=" text-center lg:text-left mt-4 lg:mt-0">
            <div>
              <div className="inline-block">
                {(() => {
                  const { icon: BrandIcon, color } = getCarIcon(car.brand);
                  return (
                    <BrandIcon className="text-2xl mr-2" style={{ color }} />
                  );
                })()}
              </div>
              <span className="text-4xl font-bold mb-4 mr-2">{`${car.brand} ${car.model}`}</span>
              <span className="text-xl">({car.plate})</span>
            </div>
            <div>
              <span className="text-gray-600">{`${car.year} - ${t(`enum.fuel-type.${car.fuel}`)}`}</span>
            </div>
            <div>
              <span className="text-gray-600">{`> ${car.mileage.toLocaleString()} km`}</span>
            </div>
            <div className="mt-4">
              <span className="text-gray-600">
                {t("cars.detail.itv", {
                  date: formatDate(car.itvDate) || "N/A",
                })}
              </span>
            </div>
          </div>
        </div>
        <CarDetailTabs carId={car._id} />
      </div>

      {/* DELETE MODAL */}
      {deleteModal && (
        <ConfirmationModal
          title={t("cars.messages.delete-title")}
          titleIcon={<MdWarning className="text-red-600 flex text-3xl" />}
          message={{
            i18nKey: "cars.messages.delete-confirm",
            values: { car: `${car.brand} ${car.model}` },
          }}
          acceptMsg={t("common.actions.remove")}
          acceptClassName={"bg-red-500"}
          onAccept={onDelete}
          onCancel={onCloseDeleteModal}
        />
      )}
    </div>
  );
}
