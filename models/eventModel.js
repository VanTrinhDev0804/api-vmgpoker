const mongoose = require("mongoose");

const eventShema = new mongoose.Schema({
  // tên sự kiện
  nameEvent: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  buyIn:{
    type : Number,
  }, 
  //nơi tổ chức
  venueEvent : {
    type: String
  }, 
  // ngày tổ chức
  dateEvent: {
    type : Date
  },
  // tổng người tham gia event
  entries : {
    type : Number
  },
  tourementID: {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Tourement",
    require: true
  },
  pokerTourId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PokerTour",
    require : true
  },
  pokerRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PokerRom",
    require : true

  },
  resultsPrize : {
    type: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Player",
          required: true,
        },
    
        place: Number,
        prize: Number,
      },
    ],
    default :[]
  },
  createAt : {
   type : Date
  }
});

module.exports = mongoose.model("Event" ,eventShema);