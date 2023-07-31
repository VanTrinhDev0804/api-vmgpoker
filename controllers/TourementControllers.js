const Tourement = require("./../models/TourementModel");
const EventModal = require("../models/eventModel");
const Player = require("../models/playerModel")
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
      let listIDEvent  = []
      if (data && data.Shedule.length > 0) {
        data.Shedule.forEach(async (element) => {
          await EventModal.create({...element}).then((event =>{
            listIDEvent.concat(event.id)
            if(event.resultsPrize.length > 0)
            {
              let listPrize = event.resultsPrize.forEach(async (it, index) => {
                let player = await Player.findById(it._id);
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
    
                await Player.findByIdAndUpdate(it._id, {
                  totalWinnings: newTotalWin,
                  historyEvent: newEventjoin,
                });
              });
            }



          })).catch(err=>{
            return res.status(400).json({message: "Error when create Event" , error : err})
          })
        });


        // console.log(ev)


      }
    

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
    return res.status(200).json({ status: true, data: tourement });
  } catch (error) {
    console.log(error);
    next(error);
    return res.status(500).json({ error });
  }
};
