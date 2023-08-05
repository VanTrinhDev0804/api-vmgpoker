const { getAllPokerRoom, createPokerRoom, getPokerRoomByID, updateInfoPokerRoom, deletePokerRoomByID } = require("../controllers/PKRoomControllers");


const router = require("express").Router();


router.get("/",getAllPokerRoom )
router.get("/:id",getPokerRoomByID )
router.post("/", createPokerRoom)
router.post("/update/:id", updateInfoPokerRoom)
router.post("/delete/:id", deletePokerRoomByID)






module.exports = router;