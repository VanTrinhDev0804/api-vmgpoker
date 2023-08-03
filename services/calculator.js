module.exports.calCulatorVpoy = (places, entries, buyIn) => {
  let point = 0;
  let hsEntries = 1;
  let hsBuyIn = 1;
  let M = 1000000;
  //   place =>point
  if (places < 10) {
    switch (places) {
      case 1:
        point = 120;
        break;
      case 2:
        point = 100;
        break;
      case 3:
        point = 80;
        break;
      case 4:
        point = 60;
        break;
      case 5:
        point = 50;
        break;
      case 6:
        point = 40;
        break;
      case 7:
        point = 30;
        break;
      case 8:
        point = 20;
        break;
      case 9:
        point = 10;
        break;
      default:
        point = 0;
        break;
    }
  } else if (places >= 10 && places <= 18) {
    point = 6;
  } else if (places >= 19 && places <= 27) {
    point = 4;
  }
  // xử lý hệ số entries

  if (entries >= 100 && entries < 200) {
    hsEntries = 1.5;
  } else if (entries >= 200 && entries < 300) {
    hsEntries = 2;
  } else if (entries >= 300 && entries < 500) {
    hsEntries = 3;
  } else if (entries >= 500 && entries <= 800) {
    hsEntries = 4;
  } else if (entries >= 800 && entries < 1000) {
    hsEntries = 5;
  } else if (entries >= 1000) {
    hsEntries = 6;
  }

  //   Xử lý buyin
  if (buyIn >= 3 * M && buyIn < 5 * M) {
    hsBuyIn = 1.5;
  } else if (buyIn >= 5 * M && buyIn < 10 * M) {
    hsBuyIn = 2;
  } else if (buyIn >= 10 * M && buyIn < 15 * M) {
    hsBuyIn = 2.5;
  } else if (buyIn >= 15 * M && buyIn < 30 * M) {
    hsBuyIn = 3;
  } else if (buyIn >= 30 * M && buyIn < 50 * M) {
    hsBuyIn = 4;
  } else if (buyIn >= 50 * M && buyIn < 100 * M) {
    hsBuyIn = 5;
  } else if (buyIn >= 100 * M) {
    hsBuyIn = 6;
  }



  return point * hsEntries * hsBuyIn;
};
