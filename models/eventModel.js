const mongoose = require("mongoose");

const eventShema = new mongoose.Schema({
  // tên sự kiện
  nameEvent: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  // hình ảnh event
  listImage: {
    type: Array,  
  },

  //  thông tin mô tả cho chự kiện 
  description: {
    type: String,
  },
  // quốc gia
  region: {
    type: String
  },
  //nơi tổ chức
  placeEvent : {
    type: String
  }, 
  // ngày tổ chức
  dateEvent: {
    type : String
  },
  // tổng người tham gia event
  entries : {
    type : Number
  },
  createAt : {
   type : Date
  }
});

module.exports = mongoose.model("Event" ,eventShema);