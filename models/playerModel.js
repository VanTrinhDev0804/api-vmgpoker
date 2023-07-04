const mongoose = require("mongoose");

const playerShema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  avatarImage: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360",
  },
  totalWinnings: {
    type: Number,
  },
  vpoyPoint: {
    type: Number,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  rankInCountry: {
    type: Number,
  },
  rankInCity: {
    type: Number,
  },
  eventJoin: {
    type: Array,
  },
});

module.exports = mongoose.model("Player", playerShema);
