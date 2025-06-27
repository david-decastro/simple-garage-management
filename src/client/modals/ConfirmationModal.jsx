import { Modal, Box } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "0px",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
};

const ConfirmationModal = ({
  title,
  titleIcon,
  message,
  acceptMsg,
  cancelMsg,
  acceptClassName,
  onAccept,
  onCancel,
}) => {
  const { t } = useTranslation();

  return (
    <Modal open onClose={onCancel}>
      <Box sx={style} className="text-center text-primary">
        <div className="flex items-center justify-center gap-2">
          {titleIcon}
          <p className="text-3xl">
            {title || t("common.confirmation-modal.title")}
          </p>
        </div>

        <div className="mt-4">
          {message ? (
            typeof message === "string" ? (
              <p>{message}</p>
            ) : (
              <Trans i18nKey={message.i18nKey} values={message.values} />
            )
          ) : (
            <Trans i18nKey="common.confirmation-modal.message" />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 mt-4">
          <div>
            <button
              className="rounded-xl border-0 hover:border-0 text-white px-6 py-3 mt-4 text-xl bg-gray-800 hover:bg-grey-700"
              onClick={onCancel}
            >
              <span>{cancelMsg || t("common.actions.cancel")}</span>
            </button>
          </div>
          <div>
            <button
              className={`rounded-xl border-0 hover:border-0 text-white bg-green-500 px-4 py-3 mt-4 text-xl ${acceptClassName}`}
              onClick={onAccept}
            >
              <span className="inline-block">
                {acceptMsg || t("common.actions.continue")}
              </span>
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
