const Player = require("../models/playerModel");
const eventModel = require("../models/eventModel");
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
    country: data.country,
    city: data.city,
    linkInfo: data.linkInfo,
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
  const lstEvent = await eventModel.find();
  try {
    // request query
    const q = req.query;

    let typeSort = q.vpoyPoint ? { vpoyPoint: -1 } : { totalWinnings: -1 };

    if (q !== undefined && q.country !== undefined) {
      const playersort = await Player.find({ country: q.country }).sort(
        typeSort
      );
      const playerRank = playersort.reduce((player, currPl, i) => {
        let historyEventSort = currPl.historyEvent.reduce(
          (history, hsCurr, i2) => {
            let ev = lstEvent.find((ite) => {
              if (hsCurr._id !== undefined) {
                return ite.id === hsCurr._id.toString();
              }
            });
            if (ev) {
              let param = {
                ...hsCurr.toObject(),
                nameEvent: ev.nameEvent,
                dateEvent: ev.dateEvent,
                entries: ev.entries,
                buyin: ev.buyIn,
              };
              return history.concat({ ...param });
            } else {
              return history.concat({ ...hsCurr.toObject() });
            }
          },
          []
        );

        let it = {...currPl.toObject() , historyEvent : historyEventSort , rank : i+1}
      

        return player.concat({...it})

      }, []);


      return res.status(200).json({ players: playerRank });
    }
    // lọc theo thành phố
    else if (q !== undefined && q.city !== undefined) {
      const playersort = await Player.find({ city: q.city }).sort(typeSort);
      const playerRank = playersort.reduce((player, currPl, i) => {
        let historyEventSort = currPl.historyEvent.reduce(
          (history, hsCurr, i2) => {
            let ev = lstEvent.find((ite) => {
              if (hsCurr._id !== undefined) {
                return ite.id === hsCurr._id.toString();
              }
            });
            if (ev) {
              let param = {
                ...hsCurr.toObject(),
                nameEvent: ev.nameEvent,
                dateEvent: ev.dateEvent,
                entries: ev.entries,
                buyin: ev.buyIn,
              };
              return history.concat({ ...param });
            } else {
              return history.concat({ ...hsCurr.toObject() });
            }
          },
          []
        );

        let it = {
          ...currPl.toObject(),
          historyEvent: historyEventSort,
          rank: i + 1,
        };

        return player.concat({ ...it });
      }, []);

      return res.status(200).json({ players: playerRank });
    }
    // lọc khi không có params
    else {
      const playersort = await Player.find().sort(typeSort);

      const playerRank = playersort.reduce((player, currPl, i) => {
        let historyEventSort = currPl.historyEvent.reduce(
          (history, hsCurr, i2) => {
            let ev = lstEvent.find((ite) => {
              if (hsCurr._id !== undefined) {
                return ite.id === hsCurr._id.toString();
              }
            });
            if (ev) {
              let param = {
                ...hsCurr.toObject(),
                nameEvent: ev.nameEvent,
                dateEvent: ev.dateEvent,
                entries: ev.entries,
                buyin: ev.buyIn,
              };
              return history.concat({ ...param });
            } else {
              return history.concat({ ...hsCurr.toObject() });
            }
          },
          []
        );

        let it = {
          ...currPl.toObject(),
          historyEvent: historyEventSort,
          rank: i + 1,
        };

        return player.concat({ ...it });
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
  const { id } = req.params;
  const lstEvent = await eventModel.find();
  let player = await Player.findById(id)
    .then((player) => {
      if (player) {
        let historyEventSort = player.historyEvent.reduce((el, curr, i) => {
          let ev = lstEvent.find((ite) => {
            if (curr._id !== undefined) {
              return ite.id === curr._id.toString();
            }
          });
          let param = {
            ...curr.toObject(),
            nameEvent: ev.nameEvent,
            dateEvent: ev.dateEvent,
            entries: ev.entries,
            buyin: ev.buyIn,
          };
          return el.concat({ ...param });
        }, []);

        let data = { ...player.toObject(), historyEvent: historyEventSort };

        return res.status(200).json({ player: data });
      } else {
        return res.status(400).json({ message: "Not Found!! " });
      }
    })
    .catch((err) => {
      return res.status(400).json({ message: "Failed", error: err });
    });
};
