import Loading from "../Loading.jsx";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PartsRepository from "../../repositories/PartsRepository.js";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import PartType from "../../enums/PartType.js";
import { RiOilFill } from "react-icons/ri";
import ConfirmationModal from "../../modals/ConfirmationModal.jsx";
import { MdDelete, MdWarning } from "react-icons/md";
import { sendNotification } from "../../plugins/notifications.jsx";
import { handleRequestError } from "../../utils/errorController.js";

export default function PartDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [part, setPart] = useState(null);
  const [partImage, setPartImage] = useState("/default-part.webp");

  const [deleteModal, setDeleteModal] = useState(false);

  const fetchPart = useCallback(async () => {
    setLoading(true);
    try {
      const auxPart = await PartsRepository.get(id);
      setPart(auxPart);
    } catch (e) {
      handleRequestError(e);
      navigate("/parts");
    }

    try {
      const img = await PartsRepository.getImage(id);
      if (img) {
        setPartImage(img);
      }
    } catch (e) {}
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchPart();
  }, [fetchPart]);

  const onOpenDeleteModal = useCallback(() => {
    setDeleteModal(true);
  }, []);

  const onCloseDeleteModal = useCallback(() => {
    setDeleteModal(false);
  }, []);

  const onDelete = useCallback(async () => {
    setLoading(true);
    try {
      await PartsRepository.delete(part._id);
      sendNotification({
        title: t("parts.notifications.delete.title"),
        message: t("parts.notifications.delete.message"),
        type: "success",
      });
      navigate("/parts");
    } catch (e) {
      handleRequestError(e);
    } finally {
      setLoading(false);
    }
  }, [part?._id, t, navigate]);

  if (loading) return <Loading />;

  if (!part) return <div>{t("parts.management.errors.notFound")}</div>;

  return (
    <div className="main-container flex flex-col items-center text-primary">
      <div className="w-full bg-white p-6 rounded-xl">
        <div className="flex justify-between">
          <button className="text-xl" onClick={() => navigate("/parts")}>
            <FaArrowLeft />
          </button>
          <div className="flex gap-2">
            <button
              className="inline-block justify-items-center bg-[#FFA500] w-6 h-8 rounded"
              title={t("common.actions.edit")}
              onClick={() => navigate(`/parts/${part._id}/edit`)}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="flex h-full justify-center items-center mb-8 lg:mb-0">
            {partImage ? (
              <img
                src={partImage}
                alt={part.name}
                className="rounded-lg max-h-[300px]"
              />
            ) : (
              <div className="text-gray-400">{t("parts.fields.noImage")}</div>
            )}
          </div>

          <div>
            {/* Name */}
            <span className="text-4xl font-bold mb-4 mr-2">{part.name}</span>

            {/* Oil viscosity */}
            {part.type === PartType.OIL && (
              <div className="flex items-center gap-2">
                <RiOilFill />
                <span className="text-lg text-gray-600">
                  {part.oilViscosity}
                </span>
              </div>
            )}

            {/* Barcode */}
            <div>
              <span className="text-lg text-gray-600">{part.barcode}</span>
            </div>
          </div>
        </div>
      </div>

      {/*Delete Modal*/}
      {deleteModal && (
        <ConfirmationModal
          title={t("parts.messages.delete-title")}
          titleIcon={<MdWarning className="text-red-600 flex text-3xl" />}
          message={{
            i18nKey: "parts.messages.delete-confirm",
            values: {
              part: `${part.name}`,
            },
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
