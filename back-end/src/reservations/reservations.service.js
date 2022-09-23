const knex = require("../db/connection");
//
function listReservationsByDate(date) {
  return knex("reservations")
    .select("*")
    .where({
      reservation_date: date,
    })
    .orderBy("reservation_time");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
}

module.exports = { listReservationsByDate, create };
