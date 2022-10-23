function InputField({ label, id, className, error, shouldValidate = true, ...rest }) {
  let inputClasses = 'form-control ' + (error ? 'is-invalid' : 'is-valid');

  if (shouldValidate) {
    inputClasses += error ? 'is-invalid' : 'is-valid';
  }

  return (
    <div className="mb-3 ">
      <label className="" htmlFor={id}>
        {label}
      </label>
      <input className={inputClasses + ', bg-light text-dark'} id={id} {...rest} />

      {shouldValidate && error && <div className="text-danger mt-1">{error}</div>}
    </div>
  );
}

export default InputField;