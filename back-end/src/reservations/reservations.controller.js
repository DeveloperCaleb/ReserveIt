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
  const { body = {} } = req;

  const invalidFileds = validProperties.filter(
    (field) => !Object.keys(body).includes(field)
  );

  if (invalidFileds.length === 0) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFileds.join(", ")}`,
    });
  }
}

//* Handlers
async function listReservationsByDate(req, res) {
  console.log(req.query);
  if (req.query.date) {
    console.log("if");
    const { date } = req.query;
    try {
      const data = await reservationsService.listReservationsByDate(date);
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(400).json(error);
    }
  } else {
    console.log("else");
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
  // ! returning failed on 1 test even though everything indicates passing. (return a status of 201, it is doing that.)

  try {
    const data = await reservationsService.create(req.body);
    res.status(201).json({ data });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
}

module.exports = {
  listReservationsByDate,
  create: [hasValidFields, create],
};
