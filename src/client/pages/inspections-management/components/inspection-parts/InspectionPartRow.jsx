import { useTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";
import { formatNumber, formatPrice } from "../../../../plugins/filters.js";
import partType from "../../../../enums/PartType.js";

export default function InspectionPartRow({
  inspectionPart,
  editing,
  onDetail,
  onDelete,
}) {
  const { t } = useTranslation();

  return (
    <tr
      key={inspectionPart._id}
      className="border-b-0 last:border-b-inherit hover:bg-gray-50"
    >
      <td className="whitespace-nowrap px-6 y-4 text-gray-700">
        {inspectionPart.name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-gray-700">
        {inspectionPart.barcode || "N/A"}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-gray-700">
        {formatNumber(inspectionPart.quantity)}
        {inspectionPart.type === partType.OIL && (
          <span className="ml-1">
            {t("inspections.management.form.liters")}
          </span>
        )}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-gray-700">
        {formatPrice(inspectionPart.price)}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
        <button
          className="inline-block bg-blue-600 text-white px-3 py-2 mr-2 rounded"
          title={t("common.actions.detail")}
          onClick={onDetail}
        >
          <CgDetailsMore />
        </button>
        {editing && (
          <button
            className="inline-block bg-red-700 text-white px-3 py-2 rounded"
            title={t("common.actions.remove")}
            onClick={() => onDelete(inspectionPart)}
          >
            <MdDelete />
          </button>
        )}
      </td>
    </tr>
  );
}
