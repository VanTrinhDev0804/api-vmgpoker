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
    default: 0,
  },
  vpoyPoint: {
    type: Number,
    default: 0,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  linkInfo: {
    type: String,
    default: "",
  },
  historyEvent: {
    type: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event",
          required: true,
        },
        // nameEvent: String,
        // dateEvent: Date,
        place: Number,
        // entries: Number,
        // buyin: Number,
        prize: Number,
      },
    ],
    default: [],
  },
});

module.exports = mongoose.model("Player", playerShema);
