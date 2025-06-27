import { Modal, Box, Slider } from "@mui/material";
import { useTranslation } from "react-i18next";
import Cropper from "react-easy-crop";
import { useEffect, useState } from "react";
import getCroppedImg from "../components/image-uploader/cropImage.js";
import { TiCancel } from "react-icons/ti";
import { FaSave } from "react-icons/fa";

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

const DEFAULT_STATE = {
  crop: { x: 0, y: 0 },
  zoom: 1,
  aspect: 5 / 3,
};

export default function ImageCropperModal({
  imageUrl,
  height,
  width,
  onSave,
  onCancel,
}) {
  const { t } = useTranslation();

  const [state, setState] = useState({ imageSrc: imageUrl, ...DEFAULT_STATE });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      aspect: width / height,
    }));
  }, [height, width]);

  const onCropChange = (crop) => {
    setState((prev) => ({ ...prev, crop }));
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onZoomChange = (zoom) => {
    setState((prev) => ({ ...prev, zoom }));
  };

  const _onSave = async () => {
    const cropped = await getCroppedImg(state.imageSrc, croppedAreaPixels);
    onSave(cropped.file);
  };

  return (
    <Modal open onClose={onCancel}>
      <Box sx={style} className="text-center text-primary">
        <p className="text-3xl font-bold mb-6">
          ⚙ {t("configuration.modal.title")}
        </p>

        <div className="relative w-full h-[350px] bg-gray-200">
          <Cropper
            image={state.imageSrc}
            crop={state.crop}
            zoom={state.zoom}
            aspect={state.aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
            onZoomChange={onZoomChange}
          />
        </div>

        <div className="controls">
          <Slider
            value={state.zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(_, zoom) => onZoomChange(zoom)}
            classes={{ container: "slider" }}
          />
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
            onClick={_onSave}
          >
            <FaSave className="inline-block mr-2" />
            <span className="align-middle">{t("common.actions.save")}</span>
          </button>
        </div>
      </Box>
    </Modal>
  );
}
