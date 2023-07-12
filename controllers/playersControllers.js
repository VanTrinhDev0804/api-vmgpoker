const Player = require("../models/playerModel");

// Create Player on table xếp hạng
module.exports.CreatePlayers = async (req, res, next) => {
  try {
    const { data } = req.body;
    console.log(data);
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
  const { data } = req.body;
  let player = await Player.findOne({ playerName: data.playerName });
  const playerUpdate = await Player.findOneAndUpdate(player.id, {
    playerName: data.playerName,
    avatarImage: data.avatarImage,
    totalWinnings: data.totalWinnings,
    vpoyPoint: data.vpoyPoint,
    country: data.country,
    city: data.city,
  })
    .then(() => {
      return res.status(200).json({ playerUpdate });
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

module.exports.AddEventPlayersJoin = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { data } = req.body;

    const pl = await Player.findById(id);
    let checkEvent = pl.eventJoin.find((item)=>{
      return item.eventName === data.eventName
    })
      console.log(checkEvent)
    if (checkEvent) {
      return res
        .status(300)
        .json({ message: "Người chơi đã tham gia event này" });
    } else {
      let newListEvent = pl.eventJoin.concat(data);

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

      return res.status(200).json({ player });
    }
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
