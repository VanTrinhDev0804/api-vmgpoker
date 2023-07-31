const Tourement = require("./../models/TourementModel");

module.exports.createTourement = async (req, res, next) => {
  try {
    const { data } = req.body;

    // Kiểm tra tên tuyển thủ đã có trên hệ thống
    let TourementCheck = await Tourement.findOne({
      nameTour: `${data.nameTour}`,
    });
    if (TourementCheck) {
      return res
        .status(400)
        .json({ message: "Đã tồn tại!! Vui lòng kiểm tra lại" });
    } else {
      // if(data.Shedule)
      console.log(data.Shedule.length)
      // const tourement = await Tourement.create({ ...data ,  createAt : Date.now()}).then((tourement) => {
      //   // xếp hạng

      //   return res.status(200).json({ message: "success", data: tourement });
      // });
    }
  } catch (error) {
    next(error);
    return res.status(500).json({ error });
  }
};

module.exports.getAllTourement = async (req, res, next) => {
  try {
    const tourement = await Tourement.find();
    return res.status(200).json({ status: true, data:  tourement});
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(500).json({ error });
  }
};