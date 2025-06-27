import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { formatDate } from "../../../plugins/filters.js";
import MaintenanceIcons from "../../../components/MaintenanceIcons.jsx";
import { CgDetailsMore } from "react-icons/cg";
import { useCallback } from "react";

export default function InspectionRow({ inspection, onDelete }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = useCallback((e, action) => {
    e.stopPropagation();
    action();
  }, []);

  return (
    <tr
      key={inspection._id}
      className="border-b hover:bg-gray-50 cursor-pointer"
      onClick={() => navigate(inspection._id)}
    >
      <td className="whitespace-nowrap px-6 py-4 text-lg text-gray-700">
        {`${formatDate(inspection.date)}`}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-lg text-gray-700">
        {`${inspection.car.brand} ${inspection.car.model}`}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-lg text-gray-700">
        {t(`enum.inspection-type.${inspection.type}`)}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-lg text-gray-700">
        <MaintenanceIcons inspection={inspection} />
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
        <button
          className="inline-block bg-blue-600 text-white px-3 py-2 mr-2 rounded"
          title={t("common.actions.detail")}
          onClick={(e) =>
            handleClick(e, () => navigate(`/inspections/${inspection._id}`))
          }
        >
          <CgDetailsMore />
        </button>
        <button
          className="inline-block bg-[#FFA500] px-3 py-2 mr-2 rounded"
          title={t("common.actions.edit")}
          onClick={(e) =>
            handleClick(e, () =>
              navigate(`/inspections/${inspection._id}/edit`)
            )
          }
        >
          <FaEdit />
        </button>
        <button
          className="inline-block bg-red-700 text-white px-3 py-2 rounded"
          title={t("common.actions.remove")}
          onClick={(e) => handleClick(e, () => onDelete(inspection))}
        >
          <MdDelete />
        </button>
      </td>
    </tr>
  );
}
