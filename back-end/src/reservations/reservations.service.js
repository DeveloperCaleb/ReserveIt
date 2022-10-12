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

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function updateReservation(reservation_id, updatedReservationData) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_id })
    .update(updatedReservationData, "*");
}

module.exports = {
  listReservationsByDate,
  create,
  getReservation,
  updateStatus,
  search,
  updateReservation,
};
