const reservationsService = require("./reservations.service");
const today = require("../utils/today");
const validate = require("../utils/validate");

/**
 * * - Important information
 * ! - This isn't working
 * ? - I have a question about this
 * TODO - Needs completed
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
  const { data = {} } = req.body;
  const errors = new Set();
  const validDateFormat = /^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/gm;
  const validTimeFormat = /^[0-9][0-9]:[0-9][0-9]/gm;

  const selectedDate = data.reservation_date.split("-");
  const selectedDateFormatted = new Date(
    selectedDate[0],
    selectedDate[1] - 1,
    selectedDate[2]
  );

  const todaysDate = today().split("-");
  const todaysDateFormatted = new Date(
    todaysDate[0],
    todaysDate[1] - 1,
    todaysDate[2]
  );

  const selectedTime = data.reservation_time;

  const currentTime = new Date();
  const currentTimeFormatted = `${currentTime.getHours()}:${currentTime.getMinutes()}`;

  for (const [key, value] of Object.entries(data)) {
    validate(errors, key, () => !value);
    validate(errors, key, () => key === "people" && typeof value !== "number");
    validate(
      errors,
      key,
      () =>
        key === "reservation_date" &&
        (!data.reservation_date.match(validDateFormat) ||
          selectedDateFormatted.getDay() == 2 ||
          selectedDateFormatted < todaysDateFormatted)
    );
    validate(errors, key, () => !selectedTime.match(validTimeFormat));
    validate(errors, key, () => selectedTime < "10:30");
    validate(errors, key, () => selectedTime > "21:29");
    validate(
      errors,
      key,
      () => selectedDate === todaysDate && selectedTime < currentTimeFormatted
    );
  }

  if (errors.has("reservation_date")) {
    return next({
      status: 400,
      message: `Invalid field(s): ${Array.from(
        errors
      )}. Date must be in the future, closed on Tuesday's`,
    });
  } else if (errors.size > 0) {
    return next({
      status: 400,
      message: `Invalid field(s): ${Array.from(errors)}`,
    });
  }
  return next();
}

/*function hasValidEntries(req, res, next) {
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
}*/

/*function hasValidDate(req, res, next) {
  const validFormat = /^[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/gm;
  const { data } = req.body;

  const selectedDate = data.reservation_date.split("-");

  const selectedDateFormatted = new Date(
    selectedDate[0],
    selectedDate[1] - 1,
    selectedDate[2]
  );

  const todaysDate = today().split("-");
  const todaysDateFormatted = new Date(
    todaysDate[0],
    todaysDate[1] - 1,
    todaysDate[2]
  );

  if (
    data.reservation_date.match(validFormat) &&
    selectedDateFormatted.getDay() !== 2 &&
    selectedDateFormatted >= todaysDateFormatted
  ) {
    return next();
  } else if (!data.reservation_date.match(validFormat)) {
    return next({
      status: 400,
      message: `Invalid field(s): reservation_date`,
    });
  } else if (selectedDateFormatted.getDay() == 2) {
    return next({
      status: 400,
      message: `Invalid date: closed on Tuesdays`,
    });
  } else if (selectedDateFormatted < todaysDateFormatted) {
    return next({
      status: 400,
      message: `Invalid date: reservation must be for today or in the future`,
    });
  }
}*/

/*function hasValidTime(req, res, next) {
  const validFormat = /^[0-9][0-9]:[0-9][0-9]/gm;
  const { data } = req.body;

  const selectedTime = data.reservation_time.split(":");

  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();

  if (!data.reservation_time.match(validFormat)) {
    return next({
      status: 400,
      message: `Invalid field(s): reservation_time`,
    });
  } else if (
    parseInt(selectedTime[0]) < 10 ||
    (parseInt(selectedTime[0]) <= 10 && parseInt(selectedTime[1]) < 30)
  ) {
    return next({
      status: 400,
      message: "Not opened until 10:30AM!",
    });
  } else if (
    parseInt(selectedTime[0]) > 21 ||
    (parseInt(selectedTime[0]) >= 21 && parseInt(selectedTime[1]) > 29)
  ) {
    return next({
      status: 400,
      message: "Too soon to closing. Closed at 10:30PM!",
    });
  } else if (
    parseInt(selectedTime[0]) <= hour ||
    (parseInt(selectedTime[0]) <= hour && parseInt(selectedTime[1]) <= minutes)
  ) {
    return next({
      status: 400,
      message: "Reservation must be in the future!",
    });
  }

  return next();
}*/

/*function peopleIsANumber(req, res, next) {
  const { data } = req.body;

  if (!isNaN(data.people)) {
    return next();
  } else {
    return next({
      status: 400,
      message: `Invalid field(s): people is not a number`,
    });
  }
}*/

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
    const date = today();

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
  create: [hasValidFields, hasValidData, create],
};
