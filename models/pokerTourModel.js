const mongoose = require("mongoose");

const pokerTourShema = new mongoose.Schema({
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
  avatar :{
    type: String
  }, 
  description:{
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
  createAt : {
   type : Date
  }
});

module.exports = mongoose.model("PokerTour" ,pokerTourShema);