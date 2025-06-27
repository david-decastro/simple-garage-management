import Loading from "../Loading.jsx";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import fuelTypes from "../../enums/FuelType.js";
import oilViscosityGrades from "../../enums/OilViscosityGrade.js";
import { FaSave } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { useForm } from "react-hook-form";
import InputField from "../../components/InputField.jsx";
import CarsRepository from "../../repositories/CarsRepository.js";
import ImageUploader from "../../components/image-uploader/ImageUploader.jsx";
import { sendNotification } from "../../plugins/notifications.jsx";

const DEFAULT_VALUES = {
  brand: "",
  model: "",
  year: "",
  plate: "",
  fuel: null,
  oilViscosities: [],
};

export default function CarForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);

  const [carImage, setCarImage] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({ defaultValues: DEFAULT_VALUES, mode: "onChange" });

  const fetchCar = useCallback(async () => {
    setLoading(true);
    const auxCar = await CarsRepository.get(id);
    reset(auxCar);
    try {
      const img = await CarsRepository.getImage(id);
      if (img) {
        setCarImage(img);
      }
    } catch (e) {}
    setLoading(false);
  }, [id, reset]);

  useEffect(() => {
    if (id) {
      fetchCar();
    } else {
      setLoading(false);
    }
  }, [fetchCar, id]);

  const onImageChange = useCallback(
    (res) => {
      setValue("image", res.tempFilename);
    },
    [setValue]
  );

  const onSave = useCallback(
    async (car) => {
      const carSaved = await CarsRepository.save(car);
      sendNotification({
        title: t("cars.notifications.save.title"),
        message: t("cars.notifications.save.message"),
        type: "success",
      });
      navigate(`/cars/${carSaved._id}`);
    },
    [navigate]
  );

  const onCancel = useCallback(() => {
    navigate(`/cars`);
  }, [navigate]);

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="container mx-auto px-4 py-8 text-primary">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit(onSave)}>
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div className="inline-block">
              <span className="text-4xl text-primary">
                {id ? t("cars.form.title") : t("cars.form.title-new")}
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
                <span className="align-middle">{t("common.actions.save")}</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="flex h-full justify-center items-center mb-8 lg:mb-0">
              <ImageUploader initialImage={carImage} onChange={onImageChange} />
            </div>
            <div>
              <div className="flex gap-4">
                {/* Brand */}
                <div className="flex-1 mb-4">
                  <label
                    htmlFor="brand"
                    className="block text-primary mb-1 text-xl"
                  >
                    <span className="mandatory mr-1">*</span>
                    {t("cars.fields.brand")}
                  </label>
                  <InputField
                    name="brand"
                    placeholder={t("cars.fields.brand")}
                    className="w-full"
                    register={register}
                    validation={{
                      required: t("cars.management.errors.required", {
                        field: "brand",
                      }),
                    }}
                    errors={errors}
                  />
                </div>

                {/* Model */}
                <div className="flex-1 mb-4">
                  <label
                    htmlFor="model"
                    className="block text-primary mb-1 text-xl"
                  >
                    <span className="mandatory mr-1">*</span>
                    {t("cars.fields.model")}
                  </label>
                  <InputField
                    name="model"
                    placeholder={t("cars.fields.model")}
                    className="w-full"
                    register={register}
                    validation={{
                      required: t("common.error.required", {
                        field: "model",
                      }),
                    }}
                    errors={errors}
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row md: gap-0 gap-4">
                {/* Year */}
                <div className="flex-1 mb-4">
                  <label
                    htmlFor="year"
                    className="block text-primary mb-1 text-xl"
                  >
                    <span className="mandatory mr-1">*</span>
                    {t("cars.fields.year")}
                  </label>
                  <InputField
                    name="year"
                    placeholder={t("cars.fields.year")}
                    className="w-full"
                    register={register}
                    validation={{
                      required: t("common.error.required", {
                        field: "year",
                      }),
                    }}
                    errors={errors}
                  />
                </div>

                {/* Plate */}
                <div className="flex-1 mb-4">
                  <label
                    htmlFor="plate"
                    className="block text-primary mb-1 text-xl"
                  >
                    <span className="mandatory mr-1">*</span>
                    {t("cars.fields.plate")}
                  </label>
                  <InputField
                    name="plate"
                    placeholder={t("cars.fields.plate")}
                    className="w-full uppercase"
                    register={register}
                    validation={{
                      required: t("common.error.required", {
                        field: "plate",
                      }),
                    }}
                    errors={errors}
                  />
                </div>
                {/* ITV */}
                <div className="flex-1 mb-4">
                  <label
                    htmlFor="itv"
                    className="block text-primary mb-1 text-xl"
                  >
                    {t("cars.fields.itv")}
                  </label>
                  <InputField
                    type="date"
                    name="itvDate"
                    id="itv"
                    className="w-auto"
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                {/* Fuel type */}
                <div className="flex-1 mb-4">
                  <label
                    htmlFor="fuelType"
                    className="block text-primary mb-1 text-xl"
                  >
                    {t("cars.fields.fuel")}
                  </label>
                  <select
                    id="fuelType"
                    {...register("fuel")}
                    className="w-full border bg-white text-primary border-gray-500 rounded px-2 py-1"
                  >
                    {Object.keys(fuelTypes).map((fuelType) => (
                      <option
                        key={fuelTypes[fuelType]}
                        value={fuelTypes[fuelType]}
                      >
                        {t(`enum.fuel-type.${fuelTypes[fuelType]}`)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Oil viscosities */}
                <div className="flex-1 mb-4">
                  <label
                    htmlFor="oilViscosities"
                    className="block text-primary mb-1 text-xl"
                  >
                    {t("cars.fields.oilViscosities")}
                  </label>
                  <select
                    id="oilViscosities"
                    {...register("oilViscosities")}
                    className="w-full border bg-white text-primary border-gray-500 rounded px-2 py-1"
                  >
                    {Object.keys(oilViscosityGrades).map((key) => (
                      <option
                        key={oilViscosityGrades[key]}
                        value={oilViscosityGrades[key]}
                      >
                        {oilViscosityGrades[key]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
