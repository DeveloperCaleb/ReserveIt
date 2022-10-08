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

function getReservation(reservation_Id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_Id });
}

module.exports = { listReservationsByDate, create, getReservation };
