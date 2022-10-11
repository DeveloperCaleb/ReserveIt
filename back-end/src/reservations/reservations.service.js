const knex = require("../db/connection");
//
function listReservationsByDate(date) {
  return knex("reservations")
    .select("*")
    .where({
      reservation_date: date,
    })
    .whereNot({ status: "finished" })
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

function updateStatus(reservation_id, status) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .update({ status: status }, "*");
}

module.exports = {
  listReservationsByDate,
  create,
  getReservation,
  updateStatus,
};
