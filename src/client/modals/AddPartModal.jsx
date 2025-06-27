import { Modal, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TiCancel } from "react-icons/ti";
import { FaSave } from "react-icons/fa";
import { useEffect, useState } from "react";
import PartsRepository from "../repositories/PartsRepository.js";
import InputField from "../components/InputField.jsx";
import { useForm } from "react-hook-form";
import SelectField from "../components/SelectField.jsx";
import InspectionPartsRepository from "../repositories/InspectionPartsRepository.js";
import PartType from "../enums/PartType.js";
import partType from "../enums/PartType.js";
import { handleRequestError } from "../utils/errorController.js";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80vw",
  bgcolor: "background.paper",
  border: "0px",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

const DEFAULT_VALUES = {
  quantity: 1,
};

export default function AddPartModal({ inspectionId, onSave, onCancel }) {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({ defaultValues: DEFAULT_VALUES, mode: "onChange" });

  const [parts, setParts] = useState([]);
  const [partsLoading, setPartsLoading] = useState(false);

  const partSelected = watch("part");
  const [partSelectedInfo, setPartSelectedInfo] = useState(null);
  const [partSelectedImg, setPartSelectedImg] = useState("/default-part.webp");

  useEffect(() => {
    const fetchParts = async () => {
      setPartsLoading(true);
      try {
        const auxParts = await PartsRepository.getAll();
        setParts(auxParts);
      } catch (e) {
        handleRequestError(e);
      } finally {
        setPartsLoading(false);
      }
    };
    fetchParts();
  }, []);

  useEffect(() => {
    const fetchImage = async () => {
      if (partSelected) {
        const partFound = parts.find((p) => p._id === partSelected);
        setPartSelectedInfo(partFound);
        try {
          const img = await PartsRepository.getImage(partSelected);
          if (img) {
            setPartSelectedImg(img);
          }
        } catch (e) {
          setPartSelectedImg("/default-part.webp");
        }
      } else {
        setPartSelectedInfo(null);
        setPartSelectedImg(null);
      }
    };
    fetchImage();
  }, [partSelected, parts]);

  const _onSave = async (inspectionPart) => {
    inspectionPart.inspection = inspectionId;
    // If it's oil, we calculate the price here before send it to the server
    if (partSelectedInfo.type === partType.OIL) {
      inspectionPart.price = inspectionPart.quantity * inspectionPart.price;
    }
    try {
      await InspectionPartsRepository.save(inspectionPart);
      onSave();
    } catch (e) {
      handleRequestError(e);
    }
  };

  return (
    <Modal open onClose={onCancel}>
      <Box sx={style} className="text-center text-primary">
        <p className="text-3xl font-bold mb-6">{t("parts.modal.title")}</p>
        <form onSubmit={handleSubmit(_onSave)}>
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="w-full sm:w-1/2">
              {/* PART SELECTOR */}
              <div className="mb-4">
                <span className="text-xl font-bold">
                  {t("parts.modal.form")}
                </span>
              </div>
              <div className="mb-4">
                <SelectField
                  name="part"
                  loading={partsLoading}
                  customKey="_id"
                  options={parts}
                  register={register}
                  validation={{
                    required: t("common.error.required"),
                  }}
                  errors={errors}
                  placeholder={t("parts.modal.select-part")}
                />
              </div>

              <div className="flex flex-col md:flex-row md:items-start md:gap-4">
                {/* QUANTITY */}
                <div className="mb-4 md:flex-1">
                  <label
                    htmlFor="quantity"
                    className="block text-primary mb-1 text-xl"
                  >
                    <span className="mandatory mr-1">*</span>
                    {t("parts.fields.quantity")}
                    {partSelectedInfo?.type === partType.OIL && (
                      <span className="ml-1">
                        {`(${t("inspections.management.form.liters")})`}
                      </span>
                    )}
                  </label>
                  <InputField
                    type="number"
                    step="any"
                    name="quantity"
                    placeholder={t("parts.fields.quantity")}
                    className="w-full"
                    register={register}
                    validation={{
                      required: t("common.error.required"),
                      valueAsNumber: true,
                    }}
                    errors={errors}
                  />
                </div>

                {/* PRICE */}
                <div className="mb-4 md:flex-1">
                  <label
                    htmlFor="price"
                    className="block text-primary mb-1 text-xl"
                  >
                    <span className="mandatory mr-1">*</span>
                    {t("parts.fields.price")}
                    {partSelectedInfo?.type === partType.OIL && (
                      <span>{t("inspections.management.form.per-liters")}</span>
                    )}
                  </label>
                  <InputField
                    type="number"
                    step="any"
                    name="price"
                    placeholder={t("parts.fields.price")}
                    className="w-full"
                    register={register}
                    validation={{
                      required: t("common.error.required"),
                      valueAsNumber: true,
                    }}
                    errors={errors}
                  />
                </div>
              </div>

              {/* TODO: add functionality to create a new part from here
            <button
              type="submit"
              className="bg-green-800 disabled:bg-gray-400 text-white px-4 py-2 rounded"
              onClick={openPartForm}
            >
              <FaSave className="inline-block mr-2" />
              <span className="align-middle">{"Crear una pieza nueva"}</span>
            </button>
            */}
            </div>

            <div className="w-full sm:w-1/2">
              {partSelectedInfo && (
                <div>
                  <div className="mb-4">
                    <span className="text-xl font-bold">
                      {t("parts.modal.part-detail")}
                    </span>
                  </div>
                  <img
                    src={partSelectedImg}
                    alt={partSelectedInfo.name}
                    className="rounded-lg max-h-[150px] mx-auto mb-4"
                  />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        {t("parts.fields.name")}
                      </span>
                      <span className="text-gray-800">
                        {partSelectedInfo.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        {t("parts.fields.barcode")}
                      </span>
                      <span className="text-gray-800">
                        {partSelectedInfo.barcode}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        {t("parts.fields.type")}
                      </span>
                      <span className="text-gray-800">
                        {t(
                          `enum.part-type.${PartType[partSelectedInfo.type.toUpperCase()]}`
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              className="bg-gray-800 text-white px-4 py-2 mr-4 rounded"
              type="button"
              onClick={onCancel}
            >
              <TiCancel className="inline-block mr-2" />
              <span className="align-middle">{t("common.actions.cancel")}</span>
            </button>
            <button
              type="submit"
              className="bg-green-800 disabled:bg-gray-400 text-white px-4 py-2 rounded"
              disabled={!isValid}
            >
              <FaSave className="inline-block mr-2" />
              <span className="align-middle">{t("parts.modal.title")}</span>
            </button>
          </div>
        </form>
      </Box>
    </Modal>
  );
}
