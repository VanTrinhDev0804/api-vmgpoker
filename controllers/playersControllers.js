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
      const player = await Player.create({ ...data }).then((player) => {
        // xếp hạng

        return res.status(200).json({ message: "success", player });
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
  const checkPlayer = await Player.findById(id);

  const playerUpdate = await Player.findByIdAndUpdate(id, {
    playerName: data.playerName,
    avatarImage: data.avatarImage,
    // totalWinnings: data.totalWinnings,
    // vpoyPoint: data.vpoyPoint,
    country: data.country,
    city: data.city,
    linkInfo : data.linkInfo
  })
    .then((player) => {
      return res.status(200).json({ message: "Update Successfully" });
    })
    .catch((err) => {
      return res.status(400).json({ error: err });
    });
};

// get Players from database
// rank của các user tùy theo trường hợp 
module.exports.getAllPlayers = async (req, res, next) => {
  try {
    // request query
    const q = req.query;
    
    let typeSort = q.vpoyPoint ? { vpoyPoint: -1 } :{ totalWinnings: -1 }
    
    if (q !== undefined && q.country !==undefined) {
      const playersort = await Player.find({country : q.country}).sort(typeSort);
      const playerRank = playersort.reduce((players, curr, i) => {
        const value = curr.toObject();
        return players.concat({ ...value, rank: i + 1 });
      }, []);

      return res.status(200).json({ players: playerRank });
    }
    // lọc theo thành phố 
    else if (q !== undefined && q.city !==undefined) {
      const playersort = await Player.find({city : q.city}).sort(typeSort);
      const playerRank = playersort.reduce((players, curr, i) => {
        const value = curr.toObject();
        return players.concat({ ...value, rank: i + 1 });
      }, []);

      return res.status(200).json({ players: playerRank });
    }
    // lọc khi không có params
    else {
      const playersort = await Player.find().sort(typeSort);
      const playerRank = playersort.reduce((players, curr, i) => {
        const value = curr.toObject();
        return players.concat({ ...value, rank: i +1 });
      }, []);
      return res.status(200).json({ players: playerRank });
    }
  } catch (error) {
    next(error);
    return res.status(500).json({ error });
  }
};

module.exports.getPlayerById = async (req, res, next) => {
 
    // request query
    const {id} = req.params;
    let player = await Player.findById(id).then((player) =>{
      if(player){
        return res.status(200).json({player})
      }
      else{
        return res.status(400).json({message : "Not Found!! "})

      }
      
    }).catch(err =>{
      return res.status(400).json({message : "Failed" , error : err})
    })
};


