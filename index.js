import { Telegraf } from "telegraf";
import Bottleneck from "bottleneck";


import binance from "./binance.js";
import bybit from "./bybit.js";
import bitget from "./bitget.js";
import mexc from "./mexc.js";


const TOKEN ="6152531179:AAG6s-Yn_5eJGfQHJHKe9upS65uK_8u-Nd4"
// const url = `https://api.telegram.org/bot${token}/setWebhook?url=${NGORK_URL}/webhook/${token}`;

const bot = new Telegraf(TOKEN);

// Start webhook via launch method (preferred)
bot.launch({
  webhook: {
    domain: "65.2.10.183",
    port: 3030,
  },
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

// Set up rate limiter
const limiter = new Bottleneck({
  maxConcurrent: 1,
  minTime: 1000 / 30, // 30 messages per second
});

// Use the rate limiter as a middleware
bot.use(async (ctx, next) => {
  return limiter.schedule(() => next());
});

const channelId = "@arbiByte";


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

const main = async () => {
  
  try {
    const contain = [];

    contain.push(await binance());
    contain.push(await bybit());
    contain.push(await bitget());
    contain.push(await mexc());

    for (let i = 0; i < arr.length; i++) {
      
      const data = await priceDifference(contain, i);
      
      if(data.perDiff < 0.2) continue;

      bot.telegram.sendMessage(
        channelId,
        `
🚀📊 *Arbitrage Opportunity* 📊🚀

💹 *% Difference:* ${data.perDiff}% 💹

🔝 *Max:*
🌐 *Platform:* ${data.max.plat}
💰 *Value:* ${data.max.value.toFixed(4)} ${data.coinSymbol.replace(
          "USDT",
          ""
        )} 💰

🔻 *Min:*
🌐 *Platform:* ${data.min.plat}
💰 *Value:* ${data.min.value.toFixed(4)} ${data.coinSymbol.replace(
          "USDT",
          ""
        )} 💰

💥 _Seize the opportunity now!_ 💥
`,
        { parse_mode: "Markdown" }
      );
    }
  } catch (e) {
    console.log("error : ", e);
  }
      
};

const priceDifference = async (contain,k) => {

  const platPrice = [];
  const coin = arr[k];


  for(let i=0;i<contain.length;i++){

    for (let j = 0; j < contain[i].data.length; j++) {
      if (contain[i].data[j].coin === coin)
        platPrice.push({
          base: contain[i].platform,
          coinPrice: contain[i].data[j].price,
        });
    }

    
    
  }
  

  const prc = platPrice.map(val=> {return val.coinPrice})

  const min = Math.min(...prc);
  const minIndex = prc.indexOf(min);

  const max = Math.max(...prc);
  const maxIndex = prc.indexOf(max);

  const percent =  ((max - min)/min*100).toFixed(5);

  const obj = {
    perDiff: percent,
    coinSymbol: coin,
    min: {
      plat: platPrice[minIndex].base,
      value: min,
    },
    max: {
      plat: platPrice[maxIndex].base,
      value: max,
    },
  };

  return obj;

};


const auto = async()=>{
  while(true){
    await main();
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait for 2 seconds before starting the next iteration
  }
}


auto();
