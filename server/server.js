const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


function analyzeQuestion(question) {
const text = question.toLowerCase();

let instrument = null;
let timeframe = "Daily";
let entryAction = null;
let entryCondition = null;
let exitCondition = null;
let holdingPeriod = null;
let testPeriod = null;

const filters = [];
const missingInformation = [];
const assumptions = [];


if (
text.includes("bank nifty") ||
text.includes("banknifty")
) {
instrument = "BANK NIFTY";
} else if (text.includes("nifty")) {
instrument = "NIFTY";
} else {
missingInformation.push("instrument");
}


if (
text.includes("weekly") ||
text.includes("week")
) {
timeframe = "Weekly";
} else if (
text.includes("daily") ||
text.includes("daily chart")
) {
timeframe = "Daily";
} else {
timeframe = "Daily";


assumptions.push(
  "Daily timeframe assumed because no timeframe was specified."
);


}


if (
text.includes("buying") ||
text.includes("buy")
) {
entryAction = "BUY";
} else if (
text.includes("selling") ||
text.includes("sell")
) {
entryAction = "SELL";
} else {
missingInformation.push("entryAction");
}


const percentageMatch = text.match(
/(\d+(?:.\d+)?)\s*%/
);

if (
percentageMatch &&
text.includes("fall")
) {
const percentage = percentageMatch[1];


entryCondition =
  `${instrument || "Asset"} falls >= ${percentage}%`;


} else if (
text.includes("sharp fall")
) {
entryCondition =
`${instrument || "Asset"} experiences a sharp fall`;


missingInformation.push("fallThreshold");


} else {
missingInformation.push("entryCondition");
}



if (
text.includes("high volatility") ||
text.includes("high-volatility")
) {
filters.push("High volatility");
}

if (
text.includes("low volatility") ||
text.includes("low-volatility")
) {
filters.push("Low volatility");
}



const holdingMatch = text.match(
/(?:hold|holding|after)\s*(?:for\s*)?(\d+)\s*(?:trading\s*)?days?/
);

if (holdingMatch) {
holdingPeriod = Number(holdingMatch[1]);


exitCondition =
  `After ${holdingPeriod} trading days`;


} else {
missingInformation.push("holdingPeriod");
}



const yearsMatch = text.match(
/(?:last|past|previous)\s*(\d+)\s*years?/
);

if (yearsMatch) {
testPeriod =
`${yearsMatch[1]} years`;
} else {
missingInformation.push("testPeriod");
}



let hypothesis = null;

if (
instrument &&
entryCondition
) {
const action =
entryAction === "SELL"
? "Selling"
: "Buying";


hypothesis =
  `${action} ${instrument} after a fall may generate positive returns`;

if (filters.length > 0) {
  hypothesis +=
    ` during ${filters[0].toLowerCase()} periods`;
}

if (holdingPeriod) {
  hypothesis +=
    ` over a ${holdingPeriod}-day holding period`;
}

hypothesis += ".";


}



return {
instrument,
timeframe,
entryAction,
entryCondition,
exitCondition,
holdingPeriod,
testPeriod,
filters,
hypothesis,
missingInformation: [
...new Set(missingInformation)
],
assumptions
};
}



app.get("/", (req, res) => {
res.json({
message: "TradeLens AI server is running!"
});
});



app.post("/api/analyze", (req, res) => {

try {


const { question } = req.body;

if (
  !question ||
  !question.trim()
) {
  return res.status(400).json({
    error: "Question is required"
  });
}

const experiment =
  analyzeQuestion(question);

res.json({
  mode: "mock",
  experiment
});


} catch (error) {


console.error(
  "Analysis Error:",
  error
);

res.status(500).json({
  error: "Failed to analyze the question"
});


}

});



const marketData = [

{
date: "2022-01-18",
fallPercent: 2.4,
volatility: "High",
entryPrice: 18000,
exitPrices: {
1: 18120,
3: 18450,
5: 18620
}
},

{
date: "2022-03-07",
fallPercent: 3.1,
volatility: "High",
entryPrice: 16750,
exitPrices: {
1: 16620,
3: 16980,
5: 17240
}
},

{
date: "2022-05-09",
fallPercent: 2.2,
volatility: "High",
entryPrice: 16200,
exitPrices: {
1: 16310,
3: 16080,
5: 16450
}
},

{
date: "2022-08-19",
fallPercent: 1.4,
volatility: "Normal",
entryPrice: 17600,
exitPrices: {
1: 17720,
3: 17900,
5: 18050
}
},

{
date: "2022-09-26",
fallPercent: 2.8,
volatility: "High",
entryPrice: 17050,
exitPrices: {
1: 16980,
3: 17420,
5: 17710
}
},

{
date: "2023-02-24",
fallPercent: 2.3,
volatility: "High",
entryPrice: 17500,
exitPrices: {
1: 17620,
3: 17880,
5: 17750
}
},

{
date: "2023-06-15",
fallPercent: 1.8,
volatility: "Normal",
entryPrice: 18750,
exitPrices: {
1: 18880,
3: 19020,
5: 19200
}
},

{
date: "2023-10-26",
fallPercent: 2.6,
volatility: "High",
entryPrice: 18900,
exitPrices: {
1: 18780,
3: 18550,
5: 19100
}
},

{
date: "2024-04-30",
fallPercent: 3.4,
volatility: "High",
entryPrice: 22200,
exitPrices: {
1: 22420,
3: 22800,
5: 23150
}
},

{
date: "2024-09-04",
fallPercent: 2.1,
volatility: "High",
entryPrice: 25100,
exitPrices: {
1: 24980,
3: 25450,
5: 25620
}
},

{
date: "2025-01-13",
fallPercent: 1.7,
volatility: "Normal",
entryPrice: 23200,
exitPrices: {
1: 23400,
3: 23580,
5: 23700
}
},

{
date: "2025-04-07",
fallPercent: 4.0,
volatility: "High",
entryPrice: 22100,
exitPrices: {
1: 21850,
3: 22600,
5: 22900
}
}

];


function getFallThreshold(experiment) {

if (!experiment.entryCondition) {
return null;
}

const match =
experiment.entryCondition.match(
/(\d+(?:.\d+)?)%/
);

if (!match) {
return null;
}

return Number(match[1]);
}



function runBacktest(experiment) {

const fallThreshold =
getFallThreshold(experiment);

const holdingPeriod =
Number(experiment.holdingPeriod) || 3;



const matchingData =
marketData.filter((item) => {


 
  if (
    fallThreshold !== null &&
    item.fallPercent < fallThreshold
  ) {
    return false;
  }


  
  if (
    experiment.filters &&
    experiment.filters.includes(
      "High volatility"
    )
  ) {

    if (item.volatility !== "High") {
      return false;
    }

  }


  
  if (
    experiment.filters &&
    experiment.filters.includes(
      "Low volatility"
    )
  ) {

    if (item.volatility !== "Low") {
      return false;
    }

  }


  return true;

});



let selectedHoldingPeriod =
holdingPeriod;

if (
selectedHoldingPeriod !== 1 &&
selectedHoldingPeriod !== 3 &&
selectedHoldingPeriod !== 5
) {


if (selectedHoldingPeriod < 2) {
  selectedHoldingPeriod = 1;
} else if (
  selectedHoldingPeriod < 4
) {
  selectedHoldingPeriod = 3;
} else {
  selectedHoldingPeriod = 5;
}


}



const trades =
matchingData.map(
(item, index) => {


    const exitPrice =
      item.exitPrices[
        selectedHoldingPeriod
      ];

    const returnPercent =
      (
        (exitPrice - item.entryPrice) /
        item.entryPrice
      ) * 100;


    return {

      tradeNumber: index + 1,

      date: item.date,

      fallPercent:
        item.fallPercent,

      volatility:
        item.volatility,

      entryPrice:
        item.entryPrice,

      exitPrice,

      holdingPeriod:
        selectedHoldingPeriod,

      returnPercent:
        Number(
          returnPercent.toFixed(2)
        )

    };

  }
);



if (trades.length === 0) {


return {

  dataSource:
    "Mock historical data",

  trades: [],

  summary: {

    totalOccurrences: 0,

    winningTrades: 0,

    losingTrades: 0,

    winRate: 0,

    averageReturn: 0,

    totalReturn: 0,

    bestTrade: null,

    worstTrade: null

  },

  note:
    "No simulated observations matched the defined experiment."

};


}


const winningTrades =
trades.filter(
(trade) =>
trade.returnPercent > 0
);

const losingTrades =
trades.filter(
(trade) =>
trade.returnPercent <= 0
);

const totalReturn =
trades.reduce(
(sum, trade) =>
sum + trade.returnPercent,
0
);

const averageReturn =
totalReturn / trades.length;

const winRate =
(
winningTrades.length /
trades.length
) * 100;

const bestTrade =
trades.reduce(
(best, trade) =>
trade.returnPercent >
best.returnPercent
? trade
: best,
trades[0]
);

const worstTrade =
trades.reduce(
(worst, trade) =>
trade.returnPercent <
worst.returnPercent
? trade
: worst,
trades[0]
);



return {


dataSource:
  "Mock historical data",

trades,

summary: {

  totalOccurrences:
    trades.length,

  winningTrades:
    winningTrades.length,

  losingTrades:
    losingTrades.length,

  winRate:
    Number(
      winRate.toFixed(1)
    ),

  averageReturn:
    Number(
      averageReturn.toFixed(2)
    ),

  totalReturn:
    Number(
      totalReturn.toFixed(2)
    ),

  bestTrade: {

    date:
      bestTrade.date,

    returnPercent:
      bestTrade.returnPercent

  },

  worstTrade: {

    date:
      worstTrade.date,

    returnPercent:
      worstTrade.returnPercent

  }

},

note:
  `The experiment matched ${trades.length} simulated observations using a ${selectedHoldingPeriod}-day holding period.`


};

}


app.post("/api/test", (req, res) => {

try {


const { experiment } =
  req.body;


if (!experiment) {

  return res.status(400).json({

    error:
      "Experiment is required"

  });

}


if (
  experiment.missingInformation &&
  experiment.missingInformation.length > 0
) {

  return res.status(400).json({

    error:
      "Experiment is not fully defined",

    missingInformation:
      experiment.missingInformation

  });

}


const result =
  runBacktest(experiment);


res.json({

  mode: "mock",

  experiment,

  result

});


} catch (error) {


console.error(
  "Backtest Error:",
  error
);

res.status(500).json({

  error:
    "Failed to run experiment"

});


}

});


const PORT = 5000;

app.listen(
PORT,
() => {

console.log(
  `TradeLens AI server running on http://localhost:${PORT}`
);


}
);
