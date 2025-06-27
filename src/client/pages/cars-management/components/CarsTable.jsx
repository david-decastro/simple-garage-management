import { FaEdit } from "react-icons/fa";
import { CgDetailsMore } from "react-icons/cg";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TableLoading from "../../../components/TableLoading.jsx";
import { getCarIcon } from "../../../components/CarBrandIcons.js";
import { formatDate } from "../../../plugins/filters.js";
import PaginationControls from "../../../components/PaginationControls.jsx";
import { useCallback } from "react";

export default function CarsTable({
  loading,
  page,
  totalPages,
  cars,
  onDelete,
  onPageChange,
}) {
  const { t } = useTranslation();

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border rounded border-gray-200">
        <thead>
          <tr className="bg-gray-200 border-b">
            <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/8">
              {t("cars.table.car")}
            </th>
            <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/4">
              {t("cars.table.last-inspection")}
            </th>
            <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/4">
              {t("cars.table.last-itv")}
            </th>
            <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase w-1/4">
              {t("common.actions.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="100%">
                <TableLoading />
              </td>
            </tr>
          ) : cars.length === 0 ? (
            <tr>
              <td colSpan="100%" className="text-center text-primary py-4">
                {t("common.no-data")}
              </td>
            </tr>
          ) : (
            cars.map((car) => (
              <CarRow key={car._id} car={car} onDelete={onDelete} />
            ))
          )}
        </tbody>
      </table>
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}

function CarRow({ car, onDelete }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = useCallback((e, action) => {
    e.stopPropagation();
    action();
  }, []);

  return (
    <tr
      key={car._id}
      className="border-b-0 last:border-b-inherit hover:bg-gray-50 cursor-pointer"
      onClick={() => navigate(car._id)}
    >
      <td className="px-6 py-4 text-lg text-gray-700 inline-flex items-center">
        {(() => {
          const { icon: BrandIcon, color } = getCarIcon(car.brand);
          return <BrandIcon className="text-2xl mr-2" style={{ color }} />;
        })()}
        <span> {`${car.brand} ${car.model}`} </span>
      </td>
      <td className="px-6 py-4 text-lg text-gray-700">
        <div className="text-lg text-gray-700">
          {formatDate(car.lastInspection?.date) || "N/A"}
        </div>
        <div className="text-sm text-gray-400">
          {car.lastInspection?.mileage.toLocaleString() || "0"} km
        </div>
      </td>
      <td className="px-6 py-4 text-lg text-gray-700">
        <div className="text-lg text-gray-700">
          {formatDate(car?.itvDate) || "N/A"}
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-700">
        <button
          className="inline-block bg-blue-600 text-white px-3 py-2 mr-2 rounded"
          title={t("common.actions.detail")}
          onClick={(e) => handleClick(e, () => navigate(`/cars/${car._id}`))}
        >
          <CgDetailsMore />
        </button>
        <button
          className="inline-block bg-[#FFA500] px-3 py-2 mr-2 rounded"
          title={t("common.actions.edit")}
          onClick={(e) =>
            handleClick(e, () => navigate(`/cars/${car._id}/edit`))
          }
        >
          <FaEdit />
        </button>
        <button
          className="inline-block bg-red-700 text-white px-3 py-2 rounded"
          title={t("common.actions.remove")}
          onClick={(e) => handleClick(e, () => onDelete(car))}
        >
          <MdDelete />
        </button>
      </td>
    </tr>
  );
}
