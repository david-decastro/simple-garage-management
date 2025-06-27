import toast from "react-hot-toast";

const notificationTypes = {
  info: "/notification_icons/notification_info.webp",
  warning: "/notification_icons/notification_warning.webp",
  success: "/notification_icons/notification_success.webp",
  error: "/notification_icons/notification_error.webp",
};

const notificationRingColor = {
  info: "ring-blue-800",
  warning: "ring-orange-400",
  success: "ring-green-600",
  error: "ring-red-600",
};

const titleColor = {
  info: "text-blue-800",
  warning: "text-orange-400",
  success: "text-green-600",
  error: "text-red-600",
};

export const sendNotification = ({
  title,
  message,
  type = "info",
  closable,
}) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto cursor-pointer flex ring-1 ${notificationRingColor[type]} ring-opacity-5`}
      onClick={() => toast.dismiss(t.id)}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <img
              width="70"
              src={notificationTypes[type]}
              alt="notification-icon"
            />
          </div>
          <div className="ml-3 flex-1">
            <p className={`font-bold ${titleColor[type]}`}>{title}</p>
            <p className="mt-1 text-gray-500">{message}</p>
          </div>
        </div>
      </div>
      {closable && (
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  ));
};
