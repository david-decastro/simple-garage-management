import InputField from "../../../components/InputField.jsx";
import partTypes from "../../../enums/PartType.js";
import oilViscosityGrades from "../../../enums/OilViscosityGrade.js";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export function PartListFilters({ onChange }) {
  const { t } = useTranslation();

  const [textFilter, setTextFilter] = useState("");
  const [debouncedFilter, setDebouncedFilter] = useState("");

  const [partTypeFilter, setPartTypeFilter] = useState("");
  const [oilViscosityFilter, setOilViscosityFilter] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(textFilter);
    }, 500);

    return () => clearTimeout(handler);
  }, [textFilter]);

  const filters = useMemo(() => {
    return {
      ...(debouncedFilter && {
        name: debouncedFilter,
        barcode: debouncedFilter,
      }),
      ...(partTypeFilter && { type: partTypeFilter }),
      ...(oilViscosityFilter && { oilViscosity: oilViscosityFilter }),
    };
  }, [debouncedFilter, oilViscosityFilter, partTypeFilter]);

  useEffect(() => {
    onChange(filters);
  }, [filters, onChange]);

  const onTypeChange = useCallback((e) => {
    setPartTypeFilter(e.target.value);
    if (e.target.value == null || e.target.value === "") {
      setOilViscosityFilter(null);
    }
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="flex-1">
        <InputField
          className="w-full"
          placeholder={t("parts.fields.name")}
          onChange={(e) => setTextFilter(e.target.value)}
        />
      </div>
      <div className="flex-1">
        <select
          id="partType"
          className="w-full border bg-white text-primary border-gray-500 rounded px-2 py-1 mr-2"
          onChange={onTypeChange}
        >
          <option value="">{`-- ${t("parts.fields.type")} --`}</option>
          {Object.values(partTypes).map((val) => (
            <option key={val} value={val}>
              {t(`enum.part-type.${val}`)}
            </option>
          ))}
        </select>
      </div>
      {partTypeFilter === partTypes.OIL && (
        <div className="flex-1">
          <select
            id="oilViscosity"
            className="w-full border bg-white text-primary border-gray-500 rounded px-2 py-1 mr-2"
            onChange={(e) => setOilViscosityFilter(e.target.value)}
          >
            <option value="">{`-- ${t("parts.fields.oilViscosity")} --`}</option>
            {Object.values(oilViscosityGrades).map((val) => (
              <option key={val} value={val}>
                {val}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
