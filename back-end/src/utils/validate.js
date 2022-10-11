function validate(errorSet, key, condition) {
  if (condition() && key === "status") {
    errorSet.add(`${key} cannot be seated or finished`);
  } else if (condition()) {
    errorSet.add(key);
  } else {
    return;
  }
}

module.exports = validate;
