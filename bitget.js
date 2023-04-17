import fetch from "node-fetch";

const arr = [
  "MATICUSDT_SPBL",
  "DOGEUSDT_SPBL",
  "ADAUSDT_SPBL",
  "TRXUSDT_SPBL",
  "ARBUSDT_SPBL",
  "SXPUSDT_SPBL",
];

const BitGet = async () => {
  const priceArr = [];

  for (let i = 0; i < arr.length; i++) {
    const dataStream = await fetch(
      `https://api.bitget.com/api/spot/v1/market/ticker?symbol=${arr[i]}`
    )
      .then((res) => res.json())
      .then((data) => {
        return data;
      });
    try {
      const buy = parseFloat(dataStream.data.buyOne);
      const sell = parseFloat(dataStream.data.sellOne);
      const avgPrice = (buy + sell) / 2;

      priceArr.push({
        coin: arr[i].split("_")[0],
        price: parseFloat(avgPrice),
      });
    } catch (e) {
      console.log("⚠️ ", e);
      console.log(dataStream);
    }
  }

  const obj = {
    platform: "BITGET",
    data: priceArr,
  };
  return obj;
};

BitGet();

export default BitGet;
