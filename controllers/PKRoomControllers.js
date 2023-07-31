const PKRoom = require("./../models/pokerRomModel");

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
