const Player = require("../models/playerModel");
const Event = require("../models/eventModel");
// Create Player on table xếp hạng
module.exports.createPlayers = async (req, res, next) => {
  try {
    const { data } = req.body;

    // Kiểm tra tên tuyển thủ đã có trên hệ thống
    let playerCheckName = await Player.findOne({
      playerName: `${data.playerName}`,
    });
    if (playerCheckName) {
      return res.status(400).json({ message: "Người chơi đã tồn tại" });
    } else {
      const player = await Player.create({ ...data }).then(async () => {
        // xếp hạng

        const players = await Player.find({ country: data.country }).sort({
          totalWinnings: -1,
        });
        // xếp hạng theo country
        players.forEach(async (item, i) => {
          const playersupdate = await Player.findByIdAndUpdate(item._id, {
            rankInCountry: i + 1,
          });
        });
        // xếp hạng theo city
        const playersCities = await Player.find({ city: data.city }).sort({
          totalWinnings: -1,
        });

        playersCities.forEach(async (item, i) => {
          const playersupdate = await Player.findByIdAndUpdate(item._id, {
            rankInCity: i + 1,
          });
        });
        return res.status(200).json({ message: "success", players });
      });
    }
  } catch (error) {
    next(error);
    return res.status(500).json({ error });
  }
};
// update players
module.exports.updatePlayer = async (req, res, next) => {
  const id = req.params.id;
  const { data } = req.body;
  const checkPlayer = await Player.findById(id)
  let totalWinChange = data.totalWinnings - checkPlayer.totalWinnings

  const playerUpdate = await Player.findByIdAndUpdate(id, {
    playerName: data.playerName,
    avatarImage: data.avatarImage,
    totalWinnings: data.totalWinnings,
    vpoyPoint: data.vpoyPoint,
    country: data.country,
    city: data.city,
  })
    .then(async (player) => {
      if(totalWinChange!==0){
        const players = await Player.find({ country: data.country }).sort({
          totalWinnings: -1,
        });
        
        // xếp hạng theo country
        players.forEach(async (item, i) => {
         
          const playersupdate = await Player.findByIdAndUpdate(item._id, {
            rankInCountry: i + 1,
          });
        });
        // xếp hạng theo city
        const playersCities = await Player.find({ city: data.city }).sort({
          totalWinnings: -1,
        });

        playersCities.forEach(async (item, i) => {
          const playersupdate = await Player.findByIdAndUpdate(item._id, {
            rankInCity: i + 1,
          });
        });
      }


      return res.status(200).json({message : "Update Successfully" });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};

// get Players from database
module.exports.getAllPlayers = async (req, res, next) => {
  try {
    // request query
    const q = req.query;

    if (q !== undefined) {
      const players = await Player.find(q).sort({ totalWinnings: -1 });

      return res.status(200).json({ players });
    } else {
      const players = await Player.find().sort({ totalWinnings: -1 });

      return res.status(200).json({ players });
    }
  } catch (error) {
    next(error);
    return res.status(500).json({ error });
  }
};

// players tham gia event
// Thêm event cho người chơi
module.exports.addEventPlayersJoin = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { data } = req.body;

    // kiểm tra người chơi đã tham gia event chưa ?
    const pl = await Player.findById(id);
    let checkEvent = pl.eventJoin.find((item) => {
      return item._id.toString() === data._id;
    });

    // id của event được lấy từ Data Event nên cần kiểm tra ngăn lỗi server bị đứng khi không thấy id
    let checkEventId = await Event.findById(data._id)
      .then(async (event) => {
        if (checkEvent) {
          return res
            .status(300)
            .json({ message: "Người chơi đã tham gia event này" });
        } else {
          let newListEvent = pl.eventJoin.concat({
            ...data,
            nameEvent: event.nameEvent,
          });

          let totalWin = pl.totalWinnings + data.prize;

          const player = await Player.findByIdAndUpdate(id, {
            totalWinnings: totalWin,
            eventJoin: newListEvent,
          }).then(async () => {
            const players = await Player.find({ country: pl.country }).sort({
              totalWinnings: -1,
            });
            // xếp hạng theo country
            players.forEach(async (item, i) => {
              const playersupdate = await Player.findByIdAndUpdate(item._id, {
                rankInCountry: i + 1,
              });
            });
            // xếp hạng theo city
            const playersCities = await Player.find({ city: pl.city }).sort({
              totalWinnings: -1,
            });

            playersCities.forEach(async (item, i) => {
              const playersupdate = await Player.findByIdAndUpdate(item._id, {
                rankInCity: i + 1,
              });
            });
          });

          return res.status(200).json({ message: "Successfully" });
        }
      })

      .catch((err) => {
        return res.status(500).json({
          message: "Sự kiện không tồn tại ! Kiểm tra lại!!",
          error: err,
        });
      });
  } catch (error) {
    next(error);
    return res.status(500).json({ error });
  }
};
// update thông tin các event
module.exports.updateEventPlayersJoin = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { data } = req.body;
    const pl = await Player.findById(id);

    let checkEventId = await Event.findById(data._id)
      .then(async (event) => {
        let index = pl.eventJoin.findIndex((item) => {
          return item._id.toString() === data._id;
        });
        if (index !== -1) {
          const prizeChange = data.prize - pl.eventJoin[index].prize;

          let valueParams = pl.eventJoin;
          valueParams[index] = data;

          // thay đổi tiền thưởng

          let totalWin = pl.totalWinnings + prizeChange;
          const player = await Player.findByIdAndUpdate(id, {
            totalWinnings: totalWin,
            eventJoin: valueParams,
          }).then(async () => {
            const players = await Player.find({ country: pl.country }).sort({
              totalWinnings: -1,
            });
            // xếp hạng theo country
            players.forEach(async (item, i) => {
              const playersupdate = await Player.findByIdAndUpdate(item._id, {
                rankInCountry: i + 1,
              });
            });
            // xếp hạng theo city
            const playersCities = await Player.find({ city: pl.city }).sort({
              totalWinnings: -1,
            });

            playersCities.forEach(async (item, i) => {
              const playersupdate = await Player.findByIdAndUpdate(item._id, {
                rankInCity: i + 1,
              });
            });
          });

          return res.status(200).json({ message: "Successfully" });
        } else {
          return res.status(400).json({
            message:
              "Người chơi chưa tham gia sự kiện !! Không thể chỉnh sửa!!",
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({
          message: "Lỗi không tìm thấy Event! Kiểm tra lại",
          error: err,
        });
      });
  } catch (error) {
    next(error);
    return res.status(500).json({ error });
  }
};
// tính toán xếp hạng theo quốc gia ( ob có dạng {country : "Viêt Nam" or ...})
// module.exports.autoUpdateTopCountry = async (ob)=>{

//     // players.forEach(async (item, i)=>{
//       //   if(Object.keys(q).toString() === "country"){
//       //    const playersupdate= await Player.findByIdAndUpdate(item._id, {rankInCountry : i+1})
//       //     console.log("success")
//       //   }
//       //   else if(Object.keys(q).toString() === "city"){
//       //     const playersupdate= await Player.findByIdAndUpdate(item._id, {rankInCity : i+1})
//       //   }
//       //   else{
//       //     console.log(Object.keys(q))
//       //   }

//       // })

// }

// code thử phần path
// get players by country and sort
// module.exports.getPlayersByCountry = async (req, res, next) => {
//   try {
//     const country = req.params.country;

//     console.log(req.query);
//     const playersCountry = await Player.find({ country: country }).sort({
//       totalWinnings: -1,
//     });

//     console.log(playersCountry);
//     return res.json({ status: true, playersCountry });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
// get players by city and sort
// module.exports.getPlayersByCity = async (req, res, next) => {
//   try {
//     const city = req.params.city;

//     console.log(req.params.city);
//     const PlayersByCity = await Player.find({ city: city }).sort({
//       totalWinnings: -1,
//     });

//     console.log(PlayersByCity);
//     return res.json({ status: true, PlayersByCity });
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// };
module.exports.deleteEventPlayerJoin = async (req, res, next) => {
  const id = req.params.id;
  const { data } = req.body;

  const pl = await Player.findById(id);
  let checkEventId = await Event.findById(data._id)
    .then(async (event) => {
    
      let index = pl.eventJoin.findIndex((item) => {
        return item._id.toString() === data._id;
      });
 
      if (index !== -1) {
        let totalWin = pl.totalWinnings - pl.eventJoin[index].prize;
        let valueParams = pl.eventJoin;
        valueParams.splice(index, 1);

        
        
        const player = await Player.findByIdAndUpdate(id, {
          totalWinnings: totalWin,
          eventJoin: valueParams,
        }).then(async () => {
          const players = await Player.find({ country: pl.country }).sort({
            totalWinnings: -1,
          });
          // xếp hạng theo country
          players.forEach(async (item, i) => {
            const playersupdate = await Player.findByIdAndUpdate(item._id, {
              rankInCountry: i + 1,
            });
          });
          // xếp hạng theo city
          const playersCities = await Player.find({ city: pl.city }).sort({
            totalWinnings: -1,
          });

          playersCities.forEach(async (item, i) => {
            const playersupdate = await Player.findByIdAndUpdate(item._id, {
              rankInCity: i + 1,
            });
          });
        });

        return res.status(200).json({ message: "Successfully" });
      }else {
        return res.status(400).json({
          message:
            "Người chơi chưa tham gia sự kiện !! Không thể chỉnh sửa!!",
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        message: "Không tìm thấy người chơi tham gia sự kiện",
        error: err,
      });
    });
};
