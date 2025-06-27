import i18n from "./i18n.js";

export const formatDate = (dateString) => {
  if (!dateString) return;

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatPrice = (price) => {
  if (price == null) return;

  return (
    new Intl.NumberFormat(i18n.language, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price) + " €"
  );
};

export const formatNumber = (number, options = {}) => {
  if (number == null) return;

  return new Intl.NumberFormat(i18n.language, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options, // permite sobreescribir si se quiere más control
  }).format(number);
};
