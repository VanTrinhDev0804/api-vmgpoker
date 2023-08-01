const { createEvent, getAllEventPorker, getEventById, deleteEventById, getAllEventforTourement } = require("../controllers/eventsControllers");



const router = require("express").Router();


router.get("/", getAllEventPorker)
router.get("/:id", getEventById)
router.post("/", createEvent)
router.post("/delete/:id", deleteEventById)

// // Players join event


// router.post("/addeventjoin/:id", AddEventPlayersJoin)

module.exports = router;