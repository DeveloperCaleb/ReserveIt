const reservationsService = require("./reservations.service");

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

  const invalidFileds = Object.keys(data).filter(
    (field) => !validProperties.includes(field)
  );

  if (invalidFileds.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFileds.join(", ")}`,
    });
  }
  next();
}

//* Handlers
async function list(req, res) {
  const data = await reservationsService.list();
  res.json({ data });
}

async function create(req, res, next) {
  console.log("received post request");
  console.log(req);

  reservationsService
    .create(req.body.data)
    .then((data) => res.status(201).json({ data }))
    .catch(next);
}

module.exports = {
  list,
  create: [create],
};
