const Tourement = require("./../models/TourementModel");
const EventModal = require("../models/eventModel");
const playerModel = require("../models/playerModel");
module.exports.createTourement = async (req, res, next) => {
  try {
    const { data } = req.body;
    if (data.Schedule.length > 0) {
      data.Schedule.forEach(async (element) => {
        const checkEnvent = await EventModal.findOne({
          nameEvent: `${element.nameEvent}`,
        })
          .then(async (checkEnvent) => {
            if (checkEnvent) {
              return res
                .status(500)
                .json({ message: "Sự kiện đã tồn tại Code:18" });
            } else {
              const saveTourement = await Tourement.create({
                nameTour: data.nameTour,
                dayStart: data.dayStart,
                dayEnd: data.dayEnd,
                image: data.dayEnd,
                venueTour: data.venueTour,
                pokerTourId: data.pokerTourId,
                pokerRoomId: data.pokerRoomId,
              })
                .then((tourement) => {
                  if (tourement) {
                    // tạo event mới
                    if (data.Schedule.length > 0) {
                      data.Schedule.forEach(async (element) => {
                        const event = await EventModal.create({
                          ...element,
                          tourementID: tourement._id,
                        })
                          .then((event) => {
                            // update giải thưởng người chơi
                            if (event.resultsPrize.length > 0) {
                               event.resultsPrize.forEach(async (it, index) => {
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
                            }
                          })
                          .catch((err) => {
                            return res.status(400).json({
                              message: "Error when create Event",
                              error: err,
                            });
                          });
                      });
                    }

                    return res.status(200).json({
                      message: "Create Tourement success",
                      tourement,
                    });
                  }
                })
                .catch((err) => {
                  return res.status(400).json({
                    message: "Failed create tourement code 401",
                    error: err,
                  });
                });
            }
          })
          .catch((err) => {
            next(err);
          });
      });
    } else {
      await Tourement.create({
        nameTour: data.nameTour,
        dayStart: data.dayStart,
        dayEnd: data.dayEnd,
        image: data.dayEnd,
        venueTour: data.venueTour,
        pokerTourId: data.pokerTourId,
        pokerRoomId: data.pokerRoomId,
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
    }
  } catch (error) {
    next(error);
  }
  // console.log(data);
  // Kiểm tra tên event đã có trên hệ thống
};

module.exports.getAllTourement = async (req, res, next) => {
  try {
    const lstTourements = await Tourement.find();
    const lstEvent = await EventModal.find();
    let dataTourement = lstTourements.reduce((it, curr, i) => {
      // lọc event thuộc giải đấu
      let evOfTourement = lstEvent.filter((el) => {
        if (el.tourementID !== undefined) {
          return el.tourementID.toString() === curr._id.toString();
        }
      });

      const ev = { ...curr.toObject(), Schedule: evOfTourement };
      return it.concat({ ...ev });
    }, []);

    return res.status(200).json({ status: true, data: dataTourement });
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(500).json({ error });
  }
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
            console.log(player);
            player.forEach(async (it, index) => {
              // xóa event trong lịch xử tham gia
              let newlist = it.historyEvent.filter((ite) => ite.id !== el.id);
              console.log("newlist", newlist);
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
    console.log(error);
    next(error);
    return res.status(500).json({ error });
  }
};
