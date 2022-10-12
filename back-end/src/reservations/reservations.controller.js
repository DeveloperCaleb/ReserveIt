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

async function reservationExist(req, res, next) {
  const { reservation_id } = req.params;
  const { reservation_Id } = req.params;

  if (reservation_Id) {
    try {
      const response = await reservationsService.getReservation(reservation_Id);
      res.locals.reservation = response[0];
    } catch (error) {
      console.error(error);
      return next({
        status: 400,
        message: error,
      });
    }
  } else {
    try {
      const response = await reservationsService.getReservation(reservation_id);
      res.locals.reservation = response[0];
    } catch (error) {
      console.error(error);
      return next({
        status: 400,
        message: error,
      });
    }
  }

  if (res.locals.reservation) {
    return next();
  } else {
    return next({
      status: 404,
      message: `reservation ${reservation_id} does not exist`,
    });
  }
}

function hasValidStatus(req, res, next) {
  const { status } = res.locals.reservation;
  const requestStatus = req.body.data.status;

  if (requestStatus === "unknown" || status === "finished") {
    return next({
      status: 400,
      message: `status cannot be unknown or finished`,
    });
  } else if (status === "seated" && requestStatus === "seated") {
    return next({
      status: 400,
      message: `reservation ${res.locals.reservation.reservation_id} cannot be seated`,
    });
  } else {
    return next();
  }
}

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
    validate(errors, key, () => key === "status" && value === "seated");
    validate(errors, key, () => key === "status" && value === "finished");
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

//* Handlers
async function listReservationsByDate(req, res) {
  if (req.query.mobile_number) {
    const { mobile_number } = req.query;
    try {
      const data = await reservationsService.search(mobile_number);
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  } else if (req.query.date) {
    const { date } = req.query;
    try {
      const data = await reservationsService.listReservationsByDate(date);
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  } else {
    const date = today();

    try {
      const data = await reservationsService.listReservationsByDate(date);
      res.status(200).json({ data });
    } catch (error) {
      console.error(error);
      res.status(400).json({ error });
    }
  }
}

async function create(req, res, next) {
  try {
    const data = await reservationsService.create(req.body.data);
    res.status(201).json({ data });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
}

async function getReservation(req, res, next) {
  const { reservation_Id } = req.params;
  try {
    const response = await reservationsService.getReservation(reservation_Id);
    const data = response[0];
    if (!data) {
      throw `Reservation with the Id ${reservation_Id} does not exist.`;
    } else {
      res.status(200).json({ data });
    }
  } catch (error) {
    console.error(error);
    res.status(404).json({ error });
  }
}

async function updateStatus(req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;

  try {
    const response = await reservationsService.updateStatus(
      reservation_id,
      status
    );
    const data = response[0];
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
}

async function updateReservation(req, res, next) {
  const { reservation_Id } = req.params;
  const updatedReservationData = req.body.data;
  try {
    const response = await reservationsService.updateReservation(
      reservation_Id,
      updatedReservationData
    );
    const data = response[0];
    res.status(200).json({ data });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error });
  }
}

module.exports = {
  listReservationsByDate,
  create: [hasValidFields, hasValidData, create],
  getReservation,
  updateStatus: [reservationExist, hasValidStatus, updateStatus],
  updateReservation: [
    reservationExist,
    hasValidFields,
    hasValidData,
    updateReservation,
  ],
};
