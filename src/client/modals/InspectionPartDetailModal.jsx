import { Modal, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import PartsRepository from "../repositories/PartsRepository.js";
import { IoClose } from "react-icons/io5";
import { formatNumber, formatPrice } from "../plugins/filters.js";
import partType from "../enums/PartType.js";

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

export default function InspectionPartDetailModal({ inspectionPart, onClose }) {
  const { t } = useTranslation();

  const [partImg, setPartImg] = useState("/default-part.webp");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const img = await PartsRepository.getImage(inspectionPart.partId);
        if (img) {
          setPartImg(img);
        } else {
          setPartImg(null);
        }
      } catch (e) {}
    };
    fetchImage();
  }, [inspectionPart]);

  return (
    <Modal open onClose={onClose}>
      <Box sx={style} className="text-center text-primary">
        <div className="flex justify-between items-center mb-6">
          <p className="text-3xl font-bold">{t("parts.modal.part-detail")}</p>
          <button
            onClick={onClose}
            className="text-3xl font-bold"
            style={{ padding: "0px" }}
          >
            <IoClose />
          </button>
        </div>

        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="flex h-full justify-center items-center mb-8 lg:mb-0">
              {partImg ? (
                <img
                  src={partImg}
                  alt={inspectionPart.name}
                  className="rounded-lg max-h-[300px]"
                />
              ) : (
                <div className="text-gray-400">{t("common.no-image")}</div>
              )}
            </div>

            <div>
              <div className="mb-4">
                {/* Name */}
                <span className="text-3xl font-bold mr-2">
                  {inspectionPart.name}
                </span>
              </div>

              {/* Barcode */}
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">
                  {t("parts.fields.barcode")}
                </span>
                <span className="text-gray-800">
                  {inspectionPart.barcode || "N/A"}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">
                  {t("parts.fields.quantity")}
                </span>
                <span className="text-gray-800">
                  {formatNumber(inspectionPart.quantity)}
                  {inspectionPart.type === partType.OIL && (
                    <span className="ml-1">
                      {t("inspections.management.form.liters")}
                    </span>
                  )}
                </span>
              </div>

              {/* Price */}
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">
                  {t("parts.fields.price")}
                </span>
                <span className="text-gray-800">
                  {formatPrice(inspectionPart.price)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
}
