const tablesService = require("./tables.service");
const validate = require("../utils/validate");
const { table } = require("../db/connection");

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

async function isValidReservation(req, res, next) {
  const { data } = req.body;

  try {
    const response = await tablesService.getReservation(data.reservation_id);
    res.locals.reservation = response[0];
  } catch (e) {
    console.error(e);
  }

  if (!data || !data.reservation_id) {
    return next({
      status: 400,
      message: `Invalid field(s): reservation_id}`,
    });
  } else if (!res.locals.reservation) {
    return next({
      status: 404,
      message: `Invalid field(s): ${data.reservation_id} doesn't exist.}`,
    });
  }
  return next();
}

async function validCapacity(req, res, next) {
  const { table_id } = req.params;
  const reservation = res.locals.reservation;
  const table = await tablesService
    .getTable(table_id)
    .then((response) => response[0]);

  if (
    table === [] ||
    table.reservation_id !== null ||
    table.capacity < reservation.people
  ) {
    return next({
      status: 400,
      message: `Invalid field(s): Table doesn't exist, capacity is too small, or is occupied.}`,
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

async function update(req, res, next) {
  const { table_id } = req.params;
  const { reservation_id } = req.body.data;
  try {
    const data = await tablesService.update(table_id, reservation_id);
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
}

module.exports = {
  list,
  create: [hasValidFields, hasValidData, create],
  update: [isValidReservation, validCapacity, update],
};
