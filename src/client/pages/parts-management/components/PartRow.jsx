import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";
import { useCallback } from "react";

export default function PartRow({ part, onDelete }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = useCallback((e, action) => {
    e.stopPropagation();
    action();
  }, []);

  return (
    <tr
      key={part._id}
      className="border-b-0 last:border-b-inherit hover:bg-gray-50 cursor-pointer"
      onClick={() => navigate(part._id)}
    >
      <td className="whitespace-nowrap px-6 py-4 text-lg text-gray-700">
        {part.name}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-lg text-gray-700">
        {part.barcode}
      </td>
      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
        <button
          className="inline-block bg-blue-600 text-white px-3 py-2 mr-2 rounded"
          title={t("common.actions.detail")}
          onClick={() => navigate(`/parts/${part._id}`)}
        >
          <CgDetailsMore />
        </button>
        <button
          className="inline-block bg-[#FFA500] px-3 py-2 mr-2 rounded"
          title={t("common.actions.edit")}
          onClick={(e) =>
            handleClick(e, () => navigate(`/parts/${part._id}/edit`))
          }
        >
          <FaEdit />
        </button>
        <button
          className="inline-block bg-red-700 text-white px-3 py-2 rounded"
          title={t("common.actions.remove")}
          onClick={(e) => handleClick(e, () => onDelete(part))}
        >
          <MdDelete />
        </button>
      </td>
    </tr>
  );
}
