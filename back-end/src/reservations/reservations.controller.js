const reservationsService = require("./reservations.service");
const formatDate = require("../utils/format-date");

/**
 * * - Important information
 * ! - This isn't working
 * ? - I have a question about this
 * TODO - Needs completed
 */

/*
  TODO create new form
    first name
    last name
    mobile_number
    res date
    res time
  TODO create on click handler
  TODO create on change handler
  */

//* Middleware
const validProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;

  const bodyKeys = Object.keys(data);

  const invalidFields = validProperties.filter(
    (field) => !bodyKeys.includes(field)
  );

  if (invalidFields.length === 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
}

function hasValidEntries(req, res, next) {
  const { data = {} } = req.body;

  const bodyValues = Object.entries(data);

  const invalidEntries = bodyValues.filter((field) => {
    if (!field[1] || (field[0] === "people" && typeof field[1] === "string")) {
      return field[0];
    }
  });

  if (invalidEntries.length === 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidEntries.join(", ")}`,
    });
  }
}

function hasValidDate(req, res, next) {
  const validFormat = /^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/gm;
  const { data } = req.body;

  if (data.reservation_date.match(validFormat)) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Invalid field(s): reservation_date`,
    });
  }
}

function hasValidTime(req, res, next) {
  const validFormat = /^[0-9][0-9]:[0-9][0-9]/gm;
  const { data } = req.body;

  if (data.reservation_time.match(validFormat)) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Invalid field(s): reservation_time`,
    });
  }
}

function peopleIsANumber(req, res, next) {
  const { data } = req.body;

  if (!isNaN(data.people)) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Invalid field(s): people is not a number`,
    });
  }
}

//* Handlers
async function listReservationsByDate(req, res) {
  if (req.query.date) {
    const { date } = req.query;
    try {
      const data = await reservationsService.listReservationsByDate(date);
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  } else {
    const date = formatDate();

    try {
      const data = await reservationsService.listReservationsByDate(date);
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  }
}

async function create(req, res, next) {
  try {
    const data = await reservationsService.create(req.body.data);
    res.status(201).json({ data });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
}

module.exports = {
  listReservationsByDate,
  create: [
    hasValidFields,
    hasValidEntries,
    hasValidDate,
    hasValidTime,
    peopleIsANumber,
    create,
  ],
};
