import { useCallback, useRef, useState } from "react";
import { FaFileUpload } from "react-icons/fa";
import FilesRepository from "../repositories/FilesRepository.js";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { useTranslation } from "react-i18next";
import { handleRequestError } from "../utils/errorController.js";

export default function FileUploader({
  accept = "application/pdf,image/*",
  onUploaded,
  buttonClassName = "bg-blue-600 text-white px-4 py-2 rounded",
  icon = <FaFileUpload />,
  inputId = "file-uploader",
}) {
  const { t } = useTranslation();

  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);

  const onFileUploaded = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      setLoading(true);
      try {
        const response = await FilesRepository.uploadFile(file);
        onUploaded({ response, file });
      } catch (e) {
        handleRequestError(e);
      } finally {
        setLoading(false);
      }
    },
    [onUploaded]
  );

  return (
    <div>
      <input
        id={inputId}
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={onFileUploaded}
      />
      <button
        type="button"
        title={t("inspections.management.invoice.upload")}
        onClick={() => fileInputRef.current?.click()}
        className={buttonClassName}
      >
        {loading ? <LoadingSpinner /> : icon}
      </button>
    </div>
  );
}
