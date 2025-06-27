export function filtersMiddleware(req, res, next) {
  const { page, size, sortBy, sortOrder, ...rest } = req.query;

  req.filters = Object.fromEntries(
    Object.entries(rest).filter(([_, value]) => value !== "" && value != null)
  );

  next();
}
