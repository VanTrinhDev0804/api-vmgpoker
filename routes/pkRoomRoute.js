const { getAllPokerRoom, createPokerRoom } = require("../controllers/PKRoomControllers");


const router = require("express").Router();


router.get("/",getAllPokerRoom )

router.post("/", createPokerRoom)






module.exports = router;