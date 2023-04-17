import fetch from "node-fetch";

const arr = [
  "MATICUSDT",
  "DOGEUSDT",
  "ADAUSDT",
  "TRXUSDT",
  "XLMUSDT",
  "VETUSDT",
  "ALGOUSDT",
  "ARBUSDT",
  "SXPUSDT",
];

const Mexc = async () => {
  const priceArr = [];

  for (let i = 0; i < arr.length; i++) {
    const dataStream = await fetch(
      `https://api.mexc.com//api/v3/avgPrice?symbol=${arr[i]}`
    )
      .then((res) => res.json()) // Convert the response to JSON
      .then((data) => {
        return data;
      });

    priceArr.push({
      coin: arr[i],
      price: parseFloat(dataStream.price),
    });
  }

  const obj = {
    platform: "MEXC",
    data: priceArr,
  };
  return obj;
};

Mexc();

export default Mexc;
