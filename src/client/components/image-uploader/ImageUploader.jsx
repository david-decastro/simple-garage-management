import { useCallback, useState } from "react";
import FilesRepository from "../../repositories/FilesRepository.js";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "../LoadingSpinner.jsx";
import ImageCropperModal from "../../modals/ImageCropperModal.jsx";
import { handleRequestError } from "../../utils/errorController.js";

function ImageUploader({ initialImage, onChange, width = 500, height = 300 }) {
  const { t } = useTranslation();

  const [image, setImage] = useState(initialImage);
  const [loading, setLoading] = useState(false);

  const [imageModal, setImageModal] = useState(false);
  const [tempImg, setTempImg] = useState(null);

  const onOpenModal = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setTempImg(reader.result);
          setImageModal(true);
        };
        reader.readAsDataURL(file);
      }
    },
    [setImageModal]
  );

  const onCloseModal = useCallback(() => {
    setTempImg(null);
    setImageModal(false);
  }, [setImageModal]);

  const onFileUploaded = useCallback(
    async (image) => {
      setLoading(true);
      setImage(null);
      try {
        const res = await FilesRepository.uploadImage(image);
        setImage(URL.createObjectURL(image));
        onChange(res);
        onCloseModal();
      } catch (e) {
        handleRequestError(e);
      } finally {
        setLoading(false);
      }
    },
    [onChange, onCloseModal]
  );

  return (
    <>
      <div className="relative" style={{ width, height }}>
        <label htmlFor="image" className="cursor-pointer">
          <div className="w-full h-full relative">
            {image ? (
              <>
                <img
                  src={image}
                  alt="Seleccionar imagen"
                  className="w-full h-full rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 rounded-lg opacity-0 hover:opacity-70 transition-opacity flex items-center justify-center text-white text-lg font-semibold">
                  {t("common.upload.image")}
                </div>
              </>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
                {loading ? (
                  <LoadingSpinner className="text-black" size="h-10 w-10" />
                ) : (
                  <span>{t("common.upload.image")}</span>
                )}
              </div>
            )}
          </div>
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onOpenModal}
        />
      </div>
      {imageModal && (
        <ImageCropperModal
          imageUrl={tempImg}
          height={height}
          width={width}
          onSave={onFileUploaded}
          onCancel={onCloseModal}
        />
      )}
    </>
  );
}

export default ImageUploader;
