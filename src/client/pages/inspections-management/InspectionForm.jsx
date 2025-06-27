import Loading from "../Loading.jsx";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaFileInvoice, FaSave } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { useForm } from "react-hook-form";
import InputField from "../../components/InputField.jsx";
import CarsRepository from "../../repositories/CarsRepository.js";
import InspectionsRepository from "../../repositories/InspectionsRepository.js";
import inspectionStatus from "../../enums/InspectionStatus.js";
import inspectionLocation from "../../enums/InspectionLocation.js";
import InspectionLocation from "../../enums/InspectionLocation.js";
import inspectionType from "../../enums/InspectionType.js";
import { maintenanceConfig } from "../../enums/MaintenanceIcons.js";
import inspectionPaymentStatus from "../../enums/InspectionPaymentStatus.js";
import InspectionFormParts from "./components/inspection-parts/InspectionFormParts.jsx";
import FileUploader from "../../components/FileUploader.jsx";
import { VscOpenPreview } from "react-icons/vsc";
import { RxCross2 } from "react-icons/rx";
import PdfPreviewerModal from "../../modals/PdfPreviewerModal.jsx";
import { sendNotification } from "../../plugins/notifications.jsx";

const DEFAULT_VALUES = {
  date: new Date().toISOString().split("T")[0],
  mileage: "",
  notes: "",
  oilChanged: false,
  oilFilter: false,
  airCabinFilter: false,
  status: inspectionStatus.PENDING,
  laborPrice: 0,
};

export default function InspectionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);

  // Cars
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);

  // PDF previewer
  const [previewerModal, setPreviewerModal] = useState(false);
  const [invoiceFile, setInvoiceFile] = useState(null);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({ defaultValues: DEFAULT_VALUES, mode: "onChange" });

  const location = watch("location");
  const invoice = watch("invoice");

  const fetchInspection = useCallback(async () => {
    setLoading(true);
    const auxInspection = await InspectionsRepository.get(id);
    reset(auxInspection);
    setLoading(false);
  }, [id, reset]);

  useEffect(() => {
    const fetchCars = async () => {
      setCarsLoading(true);
      const fetchedCars = await CarsRepository.getAllBasic();
      setCars(fetchedCars);
      setCarsLoading(false);
    };
    fetchCars();
  }, []);

  useEffect(() => {
    if (id) {
      fetchInspection();
    } else {
      setLoading(false);
    }
  }, [fetchInspection, id]);

  const onSave = useCallback(
    async (inspection, skipNavigation = false) => {
      const savedInspection = await InspectionsRepository.save(inspection);
      sendNotification({
        title: t("inspections.notifications.save.title"),
        message: t("inspections.notifications.save.message"),
        type: "success",
      });
      if (!skipNavigation) {
        navigate(`/inspections/${savedInspection._id}`);
      } else {
        navigate(`/inspections/${savedInspection._id}/edit`);
      }
    },
    [navigate, t]
  );

  const forceSave = () => {
    handleSubmit((inspection) => onSave(inspection, true))();
  };

  const onUploadInvoice = useCallback(
    (res) => {
      setValue("invoice", res.response.tempFilename);
      setInvoiceFile(res.file);
    },
    [setValue]
  );

  const onDeleteInvoice = useCallback(() => {
    setValue("invoice", null);
  }, [setValue]);

  const onPreviewInvoice = useCallback(async () => {
    if (!invoiceFile) {
      const invoiceFromServer = await InspectionsRepository.getInvoice(id);
      setInvoiceFile(invoiceFromServer);
    }
    setPreviewerModal(true);
  }, [id, invoiceFile]);

  const onCancel = useCallback(() => {
    navigate(`/inspections`);
  }, [navigate]);

  const onClosePreviewInvoice = useCallback(() => {
    setPreviewerModal(false);
  }, []);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="main-container flex flex-col items-center">
        <div className="w-full bg-white p-6 rounded-xl">
          <form onSubmit={handleSubmit((e) => onSave(e, false))}>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="inline-block">
                <span className="text-4xl text-primary">
                  {id
                    ? t("inspections.title-form")
                    : t("inspections.title-form-new")}
                </span>
              </div>
              <div className="inline-block gap-x-2 mt-4 md:mt-0">
                <button
                  className="bg-gray-800 text-white mr-2 px-4 py-2 rounded"
                  type="button"
                  onClick={onCancel}
                >
                  <TiCancel className="inline-block mr-2" />
                  <span className="align-middle">
                    {t("common.actions.cancel")}
                  </span>
                </button>
                <button
                  type="submit"
                  className="bg-green-800 disabled:bg-gray-400 text-white px-4 py-2 rounded"
                  disabled={!isValid}
                >
                  <FaSave className="inline-block mr-2" />
                  <span className="align-middle">
                    {t("common.actions.save")}
                  </span>
                </button>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-0 md:gap-4 mb-4">
              {/* Date */}
              <div className="mb-4">
                <label
                  htmlFor="date"
                  className="block text-primary mb-1 text-xl"
                >
                  <span className="mandatory mr-1">*</span>
                  {t("inspections.fields.date")}
                </label>
                <InputField
                  type="date"
                  name="date"
                  id="date"
                  className="w-auto"
                  register={register}
                  validation={{
                    required: t("inspections.management.errors.required", {
                      field: t("inspections.fields.date"),
                    }),
                  }}
                  errors={errors}
                />
              </div>
              {/* Inspection type */}
              <div className="mb-4">
                <label
                  htmlFor="type"
                  className="block text-primary mb-1 text-xl"
                >
                  <span className="mandatory mr-1">*</span>
                  {t("inspections.fields.type")}
                </label>
                <select
                  id="type"
                  {...register("")}
                  {...register("type", {
                    required: "Debes seleccionar un tipo de mantenimiento",
                    validate: (value) =>
                      value !== "" ||
                      "Debes seleccionar un tipo de mantenimiento",
                  })}
                  className="w-auto border bg-white text-primary border-gray-500 rounded px-2 py-1"
                >
                  <option value=""></option>
                  {Object.keys(inspectionType).map((key) => (
                    <option
                      key={inspectionType[key]}
                      value={inspectionType[key]}
                    >
                      {t(`enum.inspection-type.${inspectionType[key]}`)}
                    </option>
                  ))}
                </select>
              </div>
              {/* Status */}
              <div className="mb-4">
                <label
                  htmlFor="paymentStatus"
                  className="block text-primary mb-1 text-xl"
                >
                  <span className="mandatory mr-1">*</span>
                  {t("inspections.fields.payment-status")}
                </label>
                <select
                  id="status"
                  {...register("paymentStatus")}
                  className="w-auto border bg-white text-primary border-gray-500 rounded px-2 py-1"
                >
                  {Object.keys(inspectionPaymentStatus).map((key) => (
                    <option
                      key={inspectionPaymentStatus[key]}
                      value={inspectionPaymentStatus[key]}
                    >
                      {t(
                        `enum.inspection-payment-status.${inspectionPaymentStatus[key]}`
                      )}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mt-8">
              {/* Car */}
              <div className="mb-4">
                <label
                  htmlFor="car"
                  className="block text-primary mb-1 text-xl"
                >
                  <span className="mandatory mr-1">*</span>
                  {t("inspections.fields.car")}
                </label>
                <select
                  id="car"
                  disabled={carsLoading}
                  {...register("car", {
                    required: "Debes seleccionar un coche",
                    validate: (value) =>
                      value !== "" || "Debes seleccionar un coche",
                  })}
                  className="w-auto border bg-white text-primary border-gray-500 rounded px-2 py-1"
                >
                  <option value=""></option>
                  {cars.map((car) => (
                    <option key={car._id} value={car._id}>
                      {`${car.brand} ${car.model}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mileage */}
              <div className="mb-4">
                <label
                  htmlFor="mileage"
                  className="block text-primary mb-1 text-xl"
                >
                  <span className="mandatory mr-1">*</span>
                  {t("inspections.fields.mileage")}
                </label>
                <div className="flex items-center">
                  <InputField
                    type="text"
                    name="mileage"
                    maxLength={8}
                    className="w-24"
                    register={register}
                    validation={{
                      required: t("inspections.management.errors.required", {
                        field: "mileage",
                      }),
                    }}
                    errors={errors}
                  />
                  <span className="ml-2 text-gray-600">km</span>
                </div>
              </div>

              {/* Location */}
              <div className="mb-4">
                <label
                  htmlFor="location"
                  className="block text-primary mb-1 text-xl"
                >
                  <span className="mandatory mr-1">*</span>
                  {t("inspections.fields.location")}
                </label>
                <select
                  id="location"
                  {...register("location")}
                  className="w-auto border bg-white text-primary border-gray-500 rounded px-2 py-1"
                >
                  {Object.keys(inspectionLocation).map((key) => (
                    <option
                      key={inspectionLocation[key]}
                      value={inspectionLocation[key]}
                    >
                      {t(`enum.inspection-location.${inspectionLocation[key]}`)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Labor price and invoice button - only when it's not at home */}
              {location !== InspectionLocation.HOME && (
                <>
                  <div className="mb-4">
                    <label
                      htmlFor="laborPrice"
                      className="block text-primary mb-1 text-xl"
                    >
                      {t("inspections.fields.labor-price")}
                    </label>
                    <div className="flex items-center">
                      <InputField
                        type="text"
                        name="laborPrice"
                        className="w-24"
                        register={register}
                        errors={errors}
                      />
                      <span className="ml-2 text-gray-600">€</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-primary mb-1 text-xl">
                      {t("inspections.fields.invoice")}
                    </label>
                    <div className="flex gap-2">
                      {!invoice ? (
                        <FileUploader onUploaded={onUploadInvoice} />
                      ) : (
                        <div className="text-2xl text-green-600 flex items-center justify-center">
                          {" "}
                          <FaFileInvoice />{" "}
                        </div>
                      )}
                      {invoice && (
                        <>
                          <button
                            type="button"
                            className="bg-red-600 text-white px-4 py-2 rounded"
                            title={t("inspections.management.invoice.remove")}
                            onClick={onDeleteInvoice}
                          >
                            <RxCross2 />
                          </button>
                          <button
                            type="button"
                            className="bg-gray-600 text-white px-4 py-2 rounded"
                            title={t("inspections.management.invoice.preview")}
                            onClick={onPreviewInvoice}
                          >
                            <VscOpenPreview />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Checkboxes */}
            <div className="mb-4 w-full">
              <h3 className="text-xl text-primary mb-3">
                {t("inspections.fields.maintenance")}
              </h3>
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 whitespace-nowrap text-base sm:text-sm">
                {Object.values(maintenanceConfig).map(
                  ({ field, icon: Icon, color, translationKey }) => (
                    <div key={field} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={field}
                        {...register(field)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
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

            {/* Notes */}
            <div className="mb-4 w-full">
              <label
                htmlFor="notes"
                className="block text-primary mb-2 text-xl"
              >
                {t("inspections.fields.notes")}
              </label>
              <InputField
                type="textarea"
                name="notes"
                placeholder={t("inspections.fields.notes-placeholder")}
                className="w-full h-32 resize-none align-text-top"
                register={register}
                errors={errors}
              />
            </div>
          </form>

          <div>
            <InspectionFormParts
              inspectionId={getValues("_id")}
              forceSaveDisabled={!isValid}
              onForceSave={forceSave}
            />
          </div>
        </div>
      </div>

      {previewerModal && (
        <PdfPreviewerModal file={invoiceFile} onClose={onClosePreviewInvoice} />
      )}
    </>
  );
}
