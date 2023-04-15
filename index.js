const { Telegraf } = require("telegraf");

const binance = require("./binance");
const bybit = require("./bybit");
const bitget = require("./bitget");
const mexc = require("./mexc");


const TOKEN ="6152531179:AAG6s-Yn_5eJGfQHJHKe9upS65uK_8u-Nd4"
// const url = `https://api.telegram.org/bot${token}/setWebhook?url=${NGORK_URL}/webhook/${token}`;

const bot = new Telegraf(TOKEN);

// Start webhook via launch method (preferred)
bot.launch({
  webhook: {
    domain: "https://bb9f-123-253-12-214.ngrok.io",
    port: 3030,
  },
});

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

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
      
      if(data.perDiff < 0.1) continue;

      bot.telegram.sendMessage(
        channelId,
        `
🚀📊 *Arbitrage Opportunity* 📊🚀

💹 *% Difference:* ${data.perDiff}% 💹

🔝 *Max:*
🌐 *Platform:* ${data.max.plat}
💰 *Value:* ${data.max.value} ${data.coinSymbol.replace("USDT", "")} 💰

🔻 *Min:*
🌐 *Platform:* ${data.min.plat}
💰 *Value:* ${data.min.value} ${data.coinSymbol.replace("USDT", "")} 💰

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