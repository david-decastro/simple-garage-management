export default function InputField({
  name,
  register,
  errors = {},
  validation,
  className = "",
  type = "text",
  ...props
}) {
  const baseClassName = `px-3 py-1 border-1 rounded-md border-gray-500 bg-white text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
    errors?.[name] ? "border-red-500" : ""
  } ${className}`;

  const handleKeyDown = (e) => {
    if (e.key === "," && type === "number") {
      e.preventDefault();
    }
  };

  const inputProps = {
    ...props,
    ...(register ? register(name, validation) : {}),
    className: baseClassName,
    onKeyDown: handleKeyDown,
  };

  const renderInput = () =>
    type === "textarea" ? (
      <textarea {...inputProps} />
    ) : (
      <input type={type} {...inputProps} />
    );

  return (
    <div>
      {renderInput()}
      {errors?.[name] && (
        <span className="block text-red-500 text-sm mt-1">
          {errors[name].message}
        </span>
      )}
    </div>
  );
}
