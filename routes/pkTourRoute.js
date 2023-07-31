const { getAllPokerTour, createPokerTour } = require("../controllers/PKTourControllers");

const router = require("express").Router();


router.get("/",getAllPokerTour )

router.post("/", createPokerTour)






module.exports = router;