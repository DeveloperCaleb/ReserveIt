/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router
  .route("/")
  .get(controller.listReservationsByDate)
  .post(controller.create);

router.route("/:reservation_Id").get(controller.getReservation);

module.exports = router;
