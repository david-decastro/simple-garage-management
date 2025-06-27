import { Box, Modal } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TiCancel } from "react-icons/ti";
import { useCallback, useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import PDFObject from "pdfobject";
import { FaFilePdf } from "react-icons/fa";
import { MdDownload } from "react-icons/md";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "100vw",
    sm: "90vw",
    md: "80vw",
  },
  height: {
    xs: "100vh",
    sm: "90vh",
    md: "80vh",
  },
  display: "flex",
  flexDirection: "column",
  bgcolor: "background.paper",
  border: "0px",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

export default function PdfPreviewerModal({
  file,
  fileName = "download",
  onClose,
}) {
  const { t } = useTranslation();

  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setLoading(true);
      if (file) {
        const url = typeof file === "string" ? file : URL.createObjectURL(file);
        setFileUrl(url);
        setTimeout(() => {
          PDFObject.embed(url, "#my-pdf", {
            pdfOpenParams: {
              view: "FitV",
              zoom: "page-width",
              toolbar: 1,
              navpanes: 0,
              scrollbar: 1,
              pagemode: "none",
            },
          });
        }, 0);
      }
    } catch (err) {
      console.error("Error loading PDF file:", err);
    } finally {
      setLoading(false);
    }
  }, [file]);

  const onDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [fileName, fileUrl]);

  return (
    <Modal open onClose={onClose}>
      <Box sx={style} className="text-center text-primary ">
        <div className="flex gap-2 items-center justify-center mb-6">
          <FaFilePdf className="text-2xl" />
          <p className="text-3xl font-bold">{t("pdf-previewer.title")}</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : fileUrl ? (
          <div className="flex-1 h-full overflow-hidden">
            <div id="my-pdf" style={{ height: "100%", width: "100%" }}></div>
          </div>
        ) : (
          <h1> Error </h1>
        )}

        <div className="mt-6">
          <button
            className="bg-gray-800 text-white px-4 py-2 mr-4 rounded"
            type="button"
            onClick={onClose}
          >
            <TiCancel className="inline-block mr-2" />
            <span className="align-middle">{t("common.actions.close")}</span>
          </button>
          <button
            className="bg-blue-800 text-white px-4 py-2 rounded"
            type="button"
            onClick={onDownload}
          >
            <MdDownload className="inline-block mr-2" />
            <span className="align-middle">{t("common.actions.download")}</span>
          </button>
        </div>
      </Box>
    </Modal>
  );
}
