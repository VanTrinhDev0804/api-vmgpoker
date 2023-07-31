const mongoose = require("mongoose");

const pokerRoomShema = new mongoose.Schema({
  // tên sự kiện
  name: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  shortName : {
    type: String,
    default : ""
  }, 
  logo:{
    type : String,
  }, 
  description:{
    type : String
  },
  Adress : {
    type : String
  },
  series : {
    type: [
        {
          idEvent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tourement",
            required: true,
          },
        },
      ],
      default :[]
  },
  historyEvent: {
    type: [
        {
          idEvent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
          },
        },
      ],
      default :[]
  },
  createAt : {
   type : Date
  }
});

module.exports = mongoose.model("PokerRom" ,pokerRoomShema);