const EventModal = require("../models/eventModel");
const playerModel = require("../models/playerModel");
const PokerTour = require("../models/pokerTourModel");
const PokerRoom = require("../models/pokerRomModel");

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
          if (event.resultsPrize.length > 0) {
            let listPrize = event.resultsPrize.forEach(async (it, index) => {
              let player = await playerModel.findById(it._id);
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

              await playerModel.findByIdAndUpdate(it._id, {
                totalWinnings: newTotalWin,
                historyEvent: newEventjoin,
              });
            });
          } // xử lý người chơi tham gia sự kiện

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
    console.log(q);
    const lstPKTour = await PokerTour.find();
    const lstPKRoom = await PokerRoom.find();
    if (q !== undefined) {
      const eventPorkers = await EventModal.find(q);
      const lstEvents = eventPorkers.reduce((el, curr, i) => {
        let pokerRoom = lstPKRoom.find((ite) => {
          if (curr.pokerRoomId !== undefined) {
            return ite.id === curr.pokerRoomId.toString();
          }
        });
        let pokerTour = lstPKTour.find((ite) => {
          if (curr.pokerTourId !== undefined) {
            return ite.id === curr.pokerTourId.toString();
          }
        });
        const pk = { ...curr.toObject(), pokerRoom, pokerTour };
        return el.concat({ ...pk });
      }, []);

      return res.status(200).json({ status: true, eventPorkers: lstEvents });
    } else {
      // else
      const eventPorkers = await EventModal.find();

      const lstEvents = eventPorkers.reduce((el, curr, i) => {
        let pokerRoom = lstPKRoom.find((ite) => {
          if (curr.pokerRoomId !== undefined) {
            return ite.id === curr.pokerRoomId.toString();
          }
        });
        let pokerTour = lstPKTour.find((ite) => {
          if (curr.pokerTourId !== undefined) {
            return ite.id === curr.pokerTourId.toString();
          }
        });
        const pk = { ...curr.toObject(), pokerRoom, pokerTour };
        return el.concat({ ...pk });
      }, []);

      return res.status(200).json({ status: true, eventPorkers: lstEvents });
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
  const lstPKTour = await PokerTour.find();
  const lstPKRoom = await PokerRoom.find();
  let events = await EventModal.findById(id)
    .then((event) => {
      if (event) {
        let pokerRoom = lstPKRoom.find((ite) => {
          if (event.pokerRoomId !== undefined) {
            return ite.id === event.pokerRoomId.toString();
          }
        });
        let pokerTour = lstPKTour.find((ite) => {
          if (event.pokerTourId !== undefined) {
            return ite.id === event.pokerTourId.toString();
          }
        });
        let dataEvent = {...event.toObject() , pokerRoom , pokerTour}
        
        return res.status(200).json({ event: dataEvent });
      } else {
        return res.status(400).json({ message: "Not Found!! " });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: "Failed", error: err });
    });
};
module.exports.updateInfoEvent = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const updateInfo = await EventModal.findByIdAndUpdate(id, {
    nameEvent: data.nameEvent,
    buyIn: data.buyIn,
    venueEvent: data.venueEvent,
    dateEvent: data.dateEvent,
    entries: data.entries,
    pokerRoomId: data.pokerRoomId,
    pokerTourId: data.pokerTourId,
  });
};

module.exports.deleteEventById = async (req, res, next) => {
  // request query
  const { id } = req.params;

  let events = await EventModal.findByIdAndDelete(id)
    .then(async (event) => {
      if (event) {
        // tìm event người chơi đã tham gia

        let player = await playerModel.find({ "historyEvent._id": id });

        player.forEach(async (it, index) => {
          // xóa event trong lịch xử tham gia
          let newlist = it.historyEvent.filter((ite) => {
            return ite.id !== id;
          });

          let valueDelete = it.historyEvent.find((ite) => ite.id === id);
          // cập nhật giải thưởng

          let prizeUpdate = it.totalWinnings - valueDelete.prize;
          let idUpdate = it._id;
          const updatePl = await playerModel.findByIdAndUpdate(idUpdate, {
            historyEvent: newlist,
            totalWinnings: prizeUpdate,
          });
        });
        return res.status(200).json({ message: "Deleted Success" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: "Failed", error: err });
    });
};



