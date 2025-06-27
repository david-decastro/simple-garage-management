import i18n from "../plugins/i18n";
import { sendNotification } from "../plugins/notifications.jsx";

export const handleRequestError = (error) => {
  const { t } = i18n;

  const status = error?.status;
  const title = `common.notifications.${status}.title`;
  const message = `common.notifications.${status}.message`;

  sendNotification({
    title: t(title),
    message: t(message),
    type: "error",
  });
};
