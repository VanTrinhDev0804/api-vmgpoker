const { getAllTourement, createTourement, deleteTourementByID, getTourementById, updateInfoTourement } = require("../controllers/TourementControllers");

const router = require("express").Router();


router.get("/", getAllTourement )
router.get("/:id", getTourementById )
router.post("/", createTourement)
router.post("/delete/:id",deleteTourementByID )
router.post("/update/:id",updateInfoTourement)






module.exports = router;