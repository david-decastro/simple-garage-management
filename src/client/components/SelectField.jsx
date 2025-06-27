function SelectField({
  label,
  loading,
  name,
  customKey,
  customValue,
  options = [],
  register,
  validation = {},
  errors = {},
  placeholder,
  className = "",
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={name} className="block text-primary mb-1 text-xl">
          {label}
        </label>
      )}

      <select
        id={name}
        {...register(name, validation)}
        className="w-full border border-gray-300 rounded px-3 py-2"
        disabled={loading}
      >
        <option value="">{loading ? "Cargando..." : placeholder}</option>
        {!loading &&
          options.map((option) => (
            <option
              key={option[customKey]}
              value={customValue ? option[customValue] : option[customKey]}
            >
              {option.name ?? option.label}
            </option>
          ))}
      </select>

      {errors[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>
      )}
    </div>
  );
}

export default SelectField;
