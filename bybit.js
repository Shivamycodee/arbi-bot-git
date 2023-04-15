
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




const ByBit = async () => {
 

    const priceArr = [];

for(let i=0;i<arr.length;i++){

  const dataStream = await fetch(
    `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${arr[i]}`
    )
    .then((res) => res.json()) 
    .then((data) => {
      return data;
    }) 
    priceArr.push({
      coin:arr[i],
      price:parseFloat(dataStream.result.list[0].markPrice)
    });
  }


 const obj = {
   platform: "BYBIT",
   data:priceArr,
 };
 return obj;
};

ByBit();

module.exports = ByBit;
