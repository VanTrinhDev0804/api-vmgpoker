const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const playerRouter = require("./routes/playersRoute");
const eventsRoute = require("./routes/eventsRoute")
// const messageRoutes = require("./routes/messages");
// const groupchat= require("./routes/groupchat")
const app = express();

require("dotenv").config();

app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/players", playerRouter);
app.use("/api/events" , eventsRoute)
// app.use("/api/messages", messageRoutes);
// app.use("/api/groupchat", groupchat);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);



