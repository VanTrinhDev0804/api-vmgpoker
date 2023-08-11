const {
  createEvent,
  getAllEventPorker,
  getEventById,
  deleteEventById,
  updateInfoEvent,
  updateListPrizeEvent,
} = require("../controllers/eventsControllers");

const router = require("express").Router();

router.get("/", getAllEventPorker);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.post("/delete/:id", deleteEventById);
router.post("/update/:id", updateInfoEvent);
router.post("/updateprizelist/:id", updateListPrizeEvent);

// // Players join event

// router.post("/addeventjoin/:id", AddEventPlayersJoin)

module.exports = router;
