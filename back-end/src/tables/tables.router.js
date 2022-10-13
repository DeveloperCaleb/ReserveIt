const router = require("express").Router();
const controller = require("./tables.controller");
const cors = require("cors");
router.use(cors());

router.route("/").get(controller.list).post(controller.create);

router
  .route("/:table_id/seat")
  .put(controller.update)
  .delete(controller.delete);

module.exports = router;
