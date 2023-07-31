const { getAllTourement, createTourement } = require("../controllers/TourementControllers");

const router = require("express").Router();


router.get("/", getAllTourement )

router.post("/", createTourement)






module.exports = router;