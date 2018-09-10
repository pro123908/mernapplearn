const validator = require("validator");
const isEmpty = require("./isEmpty");

//Login input validation

module.exports = function validateExperienceInput(data) {
  let errors = {};

  // As validator only deals with strings so we have to make empty things strings
  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  if (validator.isEmpty(data.title)) {
    errors.title = "Job title is required";
  }

  if (validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }

  if (validator.isEmpty(data.from)) {
    errors.from = "from date field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
