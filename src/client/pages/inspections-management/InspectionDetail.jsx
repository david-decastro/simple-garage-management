import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Loading from "../Loading.jsx";
import CarsRepository from "../../repositories/CarsRepository.js";
import InspectionsRepository from "../../repositories/InspectionsRepository.js";
import {
  FaArrowLeft,
  FaEdit,
  FaFileInvoice,
  FaHandHoldingUsd,
} from "react-icons/fa";
import { formatDate, formatPrice } from "../../plugins/filters.js";
import { maintenanceConfig } from "../../enums/MaintenanceIcons.js";

import paymentStatusStyles from "../../enums/styles/InspectionPaymentStatus.module.css";
import InspectionPaymentStatusIcons from "../../icons/InspectionPaymentStatusIcons.js";
import InspectionTypeIcons from "../../icons/InspectionTypeIcons.js";
import InspectionDetailTabs from "./components/detail-tabs/InspectionDetailTabs.jsx";
import { TbPackages } from "react-icons/tb";
import { MdDelete, MdWarning } from "react-icons/md";
import ConfirmationModal from "../../modals/ConfirmationModal.jsx";
import PdfPreviewerModal from "../../modals/PdfPreviewerModal.jsx";
import { sendNotification } from "../../plugins/notifications.jsx";
import { handleRequestError } from "../../utils/errorController.js";

export default function InspectionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [inspection, setInspection] = useState(null);
  const [invoiceFile, setInvoiceFile] = useState(null);

  const [car, setCar] = useState(null);
  const [carImg, setCarImg] = useState("/car-default.webp");

  const [previewerModal, setPreviewerModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // Icons
  const TypeIcon = InspectionTypeIcons[inspection?.type];
  const PaymentStatusIcon =
    InspectionPaymentStatusIcons[inspection?.paymentStatus];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchedInspection = await InspectionsRepository.get(id);
        setInspection(fetchedInspection);
        if (fetchedInspection.car) {
          const carData = await CarsRepository.get(fetchedInspection.car);
          setCar(carData);
          try {
            const img = await CarsRepository.getImage(fetchedInspection.car);
            if (img) {
              setCarImg(img);
            }
          } catch (e) {}
        }
      } catch (e) {
        handleRequestError(e);
        navigate("/inspections");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const onOpenDeleteModal = useCallback(() => {
    setDeleteModal(true);
  }, []);

  const onCloseDeleteModal = useCallback(() => {
    setDeleteModal(false);
  }, []);

  const onDelete = useCallback(async () => {
    setLoading(true);
    try {
      await InspectionsRepository.delete(inspection._id);
      sendNotification({
        title: t("inspections.notifications.delete.title"),
        message: t("inspections.notifications.delete.message"),
        type: "success",
      });
      navigate("/inspections");
    } catch (e) {
      handleRequestError(e);
    } finally {
      setLoading(false);
    }
  }, [inspection?._id, navigate, t]);

  const onPreviewInvoice = useCallback(async () => {
    if (inspection.hasInvoice) {
      try {
        const invoiceFromServer = await InspectionsRepository.getInvoice(id);
        setInvoiceFile(invoiceFromServer);
        setPreviewerModal(true);
      } catch (e) {
        handleRequestError(e);
      }
    }
  }, [id, inspection?.hasInvoice]);

  const onClosePreviewInvoice = useCallback(() => {
    setPreviewerModal(false);
  }, []);

  if (loading || !inspection) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8 text-primary">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between">
          <button className="text-xl" onClick={() => navigate("/inspections")}>
            <FaArrowLeft />
          </button>
          <div className="flex gap-2">
            <button
              className="inline-block justify-items-center bg-[#FFA500] w-6 h-8 rounded"
              title={t("common.actions.edit")}
              onClick={() => navigate(`/inspections/${inspection._id}/edit`)}
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
            <div className="relative max-w-[500px] max-h-[300px] rounded-lg overflow-hidden">
              <img
                src={carImg}
                alt={car?.model}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gray-100/70 flex flex-col items-center justify-center">
                <div className="mb-2">
                  {TypeIcon && <TypeIcon className="text-8xl" />}
                </div>

                <div className="flex items-center justify-center">
                  <span className="text-2xl font-semibold">
                    {t(`enum.inspection-type.${inspection.type}`)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className=" text-center lg:text-left mt-4 lg:mt-0">
            {/* Car info */}
            <div className="mb-8">
              <div>
                <span className="text-4xl font-bold mr-2">{`${t(
                  "inspections.detail.title",
                  {
                    date: formatDate(inspection.date),
                  }
                )}`}</span>
              </div>
              <div>
                <span className="text-gray-600 text-xl">{`${car.brand} ${car.model} (${car.plate})`}</span>
              </div>
            </div>

            {/* Inspection info */}
            <div>
              <div>
                <span className="text-gray-600 text-xl">{`${inspection.mileage.toLocaleString()} km`}</span>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start text-xl gap-2">
                <div className="flex items-center text-xl gap-2">
                  <TbPackages />
                  <span className="text-gray-600 text-xl">
                    {formatPrice(inspection.partsPrice)}
                  </span>
                </div>
                <span className="hidden sm:block">|</span>
                <div className="flex items-center text-xl gap-2">
                  <FaHandHoldingUsd />
                  <span className="text-gray-600 text-xl">
                    {formatPrice(inspection.laborPrice || 0)}
                  </span>
                </div>
                {inspection.hasInvoice && (
                  <>
                    <span className="hidden sm:block">|</span>
                    <div
                      className="flex items-center gap-2 cursor-pointer text-blue-800"
                      onClick={onPreviewInvoice}
                    >
                      <FaFileInvoice />
                      <span className="text-xl">
                        {t("inspections.fields.invoice")}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center text-xl justify-center lg:justify-start gap-2 flex-col sm:flex-row text-gray-700">
                <div className="flex items-center gap-2">
                  {PaymentStatusIcon && (
                    <PaymentStatusIcon
                      className={`${paymentStatusStyles[`inspection-payment-status-${inspection.paymentStatus}`]}`}
                    />
                  )}
                  <span>
                    {t(
                      `enum.inspection-payment-status.${inspection.paymentStatus}`
                    )}
                  </span>
                </div>
              </div>
              <div className="my-8 w-full">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-2 whitespace-nowrap text-base sm:text-sm">
                  {Object.values(maintenanceConfig).map(
                    ({ field, icon: Icon, color, translationKey }) => (
                      <div key={field} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          id={field}
                          checked={!!inspection[field]}
                          readOnly
                          className="w-4 h-4 text-primary focus:ring-primary checked:bg-green-600 checked:border-green-600 rounded"
                        />
                        <label
                          htmlFor={field}
                          className="ml-2 text-lg text-gray-700 flex items-center"
                        >
                          {t(translationKey)}
                          <Icon className={`ml-2 ${color}`} />
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <InspectionDetailTabs
          inspectionId={inspection._id}
          notes={inspection.notes}
        />
      </div>

      {/* DELETE MODAL */}
      {deleteModal && (
        <ConfirmationModal
          title={t("inspections.messages.delete-title")}
          titleIcon={<MdWarning className="text-red-600 flex text-3xl" />}
          message={{
            i18nKey: "inspections.messages.delete-confirm",
            values: {
              inspection: `${car.brand} ${car.model}`,
              date: formatDate(inspection.date),
            },
          }}
          acceptMsg={t("common.actions.remove")}
          acceptClassName={"bg-red-500"}
          onAccept={onDelete}
          onCancel={onCloseDeleteModal}
        />
      )}

      {previewerModal && (
        <PdfPreviewerModal
          file={invoiceFile}
          fileName={`${t("inspections.download.workshop-invoice")}-${t(`enum.inspection-type.${inspection.type}`)}-${car.plate}-${inspection.date}`}
          onClose={onClosePreviewInvoice}
        />
      )}
    </div>
  );
}
