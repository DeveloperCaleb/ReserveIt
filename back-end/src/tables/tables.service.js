const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdTable) => createdTable[0]);
}

function update(updatedTableId, reservation_id) {
  return knex("tables")
    .select("*")
    .where({ table_id: updatedTableId })
    .update({ reservation_id: reservation_id }, "*");
}

function getReservation(reservation_Id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_Id });
}

function getTable(table_id) {
  return knex("tables").select("*").where({ table_id });
}

//I can't just delete a single column value
function updateReservationId(table_id) {
  return knex("tables")
    .select("reservation_id")
    .where({ table_id })
    .update({ reservation_id: null });
}

function getTableWithReservation(reservation_id) {
  return knex("tables").select("*").where({ reservation_id: reservation_id });
}

module.exports = {
  list,
  create,
  update,
  getReservation,
  getTable,
  updateReservationId,
  getTableWithReservation,
};
