const PKTour = require("../models/pokerTourModel");
const tourementModel = require("../models/TourementModel")
const eventModel = require("../models/eventModel");


module.exports.createPokerTour = async (req, res, next) => {
  try {
    const { data } = req.body;

    // Kiểm tra tên tuyển thủ đã có trên hệ thống
    let pkTourCheck = await PKTour.findOne({
      name: `${data.name}`,
    });
    if (pkTourCheck) {
      return res
        .status(400)
        .json({ message: "Đã tồn tại!! Vui lòng kiểm tra lại" });
    } else {
      const pkTour = await PKTour.create({
        ...data,
        createAt: Date.now(),
      }).then((pkTour) => {
        // xếp hạng

        return res.status(200).json({ message: "success", data: pkTour });
      });
    }
  } catch (error) {
    next(error);
    return res.status(500).json({ error });
  }
};

module.exports.getAllPokerTour = async (req, res, next) => {
  try {
    const pkTour = await PKTour.find();
    return res.status(200).json({ status: true, data: pkTour });
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(500).json({ error });
  }
};
module.exports.getPokerTourByID = async (req, res, next) => {
  // request query
  const { id } = req.params;

  let dataPokerTour = PKTour.findById(id)
    .then((pokerTour) => {
      if (pokerTour) {
        return res.status(200).json({ PokerTour: pokerTour });
      } else {
        return res.status(400).json({ message: "Not Found!! " });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: "Failed", error: err });
    });
};

module.exports.updateInfoPokerTour = async (req, res, next) => {
  const { id } = req.params;
  const { data } = req.body;

  const updateInfo = await PKTour.findByIdAndUpdate(id, {
    name: data.name,
    shortName: data.shortName,
    logo: data.logo,
    description: data.description
  })
    .then(async (pokerTour) => {
      if (pokerTour) {
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

module.exports.deletePokerTourByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    await PKTour.findByIdAndDelete(id)
      .then(async (pokerTour) => {
        if (pokerTour) {
          await eventModel.findOneAndUpdate({pokerTourId : pokerTour.id} , {pokerTourId :undefined })
          await tourementModel.findOneAndUpdate({pokerTourId : pokerTour.id} , {pokerTourId : undefined})


          return res  
            .status(200)
            .json({ message: "Deleted PokerTour Successfully" });
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