const { getAllPokerTour, createPokerTour, getPokerTourByID, updateInfoPokerTour, deletePokerTourByID } = require("../controllers/PKTourControllers");

const router = require("express").Router();


router.get("/",getAllPokerTour )
router.get("/:id",getPokerTourByID )

router.post("/", createPokerTour)
router.post("/update/:id", updateInfoPokerTour)
router.post("/delete/:id", deletePokerTourByID)






module.exports = router;