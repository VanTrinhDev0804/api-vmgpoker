const Tourement = require("./../models/TourementModel");
const EventModal = require("../models/eventModel");
const playerModel = require("../models/playerModel");
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

    return res.status(200).json({ status: true, data: dataTourement});
  } catch (error) {
    
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
