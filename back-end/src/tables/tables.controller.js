const tablesService = require("./tables.service");
const validate = require("../utils/validate");

//middleware

const validProperties = ["table_name", "capacity"];

function hasValidFields(req, res, next) {
  const { data } = req.body;

  if (!data) {
    return next({
      status: 400,
      message: `Missing Data`,
    });
  }

  const keys = Object.keys(data);

  const invalidFields = validProperties.filter((key) => !keys.includes(key));

  if (invalidFields.length > 0) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  return next();
}

function hasValidData(req, res, next) {
  const { data } = req.body;

  const errors = new Set();

  for (const [key, value] of Object.entries(data)) {
    validate(errors, key, () => key === "table_name" && value.length < 2);
    validate(errors, key, () => key === "capacity" && value === 0);
    validate(
      errors,
      key,
      () => key === "capacity" && typeof value !== "number"
    );
  }

  if (errors.size > 0) {
    return next({
      status: 400,
      message: `Invalid field(s): ${Array.from(errors)}`,
    });
  }
  return next();
}

//route handlers
async function list(req, res, next) {
  const data = await tablesService.list();
  res.status(200).json({ data });
}

async function create(req, res, next) {
  try {
    const data = await tablesService.create(req.body.data);
    res.status(201).json({ data });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
}

module.exports = {
  list,
  create: [hasValidData, create],
};
