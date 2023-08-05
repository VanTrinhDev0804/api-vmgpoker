const Tourement = require("./../models/TourementModel");
const EventModal = require("../models/eventModel");
const playerModel = require("../models/playerModel");
const PokerTour = require("../models/pokerTourModel");
const PokerRoom = require("../models/pokerRomModel");
const eventModel = require("../models/eventModel");

module.exports.createTourement = async (req, res, next) => {
  try {
    const { data } = req.body;
    await Tourement.create({
      ...data,
    })
      .then((tourement) => {
        if (tourement) {
          return res.status(200).json({
            message: "Create Tourement success",
            tourement: tourement,
          });
        }
      })
      .catch((err) => {
        return res.status(400).json({
          message: "Failed create tourement code 401",
          error: err,
        });
      });
  } catch (error) {
    next(err);
    return res.status(500).json({ message: "Internal Server" });
  }
};

module.exports.getAllTourement = async (req, res, next) => {
  try {
    const lstTourements = await Tourement.find().sort({
      dayStart: -1,
      dayEnd: -1,
    });
    const lstEvent = await EventModal.find();
    const lstPlayers = await playerModel.find();
    const lstPKTour = await PokerTour.find();
    const lstPKRoom = await PokerRoom.find();


    let dataTourement = lstTourements.reduce((it, curr, i) => {
      // lọc poker room và poker tour
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
      // lọc event thuộc giải đấu
      let evOfTourement = lstEvent.filter((el) => {
        if (el.tourementID !== undefined) {
          return el.tourementID.toString() === curr._id.toString();
        }
      });

      // formart event
      const lstEventsFormat = evOfTourement.reduce((el, currTour, i) => {
        let formaterLstPrize = currTour.resultsPrize.reduce(
          (initalPl, currPl) => {
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
          },
          []
        );

        let it = {
          ...currTour.toObject(),
          resultsPrize: formaterLstPrize,
        };

        return el.concat({ ...it });
      }, []);
      const ev = { ...curr.toObject(), pokerRoom , pokerTour, Schedule: lstEventsFormat };
      return it.concat({ ...ev });
    }, []);

    return res.status(200).json({ status: true, data: dataTourement });
  } catch (error) {
    next(error);
    return res.status(500).json({ error });
  }
};
module.exports.getTourementById = async (req, res, next) => {
  // request query
  const { id } = req.params;
  const lstPKTour = await PokerTour.find();
  const lstPKRoom = await PokerRoom.find();
  const lstPlayers = await playerModel.find();
  const lstEvent = await eventModel.find()



  let tourement = await Tourement.findById(id)
    .then((tourement) => {
      if (tourement) {
        let pokerRoom = lstPKRoom.find((ite) => {
          if (tourement.pokerRoomId !== undefined) {
            return ite.id === tourement.pokerRoomId.toString();
          }
        });
        let pokerTour = lstPKTour.find((ite) => {
          if (tourement.pokerTourId !== undefined) {
            return ite.id === tourement.pokerTourId.toString();
          }
        });
        let evOfTourement = lstEvent.filter((el) => {
          if (el.tourementID !== undefined) {
            return el.tourementID.toString() === tourement._id.toString();
          }
        });

        const lstEventsFormat = evOfTourement.reduce((el, currTour, i) => {
          let formaterLstPrize = currTour.resultsPrize.reduce(
            (initalPl, currPl) => {
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
            },
            []
          );
  
          let it = {
            ...currTour.toObject(),
            resultsPrize: formaterLstPrize,
          };
  
          return el.concat({ ...it });
        }, []);

      
        const dataTourement = {
          ...tourement.toObject(),
          pokerRoom,
          pokerTour,
          Schedule : lstEventsFormat
        };
 

        return res.status(200).json({ tourement: dataTourement });
      } else {
        return res.status(400).json({ message: "Not Found!! " });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: "Failed", error: err });
    });
};

module.exports.deleteTourementByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Tourement.findByIdAndDelete(id)
      .then(async (tourement) => {
        if (tourement) {
          let lstEventDelete = await EventModal.find({
            tourementID: tourement.id,
          });

          lstEventDelete.forEach(async (el) => {
            await EventModal.findByIdAndDelete(el._id);
            // tìm event người chơi đã tham gia
            let player = await playerModel.find({
              "historyEvent._id": el._id,
            });

            player.forEach(async (it, index) => {
              // xóa event trong lịch xử tham gia
              let newlist = it.historyEvent.filter((ite) => ite.id !== el.id);

              let valueDelete = it.historyEvent.find((ite) => ite.id === el.id);
              // cập nhật giải thưởng
              let prizeUpdate = it.totalWinnings - valueDelete.prize;

              await playerModel.findByIdAndUpdate(it._id, {
                historyEvent: newlist,
                totalWinnings: prizeUpdate,
              });
            });
          });

          return res
            .status(200)
            .json({ message: "Deleted Tourement Successfully" });
        } else {
          return res.status(400).json({ message: "Failed Deleted Tourement" });
        }
      })
      .catch((err) => {
        return res.status(400).json({ message: "Having Error", error: err });
      });
  } catch (error) {
    next(error);
    return res.status(500).json({ error });
  }
};
module.exports.updateInfoTourement = async (req, res, next) => {
  const { id } = req.params;
  const { data } = req.body;

  const updateInfo = await Tourement.findByIdAndUpdate(id, {
    
    nameTour: data.nameTour,
    dayStart: data.dayStart,
    dayEnd: data.dayEnd,
    image: data.image,
    pokerTourId: data.pokerTourId,
    pokerRoomId:data.pokerRoomId,
    venueTour: data.venueTour
  })
    .then(async (tourement) => {
      if (tourement) {   
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


