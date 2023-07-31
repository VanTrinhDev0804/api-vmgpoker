const PKTour = require("./../models/pokerTourModel");

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
      const pkTour = await PKTour.create({ ...data ,  createAt : Date.now()}).then((pkTour) => {
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
    return res.status(200).json({ status: true, data:  pkTour});
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(500).json({ error });
  }
};