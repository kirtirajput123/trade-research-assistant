# TradeLens AI

**Turn market questions into testable experiments.**

TradeLens AI is a research assistant prototype that helps users convert natural-language trading questions into structured experiments.

Instead of directly giving a prediction, the application first understands the question, identifies missing information, asks for clarification, defines the experiment, runs a test on sample market data, and then presents the evidence and limitations.

The main workflow is:

**ASK → UNDERSTAND → CLARIFY → DEFINE → TEST → LEARN**

## What the Project Does

A user can start with a question such as:

> Does buying NIFTY after a sharp fall work better during high-volatility periods?

The system identifies the information it can understand from the question and highlights what is still missing.

For example, it can identify:

* Instrument: NIFTY
* Action: BUY
* Entry condition: Fall of a selected percentage
* Filter: High volatility
* Holding period: Required from user
* Test period: Required from user

If the user uses an ambiguous term such as sharp fall, the application asks what percentage should be considered a sharp fall instead of silently choosing a value.

Once all required information is available, the user can review the final experiment before running it.

## Main Features

### Natural-Language Research Questions

Users can describe a market idea in normal language instead of filling out a complicated trading form.

### Experiment Understanding

The system extracts important information such as the instrument, entry action, entry condition, filters, and hypothesis.

### Focused Clarification

Only important missing parameters are requested from the user.

For example:

* Fall threshold
* Holding period
* Test period

### Transparent Experiment Definition

Before testing, the application shows the exact parameters that will be used.

This helps prevent hidden assumptions and makes the experiment easier to understand.

### Sample Backtesting

The prototype runs the defined experiment against simulated/sample market observations.

It calculates:

* Number of occurrences
* Winning trades
* Losing trades
* Win rate
* Average return

### Individual Trade Results

The result screen also shows individual entry and exit prices with their calculated returns.

### Evidence and Learning

The result is separated into:

**What the data shows**

The actual calculated evidence from the sample.

**What it does not prove**

The limitations and reasons why the result should not be treated as a guarantee of future performance.

### Next Research

The application suggests possible directions for further experiments while keeping the original experiment unchanged.

## Example Experiment

Suppose the user asks:

> Does buying NIFTY after a 2% fall work better during high-volatility periods?

After clarification, the experiment could be:

```text
Instrument: NIFTY
Timeframe: Daily
Action: BUY
Entry condition: NIFTY falls >= 2%
Filter: High volatility
Holding period: 3 trading days
Test period: 5 years
```

The system then tests the defined conditions against its sample observations.

An example result from the current prototype is:

```text
Occurrences: 9
Winning trades: 7
Losing trades: 2
Win rate: 77.8%
Average return: 1.33%
```

These numbers come from the prototype's sample data and should not be interpreted as real-market performance.

## How It Works

The application separates natural-language understanding from numerical experiment execution.

The overall architecture is:

```text
User Question
      ↓
Natural-Language Understanding
      ↓
Structured Experiment
      ↓
Missing Information?
      ↓
Clarification
      ↓
Experiment Definition
      ↓
Test Experiment
      ↓
Sample Market Data
      ↓
Deterministic Calculations
      ↓
Results
      ↓
Evidence + Learning
```

The natural-language layer is responsible for understanding the user's intent and structuring the experiment.

The application logic is responsible for the actual calculations. This keeps the numerical part predictable and reproducible.

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* Lucide React

### Backend

* Node.js
* Express.js
* CORS
* dotenv

### Data

The current prototype uses simulated/sample market observations stored and processed by the backend.

A production version could connect to a reliable historical market-data provider.

## Project Structure

```text
trade-research-assistant/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── ...
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── public/
│
├── README.md
├── THINKING_NOTE.md
├── package.json
└── ...
```

## Running the Project Locally

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd trade-research-assistant
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Start the frontend

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173
```

### 4. Install backend dependencies

Open another terminal:

```bash
cd server
npm install
```

### 5. Start the backend

```bash
node server.js
```

The backend will normally run at:

```text
http://localhost:5000
```

Make sure both the frontend and backend are running when using the complete application.

## Environment Variables

The backend can use environment variables through a `.env` file.

Example:

text
OPENAI_API_KEY=your_api_key_here

Do not commit your actual API key to GitHub.

The `.env` file should be included in `.gitignore`.

The application is designed so that the core prototype can still demonstrate the research workflow without depending on paid API usage.

## Backtest Logic

For a buy experiment, the basic return calculation is:

text
Return (%) = ((Exit Price - Entry Price) / Entry Price) × 100


The prototype identifies observations that satisfy the entry condition, applies the selected holding period, calculates individual returns, and then aggregates the results.

The current implementation is intentionally simple because the assignment focuses on research thinking and product design rather than building a production-grade trading engine.

## Important Limitations

This is a prototype and not a live trading system.

The current version uses simulated/sample market observations rather than a production historical market-data feed.

It does not fully model:

* Transaction costs
* Slippage
* Market impact
* Real-time market conditions
* Corporate actions
* Different market regimes
* Production-level data validation

The results therefore demonstrate the application workflow rather than provide investment advice or a reliable prediction of future market performance.

## Design Principles

The project follows a few important principles.

### Do not hide uncertainty

If an important parameter is missing, ask the user instead of silently guessing.

### Make the experiment visible

The user should know exactly what is being tested before the test runs.

### Do not cherry-pick results

The system should not automatically change parameters to produce a better-looking result.

### Separate evidence from conclusions

The application shows what the sample data actually produced and separately explains what those results do not prove.

### Keep experiments reproducible

The same experiment definition should lead to the same calculation logic instead of depending on an unpredictable response.

## Future Improvements

If this prototype were developed further, I would consider adding:

* Real historical market data
* More flexible experiment definitions
* Transaction cost and slippage modelling
* More volatility filters
* Multiple instruments and markets
* Experiment history
* Comparison between experiments
* User accounts and saved research
* More robust backtesting and validation
* Statistical significance and confidence analysis

These features were intentionally kept outside the current scope so that the core research workflow could remain simple and understandable.

## Assignment Focus

The project was built around the idea that a trading research assistant should not simply answer:

**Does this strategy work?**

Instead, it should help the user understand:

**What exactly are we testing?**

**What evidence did we get?**

**What does that evidence actually tell us?**

**What do we still not know?**

That is the main idea behind TradeLens AI.
