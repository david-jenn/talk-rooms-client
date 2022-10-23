function onInputChange(evt, setValue) {
  const newValue = evt.currentTarget.value;
  setValue(newValue);
}

export default onInputChange;