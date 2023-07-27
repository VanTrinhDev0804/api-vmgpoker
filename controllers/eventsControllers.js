const EventModal = require("../models/eventModel");
const playerModel = require("../models/playerModel");
const Player = require("../models/playerModel");
module.exports.createEvent = async (req, res, next) => {
  const { data } = req.body;

  if (data) {
    let checkEnvent = await EventModal.findOne({ nameEvent: data.nameEvent });
    let datasortListprize = data.resultsPrize.sort((p1, p2) =>
      p1.place > p2.place ? 1 : p1.place < p2.place ? -1 : 0
    );
    let dataSave = { ...data, resultsPrize: datasortListprize };
    //              kiểm tra sự kiện porker đã tồn tại
    if (checkEnvent) {
      return res
        .status(300)
        .json({ message: "Poker event already exists on the system" });
    } else {
      // Lưu sự kiện vao database
      const enventValue = await EventModal.create({ ...dataSave })
        .then((event) => {
          // xử lý người chơi tham gia sự kiện
          let listPrize = event.resultsPrize.forEach(async (it, index) => {
            let player = await Player.findById(it._id);
            let newTotalWin = player.totalWinnings + it.prize;
            let newEventjoin = player.historyEvent
              .concat({
                _id: event._id,
                nameEvent: event.nameEvent,
                dateEvent: event.dateEvent,
                place: it.place,
                entries: event.entries,
                buyin: event.buyIn,
                prize: it.prize,
              })
              .sort((p1, p2) =>
                p1.place > p2.place ? 1 : p1.place < p2.place ? -1 : 0
              );

            await Player.findByIdAndUpdate(it._id, {
              totalWinnings: newTotalWin,
              historyEvent: newEventjoin,
            });
          });

          return res
            .status(200)
            .json({ message: "create event success", data: event });
        })
        .catch((err) => {
          return res.status(400).json({ message: "Failed", error: err });
        });
    }
  } else {
    return res.status(400).json({ message: "Failed create" });
  }
};

// load event porker

module.exports.getAllEventPorker = async (req, res, next) => {
  try {
    // request query
    const q = req.query;

    if (q !== undefined) {
      const eventPorkers = await EventModal.find(q).sort({ totalWinnings: -1 });

      return res.status(200).json({ status: true, eventPorkers });
    } else {
      const eventPorkers = await EventModal.find().sort({ totalWinnings: -1 });
      return res.status(200).json({ status: true, eventPorkers });
    }
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(500).json({ error });
  }
};

module.exports.getEventById = async (req, res, next) => {
  // request query
  const { id } = req.params;
  let events = await EventModal.findById(id)
    .then((event) => {
      if (event) {
        return res.status(200).json({ event });
      } else {
        return res.status(400).json({ message: "Not Found!! " });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: "Failed", error: err });
    });
};

module.exports.deleteEventById = async (req, res, next) => {
  // request query
  const { id } = req.params;
  let events = await EventModal.findByIdAndDelete(id)
    .then(async (event) => {
      let player = await playerModel.find({ "historyEvent._id": id });
      player.forEach(async (it, index) => {
        let newlist = it.historyEvent.filter(
          (ite) => ite._id.toString() !== id
        );
        let valueDelete = it.historyEvent.find(
          (ite) => ite._id.toString() === id
        );
        let prizeUpdate = it.totalWinnings - valueDelete.prize;
        let idUpdate = it._id;
        const updatePl = await playerModel.findByIdAndUpdate(idUpdate, {
          historyEvent: newlist,
          totalWinnings : prizeUpdate
        });
      });
      if (event) {
        return res.status(200).json({ message: "Deleted Success" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: "Failed", error: err });
    });
};
