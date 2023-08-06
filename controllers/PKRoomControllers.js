const PKRoom = require("../models/pokerRomModel");
const tourementModel = require("../models/TourementModel");
const eventModel = require("../models/eventModel");

module.exports.createPokerRoom = async (req, res, next) => {
  try {
    const { data } = req.body;

    // Kiểm tra tên tuyển thủ đã có trên hệ thống
    let romCheck = await PKRoom.findOne({
      name: `${data.name}`,
    });
    if (romCheck) {
      return res
        .status(400)
        .json({ message: "Đã tồn tại!! Vui lòng kiểm tra lại" });
    } else {
      const pkRoom = await PKRoom.create({ ...data }).then((room) => {
        // xếp hạng

        return res.status(200).json({ message: "success", data: room });
      });
    }
  } catch (error) {
    next(error);
    return res.status(500).json({ error });
  }
};

module.exports.getAllPokerRoom = async (req, res, next) => {
  try {
    const room = await PKRoom.find();
    return res.status(200).json({ status: true, data: room });
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(500).json({ error });
  }
};

module.exports.getPokerRoomByID = async (req, res, next) => {
  // request query
  const { id } = req.params;

  let dataPokerTour = PKRoom.findById(id)
    .then((pokerRoom) => {
      if (pokerRoom) {
        return res.status(200).json({ PokerRom: pokerRoom });
      } else {
        return res.status(400).json({ message: "Not Found!! " });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: "Failed", error: err });
    });
};

module.exports.updateInfoPokerRoom = async (req, res, next) => {
  const { id } = req.params;
  const { data } = req.body;

  const updateInfo = await PKRoom.findByIdAndUpdate(id, {
    name: data.name,
    shortName: data.shortName,
    logo: data.logo,
    description: data.description,
    avatar : data.avatar,

    Adress: data.Adress,
  })
    .then((pokerRoom) => {
      if (pokerRoom) {
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

module.exports.deletePokerRoomByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    await PKRoom.findByIdAndDelete(id)
      .then(async (pokerRoom) => {
        if (pokerRoom) {
          await eventModel.findOneAndUpdate(
            { pokerRoomId: pokerRoom.id },
            { pokerRoomId: undefined }
          );
          await tourementModel.findOneAndUpdate(
            { pokerRoomId: pokerRoom.id },
            { pokerRoomId: undefined }
          );

          return res
            .status(200)
            .json({ message: "Deleted PokerRoom Successfully" });
        } else {
          return res.status(400).json({ message: "Failed Deleted PokerRoom" });
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
