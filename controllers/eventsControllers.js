const EventModal = require("../models/eventModel");

module.exports.createEvent =async (req, res, next) => {
  try {
    const { data } = req.body;
    console.log(data);
    if (data) {
      let checkEnvent = await EventModal.findOne({ nameEvent: data.nameEvent });
      //              kiểm tra sự kiện porker đã tồn tại
      if (checkEnvent) {
        return res
          .status(300)
          .json({ message: "Poker event already exists on the system" });
      } else {
        // Lưu sự kiện vao database
        const enventValue = await EventModal.create({ ...data });
        return res
          .status(200)
          .json({ message: "create event success", data: enventValue });
      }
    } else {
      return res.status(400).json({ message: "Failed create" });
    }
  } catch (error) {
    next(error);
    return res.status(500).json({error});
  }
};



// load event porker

module.exports.getAllEventPorker = async (req, res, next) => {
  try {
    // request query
    const q = req.query;

    if (q !== undefined) {
    
      const eventPorkers = await EventModal.find(q).sort({ totalWinnings: -1 });

      return res.status(200).json({ status: true, eventPorkers });
    } else {
      const eventPorkers = await EventModal.find().sort({ totalWinnings: -1 });
      return res.status(200).json({ status: true, eventPorkers });
    }
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(500).json({error})
  }
};
