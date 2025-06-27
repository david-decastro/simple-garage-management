/*
  Receives a pageable request and, if pagination info is available,
  it generates a pagination object in the request to use it later
 */
export function paginationMiddleware(req, res, next) {
  let pagination = {};

  // If we receive the page attribute, we set all pagination attributes
  if (req.query.page) {
    pagination = {
      page: parseInt(req.query.page),
      limit: parseInt(req.query.size) || 10,
    };
    pagination.skip = (pagination.page - 1) * pagination.limit;
  }

  // If we receive sortBy, we set all sorting attributes
  if (req.query.sortBy) {
    pagination.sortBy = req.query.sortBy;
    pagination.sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    pagination.sort = { [pagination.sortBy]: pagination.sortOrder };
  }

  req.pagination = pagination;

  next();
}

/*
  Generates an object to return to the client with all the important information about pagination
 */
export function resultsPagination(pagination, total) {
  return {
    page: pagination.page,
    size: pagination.limit,
    sort: pagination.sort,
    totalElements: total,
    totalPages: Math.ceil(total / pagination.limit),
  };
}
