const mongoose = require("mongoose");

const TourementShema = new mongoose.Schema({
  // tên sự kiện
  nameTour: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  dayStart: {
    type: Date
  },
  dayEnd: {
    type: Date
  },
  image : {
    type: String
  },
  pokerTourId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PokerTour",
  },
  pokerRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PokerRom",
  },
  venueTour : {
    type : String
  },
  Schedule : {
    type: [
      
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
          required: true,
        },
      
    ],
    default :[]
  }, 
  createAt : {
   type : Date
  }
});

module.exports = mongoose.model("Tourement" ,TourementShema);