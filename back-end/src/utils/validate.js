function validate(errorSet, key, condition) {
  if (condition()) {
    errorSet.add(key);
  } else {
    return;
  }
}

module.exports = validate;
