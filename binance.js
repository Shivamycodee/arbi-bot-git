import fetch from "node-fetch";

const arr = [
  "DOGEUSDT",
  "ADAUSDT",
  "MATICUSDT",
  "TRXUSDT",
  "XLMUSDT",
  "VETUSDT",
  "ALGOUSDT",
  "ARBUSDT",
  "SXPUSDT",
];

const str = JSON.stringify(arr);

const Binance = async () => {
  const dataStream = await fetch(
    `https://api.binance.com/api/v3/ticker/price?symbols=${encodeURIComponent(
      str
    )}`
  )
    .then((res) => res.json()) // Convert the response to JSON
    .then((data) => {
      return data;
    })
    .catch((error) => console.error(`binance is : ` + error));

  const floatPrice = dataStream.map((val) => {
    return {
      coin: val.symbol,
      price: parseFloat(val.price),
    };
  });

  const obj = {
    platform: "BINANCE",
    data: floatPrice,
  };
  return obj;
};

Binance();

export default Binance;
