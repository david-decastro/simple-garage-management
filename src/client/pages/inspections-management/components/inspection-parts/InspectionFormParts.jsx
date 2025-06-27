import { IoMdAdd } from "react-icons/io";
import InspectionPartsTab from "./InspectionPartsTab.jsx";
import { useTranslation } from "react-i18next";
import { useCallback, useState } from "react";
import AddPartModal from "../../../../modals/AddPartModal.jsx";
import { FaSave } from "react-icons/fa";

export default function InspectionFormParts({
  inspectionId,
  forceSaveDisabled,
  onForceSave,
}) {
  const { t } = useTranslation();

  const [addPartModal, setAddPartModal] = useState(false);
  const [reloadTable, setReloadTable] = useState(false);

  const openAddPartModal = useCallback(() => {
    setAddPartModal(true);
  }, []);

  const closeAddParModal = useCallback(() => {
    setAddPartModal(false);
  }, []);

  const onSave = useCallback(() => {
    setReloadTable((prev) => !prev);
    closeAddParModal();
  }, [closeAddParModal]);

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <span className="text-primary text-xl">{t("parts.title")}</span>
        <button
          className="text-white bg-blue-950 disabled:bg-gray-400 rounded"
          disabled={!inspectionId}
          title={t("common.actions.add")}
          onClick={openAddPartModal}
        >
          <IoMdAdd className="inline-block text-xl mr-2" />
          {t("common.actions.add")}
        </button>
      </div>
      {inspectionId ? (
        <InspectionPartsTab
          inspectionId={inspectionId}
          editing={true}
          reloadTrigger={reloadTable}
        />
      ) : (
        <table className="min-w-full bg-white border rounded border-gray-200">
          <tbody>
            <tr>
              <td
                colSpan="100%"
                className="flex items-center flex-col gap-4 text-center py-10 text-gray-500 italic"
              >
                <span>
                  {t("inspections.management.no-saved-parts-message")}
                </span>
                <button
                  type="submit"
                  disabled={forceSaveDisabled}
                  className="bg-green-800 disabled:bg-gray-400 text-white px-4 py-2 rounded"
                  onClick={onForceSave}
                >
                  <FaSave className="inline-block mr-2" />
                  <span className="align-middle">
                    {t("common.actions.save")}
                  </span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {/* MODAL TO ADD PART TO INSPECTION */}
      {addPartModal && (
        <AddPartModal
          inspectionId={inspectionId}
          onSave={onSave}
          onCancel={closeAddParModal}
        />
      )}
    </>
  );
}
