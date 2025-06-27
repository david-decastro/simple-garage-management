import { useTranslation } from "react-i18next";

const PaginationControls = ({ page, totalPages, onPageChange }) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-end items-center mt-4">
      {page > 1 && (
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-l hover:bg-gray-300"
          disabled={page === 1}
          onClick={() => onPageChange(-1)}
        >
          {"<"}
        </button>
      )}
      <span className="px-4 py-2 border-0 text-gray-700 border">
        {t("common.pagination.page")} {page} de {totalPages || 1}
      </span>
      {page < totalPages && (
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r hover:bg-gray-300"
          disabled={page === totalPages}
          onClick={() => onPageChange(1)}
        >
          {">"}
        </button>
      )}
    </div>
  );
};

export default PaginationControls;
