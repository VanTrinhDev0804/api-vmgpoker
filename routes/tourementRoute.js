const { getAllTourement, createTourement, deleteTourementByID } = require("../controllers/TourementControllers");

const router = require("express").Router();


router.get("/", getAllTourement )

router.post("/", createTourement)
router.post("/delete/:id",deleteTourementByID )






module.exports = router;