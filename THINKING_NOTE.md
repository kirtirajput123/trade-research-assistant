# Thinking Note — TradeLens AI

### Problem Understanding

The main idea of TradeLens AI is to take a market question written in normal language and turn it into a clear experiment that can actually be tested with data.

The overall flow is:

**Question → Hypothesis → Experiment → Evidence → Learning**

A user should not need to know complicated trading terminology just to start researching an idea. They can describe what they are thinking, and the system helps convert that idea into specific and understandable parameters.

For example, a user might ask:

Does buying NIFTY after a sharp fall work better during high-volatility periods?

At first, this looks like a complete question, but there are still some important details missing. What exactly counts as a sharp fall? How long should the position be held? And how much historical data should be considered?

Instead of making these decisions silently, TradeLens AI identifies the missing information and asks the user to clarify it.

### Understanding What “Sharp Fall” Means

The term sharp fall can mean different things to different people.

For one person, it could mean a 1% fall, while another person might consider a 3% or 5% fall to be sharp.

Because this directly changes the experiment, the system treats the fall percentage as an explicit parameter.

In the current prototype, the user can choose from options such as 1%, 2%, 3%, or 5%.

The system should not automatically choose the value that produces the best result. The selected value should come from the user's experiment.

### User-Provided Information, Assumptions and Missing Information

One important decision was to keep a clear difference between what the user actually said, what the system assumes, and what still needs to be provided.

For example, if the user asks:

Does buying NIFTY after a 2% fall work better during high-volatility periods?

The system can identify:

* Instrument: NIFTY
* Action: BUY
* Fall threshold: 2%
* Filter: High volatility

These values come directly from the user's question and should not be changed.

Some low-risk defaults can be used when needed. For example, the prototype can interpret the experiment using daily market observations. Important assumptions should still be visible rather than hidden.

If an important parameter is missing, the system should ask the user instead of guessing.

### Minimum Clarifying Questions

I wanted the clarification process to be short and focused rather than making the user fill out a long form.

For the example above, the system may need to ask:

What should count as a sharp fall?

1%, 2%, 3%, or 5%

How long should the position be held?

1, 3, 5, or 10 trading days

How much historical data should be tested?

1 year, 3 years, or 5 years

Only the information that is actually missing should be requested.

### Defining the Experiment

Once the missing details are provided, the system converts the question into a structured experiment.

The experiment contains information such as:

* Instrument
* Timeframe
* Entry action
* Entry condition
* Exit condition
* Holding period
* Test period
* Filters
* Hypothesis
* Missing information
* Assumptions

For example, after the user selects a 2% fall, a 3-day holding period, and a 5-year test period, the experiment can be represented as:

```json
{
  "instrument": "NIFTY",
  "timeframe": "Daily",
  "entryAction": "BUY",
  "entryCondition": "NIFTY falls >= 2%",
  "exitCondition": "After 3 trading days",
  "holdingPeriod": 3,
  "testPeriod": "5 years",
  "filters": ["High volatility"],
  "hypothesis": "Buying NIFTY after a 2% fall during high-volatility periods may generate positive returns.",
  "missingInformation": [],
  "assumptions": []
}
```

Showing this definition before running the experiment gives the user a chance to understand exactly what is being tested.

### How the Experiment Is Tested

After the experiment is defined, the prototype checks the available sample market observations.

The basic process is:

1. Check whether the market meets the selected fall threshold.
2. Check whether the high-volatility condition applies.
3. Record the entry price.
4. Look at the price after the selected holding period.
5. Calculate the return.
6. Combine the individual results into summary statistics.

The return is calculated using:

```text
Return (%) = ((Exit Price - Entry Price) / Entry Price) × 100
```

The prototype then shows metrics such as the number of occurrences, winning trades, losing trades, win rate, and average return.

### Why Testing Uses Deterministic Logic

I separated the natural-language part from the numerical testing part.

AI or natural-language processing is useful for understanding what the user is asking, identifying missing information, structuring the experiment, and explaining the results.

The actual calculations are better handled using normal application logic because they need to be predictable and reproducible.

For example, the application code is responsible for calculating returns and win rate rather than asking an AI model to calculate them.

This makes the testing process easier to understand and debug.

### Data Used in the Prototype

The current prototype uses simulated/sample market observations instead of a production-grade historical market data provider.

This was a deliberate scope decision for the assignment. The main goal was to demonstrate the complete research workflow rather than build a production-level trading backtesting system.

Because of this, the results shown by the application should be treated as prototype evidence and not as real trading recommendations.

The current prototype also does not fully account for things such as:

* Transaction costs
* Slippage
* Market impact
* Changing market conditions
* Data quality issues
* Corporate actions
* Real-time market conditions

These would be important additions in a production system.

### Risks I Considered

**Ambiguous language**

Terms such as sharp fall or high volatility can have different meanings.

The solution is to convert these terms into clear parameters before testing.

**Look-ahead bias**

A backtest can become unrealistic if information from the future is accidentally used when making a decision.

The experiment should only use information that would have been available at the time of the entry.

**Transaction costs**

A strategy may appear profitable before costs but become less attractive after brokerage and other expenses.

Transaction costs are therefore considered an important limitation and future improvement.

**Slippage**

The actual execution price can be different from the expected price.

The current prototype does not fully model this.

**Overfitting**

If parameters are repeatedly changed only to find the best historical result, the result may look better than it really is.

For this reason, TradeLens AI does not automatically optimize the parameters or select the best-looking result.

**Insufficient evidence**

A small number of observations may not be enough to make a strong conclusion.

The system therefore shows the number of occurrences and avoids presenting the result as a guarantee.

### What the System Should Do

TradeLens AI should:

* Preserve the user's original question.
* Identify the parameters that can be extracted.
* Detect important missing information.
* Ask focused clarification questions.
* Keep important assumptions visible.
* Show the final experiment before testing.
* Report the evidence produced by the experiment.
* Explain the limitations of the result.
* Help the user think about possible next experiments.

### What the System Should Not Do

The system should not:

* Silently invent important parameters.
* Change the user's experiment just to improve the result.
* Automatically select the best-performing configuration.
* Present simulated results as guaranteed future performance.
* Treat historical results as proof of future returns.

### Product Thinking

I wanted TradeLens AI to feel more like a research assistant than a stock prediction tool.

The user should be able to understand the complete journey from their question to the final result.

The application should make it clear:

**What did I ask?**

The original question remains visible.

**What did the system understand?**

The extracted experiment parameters are shown.

**What information was missing?**

The system asks only for the parameters that are necessary.

**What exactly will be tested?**

The final experiment definition is shown before the test starts.

**What did the data show?**

The application presents the calculated results and individual trade outcomes.

**What does the result actually mean?**

The system separates the observed data from the conclusion and clearly explains what the experiment does not prove.

This transparency is especially important in financial research because a number that looks precise can easily be misunderstood as a prediction or guarantee.

### Learning From the Results

The result screen separates the evidence from the interpretation.

For example, the prototype may show:

* 9 occurrences
* 7 winning trades
* 2 losing trades
* 77.8% win rate
* 1.33% average return

These numbers describe what happened in the sample used by the prototype.

They do not prove that the same result will happen in the future.

They also do not prove that the same result would remain after using real historical data, transaction costs, slippage, or different market conditions.

### What Could Be Tested Next

After one experiment is complete, the user can continue researching the idea.

Possible next experiments could include:

* Changing the fall threshold.
* Changing the holding period.
* Using a different definition of volatility.
* Testing another instrument.
* Comparing different time periods.

These should be treated as separate experiments rather than silently modifying the original one.

Changing one parameter at a time also makes it easier to understand why the result changed.

### Scope Decisions

For this assignment, I focused on the core research workflow instead of trying to build a full trading platform.

The prototype focuses on:

* Natural-language question handling
* Experiment structuring
* Clarification
* Deterministic testing
* Evidence presentation
* Research-oriented learning

I intentionally did not focus on:

* User authentication
* Complex database management
* Live market feeds
* Production-grade backtesting
* Portfolio management
* Automated trading

This kept the project focused on the main challenge: turning an unclear market question into a transparent and testable experiment.

### Final Design Principle

The main principle behind TradeLens AI is simple:

**Do not hide uncertainty. Turn uncertainty into something that can be clarified and tested.**

A useful trading research assistant should not just give the user an answer.

It should help the user move from:

I wonder if this works...

to:

Here is exactly what we tested, here is what the data showed, and here is what we still do not know.
