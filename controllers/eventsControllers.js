const EventModal = require("../models/eventModel");
const playerModel = require("../models/playerModel");
const PokerTour = require("../models/pokerTourModel");
const PokerRoom = require("../models/pokerRomModel");
const { calCulatorVpoy } = require("../services/calculator");
let M = 1000000;

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
          let prizepool = event.entries * event.buyIn;

          // xử lý người chơi tham gia sự kiện
          if (event.resultsPrize.length > 0) {
            if (event.entries >= 50 && prizepool >= 1000 * M) {
              let listPrize = event.resultsPrize.forEach(async (it, index) => {
                let pointIncrease = calCulatorVpoy(
                  it.place,
                  event.entries,
                  event.buyIn
                );
                let player = await playerModel.findById(it._id);

                let point = player.vpoyPoint + pointIncrease;
                let newTotalWin = player.totalWinnings + it.prize;
                let newEventjoin = player.historyEvent
                  .concat({
                    _id: event._id,
                    place: it.place,
                    prize: it.prize,
                  })
                  .sort((p1, p2) =>
                    p1.dateEvent < p2.dateEvent
                      ? 1
                      : p1.dateEvent > p2.dateEvent
                      ? -1
                      : 0
                  );

                await playerModel.findByIdAndUpdate(it._id, {
                  totalWinnings: newTotalWin,
                  vpoyPoint: point,
                  historyEvent: newEventjoin,
                });
              });
            } else {
              let listPrize = event.resultsPrize.forEach(async (it, index) => {
                let player = await playerModel.findById(it._id);
                let newTotalWin = player.totalWinnings + it.prize;
                let newEventjoin = player.historyEvent
                  .concat({
                    _id: event._id,
                    place: it.place,
                    prize: it.prize,
                  })
                  .sort((p1, p2) =>
                    p1.dateEvent < p2.dateEvent
                      ? 1
                      : p1.dateEvent > p2.dateEvent
                      ? -1
                      : 0
                  );

                await playerModel.findByIdAndUpdate(it._id, {
                  totalWinnings: newTotalWin,
                  historyEvent: newEventjoin,
                });
              });
            }
          }

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

    const lstPKTour = await PokerTour.find();
    const lstPKRoom = await PokerRoom.find();
    const lstPlayers = await playerModel.find();

    if (q !== undefined) {
      const eventPorkers = await EventModal.find(q).sort({ dateEvent: -1 });
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
        // xử lý result Prize

        let formaterLstPrize = curr.resultsPrize.reduce((initalPl, currPl) => {
          let pl = lstPlayers.find((ite) => {
            if (currPl._id !== undefined) {
              return ite.id === currPl._id.toString();
            }
          });
          if (pl) {
            let param = {
              ...currPl.toObject(),
              playerName: pl.playerName,
            };
            return initalPl.concat({ ...param });
          } else {
            return initalPl.concat({ ...currPl.toObject() });
          }
        }, []);

        let it = {
          ...curr.toObject(),
          resultsPrize: formaterLstPrize,
          pokerRoom,
          pokerTour,
        };

        return el.concat({ ...it });
      }, []);

      return res.status(200).json({ status: true, eventPorkers: lstEvents });
    } else {
      // else

      const eventPorkers = await EventModal.find().sort({ dateEvent: -1 });

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
        // xử lý result Prize

        let formaterLstPrize = curr.resultsPrize.reduce((initalPl, currPl) => {
          let pl = lstPlayers.find((ite) => {
            if (currPl._id !== undefined) {
              return ite.id === currPl._id.toString();
            }
          });
          if (pl) {
            let param = {
              ...currPl.toObject(),
              playerName: pl.playerName,
            };
            return initalPl.concat({ ...param });
          } else {
            return initalPl.concat({ ...currPl.toObject() });
          }
        }, []);

        let it = {
          ...curr.toObject(),
          resultsPrize: formaterLstPrize,
          pokerRoom,
          pokerTour,
        };

        return el.concat({ ...it });
      }, []);

      return res.status(200).json({ status: true, eventPorkers: lstEvents });
    }
  } catch (error) {
    next(error);
    return res.status(500).json({ error });
  }
};

module.exports.getEventById = async (req, res, next) => {
  // request query
  const { id } = req.params;
  const lstPKTour = await PokerTour.find();
  const lstPKRoom = await PokerRoom.find();
  const lstPlayers = await playerModel.find();
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
        let formaterLstPrize = event.resultsPrize.reduce((el, curr, i) => {
          let pl = lstPlayers.find((ite) => {
            if (curr._id !== undefined) {
              return ite.id === curr._id.toString();
            }
          });

          let param = {
            ...curr.toObject(),
            playerName: pl.playerName,
          };
          return el.concat({ ...param });
        }, []);

        let dataEvent = {
          ...event.toObject(),
          pokerRoom,
          pokerTour,
          resultsPrize: formaterLstPrize,
        };

        return res.status(200).json({ event: dataEvent });
      } else {
        return res.status(400).json({ message: "Not Found!! " });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: "Failed", error: err });
    });
};

module.exports.updateInfoEvent = async (req, res, next) => {
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
    tourementID: data.tourementID,
  })
    .then(async (event) => {
      if (event) {
        // update  history Event of người chơi
        const eventNew = await EventModal.findById(event.id);
        if (eventNew.resultsPrize.length > 0) {
          let prizepoolOld = event.entries * event.buyIn;
          let prizepool = eventNew.entries * eventNew.buyIn;
          if (
            (eventNew.entries >= 50 && prizepool >= 1000 * M) ||
            (event.entries >= 50 && prizepoolOld >= 1000 * M)
          ) {
            let listPrize = eventNew.resultsPrize.forEach(async (it, index) => {
              // tính point mới
              let pointEventNew = calCulatorVpoy(
                it.place,
                eventNew.entries,
                eventNew.buyIn
              );
              // point cũ
              let pointEventOld = calCulatorVpoy(
                it.place,
                event.entries,
                event.buyIn
              );
              let player = await playerModel.findById(it._id);
              // điểm vpoy cũ = 50 nếu điểm mới = 100 => điểm tăng= 100 -50 = 50 => cộng vào vpotpoint//
              // ngược lại điểm cũ = 100 điểm mới = 50 => điểm tăng = 50 -100 = -50 => cộng vào vpoint//

              let pointChange =
                pointEventOld <= pointEventNew
                  ? pointEventNew - pointEventOld
                  : pointEventNew - pointEventOld;
              let point = player.vpoyPoint + pointChange;
              await playerModel.findByIdAndUpdate(it._id, {
                vpoyPoint: point,
              });
            });
          }
        }

        return res.status(200).json({ message: "successfully" });
      } else {
        return res.status(400).json({ message: "Have Error" });
      }
    })
    .catch((err) => {
      next(err);
      return res.status(400).json({ message: "Failed", error: err });
    });
};
module.exports.updateListPrizeEvent = async (req, res, next) => {
  // request query
  const { id } = req.params;
  const { data } = req.body;
  let events = await EventModal.findByIdAndUpdate(id, {
    resultsPrize: data.resultsPrize,
  })
    .then(async (event) => {
      if (event) {
        // tìm event người chơi đã tham gia
        // xoa lich su cu
        let player = await playerModel.find({ "historyEvent._id": id });

        player.forEach(async (it, index) => {
          // xóa event trong lịch xử tham gia
          let newlist = it.historyEvent.filter((ite) => {
            return ite.id !== id;
          });
          // lọc event để xóa
          let valueDelete = it.historyEvent.find((ite) => ite.id === id);
          // cập nhật vpoint
          let prizepool = valueDelete.entries * valueDelete.buyin;
          if (valueDelete.entries >= 50 && prizepool >= 1000 * M) {
            let pointDiscount = calCulatorVpoy(
              valueDelete.place,
              valueDelete.entries,
              valueDelete.buyin
            );
            let vpointUpdate = it.vpoyPoint - pointDiscount;

            // cập nhật giải thưởng
            let prizeUpdate = it.totalWinnings - valueDelete.prize;
            let idUpdate = it._id;
            const updatePl = await playerModel.findByIdAndUpdate(idUpdate, {
              historyEvent: newlist,
              totalWinnings: prizeUpdate,
              vpoyPoint: vpointUpdate,
            });
          } else {
            // cập nhật giải thưởng khong co vpoy point
            let prizeUpdate = it.totalWinnings - valueDelete.prize;
            // let vpointUpdate = it.vpoyPoint - valueDelete
            let idUpdate = it._id;
            const updatePl = await playerModel.findByIdAndUpdate(idUpdate, {
              historyEvent: newlist,
              totalWinnings: prizeUpdate,
            });
          }
        });
       
      }
      return {...event.toObject(), resultsPrize:  data.resultsPrize}
    })
    .then((eventNew) => {
     
      // Cap nhat giai moi
      let prizepool = eventNew.entries * eventNew.buyIn;
      // let checkYearNow = eventNew.dateEvent.getFullYear() === Date().now().getFullYear() ? true : false
      // console.log(checkYearNow)
      // console.log('====================================');
      // console.log(eventNew.dateEvent.getFullYear() , Date().now().getFullYear());
      // console.log('====================================');
      // xử lý người chơi tham gia sự kiện
      if (eventNew.resultsPrize.length > 0) {
        if (eventNew.entries >= 50 && prizepool >= 1000 * M) {
          let listPrize = eventNew.resultsPrize.forEach(async (it, index) => {
            let pointIncrease = calCulatorVpoy(
              it.place,
              eventNew.entries,
              eventNew.buyIn
            );
            let player = await playerModel.findById(it._id);

            let point = player.vpoyPoint + pointIncrease;
            let newTotalWin = player.totalWinnings + it.prize;
            let newEventjoin = player.historyEvent
              .concat({
                _id: eventNew._id,
                place: it.place,
                prize: it.prize,
              })
              .sort((p1, p2) =>
                p1.dateEvent < p2.dateEvent
                  ? 1
                  : p1.dateEvent > p2.dateEvent
                  ? -1
                  : 0
              );

            await playerModel.findByIdAndUpdate(it._id, {
              totalWinnings: newTotalWin,
              vpoyPoint: point,
              historyEvent: newEventjoin,
            });
          });
        } else {
          let listPrize = eventNew.resultsPrize.forEach(async (it, index) => {
            let player = await playerModel.findById(it._id);
            let newTotalWin = player.totalWinnings + it.prize;
            let newEventjoin = player.historyEvent
              .concat({
                _id: eventNew._id,
                place: it.place,
                prize: it.prize,
              })
              .sort((p1, p2) =>
                p1.dateEvent < p2.dateEvent
                  ? 1
                  : p1.dateEvent > p2.dateEvent
                  ? -1
                  : 0
              );

            await playerModel.findByIdAndUpdate(it._id, {
              totalWinnings: newTotalWin,
              historyEvent: newEventjoin,
            });
          });
        }
      }

      return res
        .status(200)
        .json({ message: "update list prize event success", data: eventNew });
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
      if (event) {
        // tìm event người chơi đã tham gia

        let player = await playerModel.find({ "historyEvent._id": id });

        player.forEach(async (it, index) => {
          // xóa event trong lịch xử tham gia
          let newlist = it.historyEvent.filter((ite) => {
            return ite.id !== id;
          });
          // lọc event để xóa
          let valueDelete = it.historyEvent.find((ite) => ite.id === id);
          // cập nhật vpoint
          let prizepool = valueDelete.entries * valueDelete.buyin;
          if (valueDelete.entries >= 50 && prizepool >= 1000 * M) {
            let pointDiscount = calCulatorVpoy(
              valueDelete.place,
              valueDelete.entries,
              valueDelete.buyin
            );
            let vpointUpdate = it.vpoyPoint - pointDiscount;

            // cập nhật giải thưởng
            let prizeUpdate = it.totalWinnings - valueDelete.prize;
            let idUpdate = it._id;
            const updatePl = await playerModel.findByIdAndUpdate(idUpdate, {
              historyEvent: newlist,
              totalWinnings: prizeUpdate,
              vpoyPoint: vpointUpdate,
            });
          } else {
            // cập nhật giải thưởng
            let prizeUpdate = it.totalWinnings - valueDelete.prize;
            // let vpointUpdate = it.vpoyPoint - valueDelete
            let idUpdate = it._id;
            const updatePl = await playerModel.findByIdAndUpdate(idUpdate, {
              historyEvent: newlist,
              totalWinnings: prizeUpdate,
            });
          }
        });
        return res.status(200).json({ message: "Deleted Success" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: "Failed", error: err });
    });
};
