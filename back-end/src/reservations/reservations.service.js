const knex = require("../db/connection");
//
function list() {
  return knex("reservations").select("*");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
}

module.exports = { list, create };
