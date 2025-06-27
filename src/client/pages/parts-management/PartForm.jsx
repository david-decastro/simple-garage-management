import Loading from "../Loading.jsx";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaSave } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { useForm } from "react-hook-form";
import InputField from "../../components/InputField.jsx";
import PartsRepository from "../../repositories/PartsRepository.js";
import ImageUploader from "../../components/image-uploader/ImageUploader.jsx";
import partTypes from "../../enums/PartType.js";
import oilViscosities from "../../enums/OilViscosityGrade.js";
import { sendNotification } from "../../plugins/notifications.jsx";
import { handleRequestError } from "../../utils/errorController.js";

const DEFAULT_VALUES = {
  name: "",
  barcode: "",
};

export default function PartForm() {
  const { partId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);

  const [partImage, setPartImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({ defaultValues: DEFAULT_VALUES, mode: "onChange" });

  const partType = watch("type");

  const fetchPart = useCallback(async () => {
    setLoading(true);
    const auxPart = await PartsRepository.get(partId);
    reset(auxPart);
    try {
      const img = await PartsRepository.getImage(partId);
      if (img) {
        setPartImage(img);
      }
    } catch (e) {}
    setLoading(false);
  }, [partId, reset]);

  useEffect(() => {
    if (partId) {
      fetchPart();
    } else {
      setLoading(false);
    }
  }, [fetchPart, partId]);

  const onImageChange = useCallback(
    (res) => {
      setValue("image", res.tempFilename);
    },
    [setValue]
  );

  const onSave = useCallback(
    async (part) => {
      try {
        const savedPart = await PartsRepository.save(part);
        sendNotification({
          title: t("parts.notifications.save.title"),
          message: t("parts.notifications.save.message"),
          type: "success",
        });
        navigate(`/parts/${savedPart._id}`);
      } catch (e) {
        handleRequestError(e);
      }
    },
    [navigate, t]
  );

  const onCancel = useCallback(() => {
    navigate(`/parts`);
  }, [navigate]);

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="main-container flex flex-col items-center">
        <div className="w-full bg-white p-6 rounded-xl">
          <form onSubmit={handleSubmit(onSave)}>
            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
              <div className="inline-block">
                <span className="text-4xl text-primary">
                  {partId ? t("parts.title-form") : t("parts.title-form-new")}
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
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="flex h-full justify-center items-center mb-8 lg:mb-0">
                <ImageUploader
                  initialImage={partImage}
                  height={300}
                  width={300}
                  onChange={onImageChange}
                />
              </div>
              <div>
                {/* Name */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-primary mb-1 text-xl"
                  >
                    <span className="mandatory mr-1">*</span>
                    {t("parts.fields.name")}
                  </label>
                  <div className="flex items-center">
                    <InputField
                      type="text"
                      name="name"
                      register={register}
                      validation={{
                        required: t("parts.management.errors.required", {
                          field: "name",
                        }),
                      }}
                      errors={errors}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  {/* Part type */}
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-primary mb-1 text-xl"
                    >
                      <span className="mandatory mr-1">*</span>
                      {t("parts.fields.type")}
                    </label>
                    <select
                      id="type"
                      {...register("")}
                      {...register("type", {
                        required: "Debes seleccionar un tipo de pieza",
                        validate: (value) =>
                          value !== "" || "Debes seleccionar un tipo de pieza",
                      })}
                      className="w-auto border bg-white text-primary border-gray-500 rounded px-2 py-1"
                    >
                      <option value=""></option>
                      {Object.keys(partTypes).map((key) => (
                        <option key={partTypes[key]} value={partTypes[key]}>
                          {t(`enum.part-type.${partTypes[key]}`)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Oil viscosity */}
                  {partType === partTypes.OIL && (
                    <div>
                      <label
                        htmlFor="oilViscosity"
                        className="block text-primary mb-1 text-xl"
                      >
                        {t("parts.fields.oilViscosity")}
                      </label>
                      <select
                        id="oilViscosity"
                        {...register("")}
                        {...register("oilViscosity", {
                          required: "Debes seleccionar un tipo de pieza",
                          validate: (value) =>
                            value !== "" ||
                            "Debes seleccionar un tipo de pieza",
                        })}
                        className="w-auto border bg-white text-primary border-gray-500 rounded px-2 py-1"
                      >
                        <option value=""></option>
                        {Object.keys(oilViscosities).map((key) => (
                          <option
                            key={oilViscosities[key]}
                            value={oilViscosities[key]}
                          >
                            {oilViscosities[key]}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Barcode */}
                <div className="mb-4">
                  <label
                    htmlFor="barcode"
                    className="block text-primary mb-1 text-xl"
                  >
                    {partType === partTypes.OTHER && (
                      <span className="mandatory mr-1">*</span>
                    )}
                    {t("parts.fields.barcode")}
                  </label>
                  <div className="flex items-center">
                    <InputField
                      type="text"
                      name="barcode"
                      register={register}
                      validation={{
                        required:
                          partType === partTypes.OTHER
                            ? t("parts.management.errors.required", {
                                field: "barcode",
                              })
                            : false,
                      }}
                      errors={errors}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
