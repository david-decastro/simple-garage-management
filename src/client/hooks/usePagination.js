import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export function usePagination({ setUrlParams = true, ...props }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentUrlSearchParams = new URLSearchParams(searchParams);

  const [page, setPage] = useState(
    Number(currentUrlSearchParams.get("page")) || props.page || 1
  );
  const [size, setSize] = useState(props.size || 10);
  const [sortBy, setSortBy] = useState(
    currentUrlSearchParams.get("sortBy") || props.sortBy
  );
  const [sortOrder, setSortOrder] = useState(
    currentUrlSearchParams.get("sortOrder") || props.sortOrder
  );
  const [totalPages, setTotalPages] = useState(null);

  useEffect(() => {
    if (!setUrlParams) return;

    const newSearchParams = new URLSearchParams();

    if (page) {
      newSearchParams.set("page", page);
    } else {
      newSearchParams.delete("page");
    }

    if (sortBy) {
      newSearchParams.set("sortBy", sortBy);
    } else {
      newSearchParams.delete("sortBy");
    }

    if (sortOrder) {
      newSearchParams.set("sortOrder", sortOrder);
    } else {
      newSearchParams.delete("sortOrder");
    }

    if (newSearchParams.toString() !== searchParams.toString()) {
      setSearchParams(newSearchParams);
    }
  }, [page, sortBy, sortOrder, searchParams, setSearchParams, setUrlParams]);

  const turnPage = useCallback(
    (diff) => {
      const newVal = page + diff;
      setPage(newVal);
    },
    [page]
  );

  return {
    page,
    size,
    sortBy,
    sortOrder,
    totalPages,
    turnPage,
    setPage,
    setSize,
    setSortBy,
    setSortOrder,
    setTotalPages,
  };
}
