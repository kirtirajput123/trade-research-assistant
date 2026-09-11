import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Check,
  TrendingDown,
  FlaskConical,
  Brain,
  Database,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import "./App.css";

function App() {
  const [step, setStep] = useState("ask");

  const [question, setQuestion] = useState("");
  const [experiment, setExperiment] = useState(null);

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  const [fallThreshold, setFallThreshold] = useState("");
  const [holdingPeriod, setHoldingPeriod] = useState("");
  const [testPeriod, setTestPeriod] = useState("");

  const [result, setResult] = useState(null);
  const [testError, setTestError] = useState("");

  const examples = [
    "Does buying NIFTY after a 2% fall work better during high-volatility periods?",
    "Does buying NIFTY after a sharp fall generate positive returns?",
    "Does momentum work better during high-volatility periods?",
  ];

  const handleAnalyze = async () => {
    if (!question.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question: question,
          }),
        }
      );

      const data = await response.json();

      if (data.experiment) {
        setExperiment(data.experiment);
        setStep("understand");
      }
    } catch (error) {
      console.error("Analyze Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToClarify = () => {
    setStep("clarify");
  };

  const handleDefine = () => {
    if (!experiment) return;

    const updatedExperiment = {
      ...experiment,

      holdingPeriod: holdingPeriod
        ? Number(holdingPeriod)
        : experiment.holdingPeriod,

      entryCondition:
        fallThreshold
          ? `${experiment.instrument || "Asset"} falls >= ${fallThreshold}%`
          : experiment.entryCondition,

      testPeriod:
        testPeriod || experiment.testPeriod,

      exitCondition: holdingPeriod
        ? `After ${holdingPeriod} trading days`
        : experiment.exitCondition,

      missingInformation:
        experiment.missingInformation.filter((item) => {
          if (item === "fallThreshold" && fallThreshold) {
            return false;
          }

          if (item === "holdingPeriod" && holdingPeriod) {
            return false;
          }

          if (item === "testPeriod" && testPeriod) {
            return false;
          }

          return true;
        }),
    };

    setExperiment(updatedExperiment);
    setStep("define");
  };

  const handleRunExperiment = async () => {
    if (!experiment) return;

    setTesting(true);
    setTestError("");
    setStep("testing");

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1800)
      );

      const response = await fetch(
        "http://localhost:5000/api/test",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            experiment: experiment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            `Experiment failed with status ${response.status}`
        );
      }

      if (data.result) {
        setResult(data.result);
        setStep("result");
      } else {
        throw new Error("No result returned from server");
      }
    } catch (error) {
      console.error("Test Error:", error);
      setTestError(
        error.message ||
          "The experiment could not be completed."
      );
      setStep("define");
    } finally {
      setTesting(false);
    }
  };

  const handleNewExperiment = () => {
    setStep("ask");
    setQuestion("");
    setExperiment(null);
    setResult(null);
    setTestError("");
    setFallThreshold("");
    setHoldingPeriod("");
    setTestPeriod("");
  };

  const TopBar = ({ showBack = false }) => (
    <div className="top-bar">
      <div className="brand">
        <div className="brand-icon">
          <Sparkles size={17} />
        </div>

        <span>TradeLens AI</span>
      </div>

      {showBack && (
        <button
          className="top-back"
          onClick={handleNewExperiment}
        >
          <ArrowLeft size={16} />
          New research
        </button>
      )}
    </div>
  );

  const StepIndicator = ({ current }) => {
    const steps = [
      ["ask", "Ask"],
      ["understand", "Understand"],
      ["clarify", "Clarify"],
      ["define", "Define"],
      ["testing", "Test"],
      ["result", "Learn"],
    ];

    const currentIndex = steps.findIndex(
      ([id]) => id === current
    );

    return (
      <div className="workflow">
        {steps.map(([id, label], index) => {
          const completed = index < currentIndex;
          const active = index === currentIndex;

          return (
            <div className="workflow-item" key={id}>
              <div
                className={`workflow-step ${
                  completed ? "completed" : ""
                } ${active ? "active" : ""}`}
              >
                {completed ? (
                  <Check size={13} />
                ) : (
                  index + 1
                )}
              </div>

              <span
                className={
                  active || completed ? "workflow-label active" : ""
                }
              >
                {label}
              </span>

              {index < steps.length - 1 && (
                <div
                  className={`workflow-line ${
                    completed ? "completed-line" : ""
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (step === "ask") {
    return (
      <div className="app-shell ask-screen">
        <TopBar />

        <main className="ask-container">
          <StepIndicator current="ask" />

          <div className="ask-hero">
            <div className="hero-badge">
              <Sparkles size={16} />
              AI Trading Research
            </div>

            <h1>
              Turn market questions into
              <span> testable experiments.</span>
            </h1>

            <p className="hero-description">
              Ask a market question in plain English. TradeLens AI
              turns your idea into a structured experiment, identifies
              what's missing, and helps you test it with data.
            </p>

            <div className="question-card">
              <div className="question-card-top">
                <div>
                  <span className="field-label">
                    YOUR RESEARCH QUESTION
                  </span>

                  <h3>
                    What do you want to investigate?
                  </h3>
                </div>

                <Brain size={21} />
              </div>

              <textarea
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                placeholder="e.g. Does buying NIFTY after a 2% fall work better during high-volatility periods?"
              />

              <div className="question-footer">
                <span>
                  {question.length}/500
                </span>

                <button
                  className="primary-button"
                  onClick={handleAnalyze}
                  disabled={
                    !question.trim() || loading
                  }
                >
                  {loading
                    ? "Understanding..."
                    : "Analyze question"}

                  {!loading && (
                    <ArrowRight size={17} />
                  )}
                </button>
              </div>
            </div>

            <div className="example-section">
              <span>Try a research question</span>

              <div className="example-list">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      setQuestion(example)
                    }
                  >
                    <span>0{index + 1}</span>
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === "understand" && experiment) {
    return (
      <div className="app-shell">
        <TopBar showBack />

        <main className="research-container">
          <StepIndicator current="understand" />

          <div className="page-header">
            <div className="header-icon purple">
              <Brain size={23} />
            </div>

            <div>
              <span className="eyebrow">
                AI UNDERSTANDING
              </span>

              <h1>
                Here's what I understood.
              </h1>

              <p>
                I've translated your question into
                structured research parameters.
              </p>
            </div>
          </div>

          <div className="original-question">
            <span>Your original question</span>
            <p>"{question}"</p>
          </div>

          <section>
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  EXTRACTED PARAMETERS
                </span>

                <h2>What we know</h2>
              </div>

              <span className="status-pill">
                <Check size={14} />
                AI extracted
              </span>
            </div>

            <div className="parameter-grid">
              <Parameter
                label="Instrument"
                value={
                  experiment.instrument ||
                  "Not specified"
                }
              />

              <Parameter
                label="Timeframe"
                value={
                  experiment.timeframe ||
                  "Not specified"
                }
                assumption={
                  experiment.assumptions?.length > 0
                }
              />

              <Parameter
                label="Action"
                value={
                  experiment.entryAction ||
                  "Not specified"
                }
              />

              <Parameter
                label="Entry condition"
                value={
                  experiment.entryCondition ||
                  "Not specified"
                }
              />

              <Parameter
                label="Filter"
                value={
                  experiment.filters?.length
                    ? experiment.filters.join(", ")
                    : "None"
                }
              />

              <Parameter
                label="Hypothesis"
                value={
                  experiment.hypothesis ||
                  "Not specified"
                }
                large
              />
            </div>
          </section>

          {experiment.missingInformation?.length > 0 ? (
            <div className="missing-banner">
              <div className="missing-icon">
                <AlertCircle size={20} />
              </div>

              <div>
                <strong>
                  {experiment.missingInformation.length}{" "}
                  details still need to be defined
                </strong>

                <p>
                  I won't guess important parameters.
                  Let's define them before running the
                  experiment.
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={handleGoToClarify}
              >
                Fill missing details
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            <div className="ready-banner">
              <Check size={20} />

              <div>
                <strong>
                  Everything needed is defined.
                </strong>

                <p>
                  Your experiment is ready to be
                  reviewed and tested.
                </p>
              </div>

              <button
                className="secondary-button"
                onClick={() => setStep("define")}
              >
                Review experiment
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (step === "clarify" && experiment) {
    const missing =
      experiment.missingInformation || [];

    return (
      <div className="app-shell">
        <TopBar showBack />

        <main className="research-container">
          <StepIndicator current="clarify" />

          <div className="page-header">
            <div className="header-icon orange">
              <AlertCircle size={23} />
            </div>

            <div>
              <span className="eyebrow">
                CLARIFICATION
              </span>

              <h1>Let's fill in the gaps.</h1>

              <p>
                These details are required before we
                can run the experiment.
              </p>
            </div>
          </div>

          <div className="clarify-intro">
            <span>
              <Sparkles size={15} />
              Why are we asking?
            </span>

            <p>
              A backtest needs clear entry, exit and
              time boundaries. We ask instead of
              silently assuming important values.
            </p>
          </div>

          <div className="clarification-stack">
            {missing.includes("fallThreshold") && (
              <div className="clarification-card">
                <div className="clarification-title">
                  <div className="clarify-number">01</div>

                  <div>
                    <span className="eyebrow">ENTRY DEFINITION</span>
                    <h2>What should count as a sharp fall?</h2>
                    <p>
                      We need a clear threshold so "sharp fall" is not
                      interpreted differently across experiments.
                    </p>
                  </div>
                </div>

                <div className="choice-grid">
                  {["1", "2", "3", "5"].map((percent) => (
                    <button
                      key={percent}
                      className={
                        fallThreshold === percent
                          ? "choice selected"
                          : "choice"
                      }
                      onClick={() => setFallThreshold(percent)}
                    >
                      {fallThreshold === percent && <Check size={16} />}
                      <strong>{percent}%</strong>
                      <span>fall</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {missing.includes("holdingPeriod") && (
              <div className="clarification-card">
                <div className="clarification-title">
                  <div className="clarify-number">
                    02
                  </div>

                  <div>
                    <span className="eyebrow">
                      EXIT DEFINITION
                    </span>

                    <h2>
                      How long should we hold the
                      position?
                    </h2>

                    <p>
                      When should we measure the result
                      after entering the trade?
                    </p>
                  </div>
                </div>

                <div className="choice-grid">
                  {["1", "3", "5", "10"].map(
                    (days) => (
                      <button
                        key={days}
                        className={
                          holdingPeriod === days
                            ? "choice selected"
                            : "choice"
                        }
                        onClick={() =>
                          setHoldingPeriod(days)
                        }
                      >
                        {holdingPeriod === days && (
                          <Check size={16} />
                        )}

                        <strong>{days}</strong>

                        <span>
                          trading day
                          {days !== "1"
                            ? "s"
                            : ""}
                        </span>
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {missing.includes("testPeriod") && (
              <div className="clarification-card">
                <div className="clarification-title">
                  <div className="clarify-number">
                    03
                  </div>

                  <div>
                    <span className="eyebrow">
                      TEST WINDOW
                    </span>

                    <h2>
                      How much historical data
                      should we test?
                    </h2>

                    <p>
                      A longer period gives more
                      observations across different
                      market conditions.
                    </p>
                  </div>
                </div>

                <div className="choice-grid">
                  {[
                    "1 year",
                    "3 years",
                    "5 years",
                    "10 years",
                  ].map((period) => (
                    <button
                      key={period}
                      className={
                        testPeriod === period
                          ? "choice selected"
                          : "choice"
                      }
                      onClick={() =>
                        setTestPeriod(period)
                      }
                    >
                      {testPeriod === period && (
                        <Check size={16} />
                      )}

                      <strong>
                        {period.split(" ")[0]}
                      </strong>

                      <span>
                        {period.split(" ")[1]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bottom-action">
            <button
              className="primary-button large"
              disabled={
                (missing.includes("fallThreshold") &&
                  !fallThreshold) ||
                (missing.includes("holdingPeriod") &&
                  !holdingPeriod) ||
                (missing.includes("testPeriod") &&
                  !testPeriod)
              }
              onClick={handleDefine}
            >
              Define experiment
              <ArrowRight size={18} />
            </button>
          </div>
        </main>
      </div>
    );
  }
  if (step === "define" && experiment) {
    return (
      <div className="app-shell">
        <TopBar showBack />

        <main className="research-container">
          <StepIndicator current="define" />

          <div className="page-header">
            <div className="header-icon green">
              <FlaskConical size={23} />
            </div>

            <div>
              <span className="eyebrow">
                EXPERIMENT DEFINITION
              </span>

              <h1>
                Your experiment is fully defined.
              </h1>

              <p>
                Review exactly what will be tested
                before we run it.
              </p>
            </div>
          </div>

          <div className="definition-card">
            <div className="definition-top">
              <div>
                <span className="eyebrow">
                  EXPERIMENT
                </span>

                <h2>
                  {experiment.entryAction}{" "}
                  {experiment.instrument}
                </h2>
              </div>

              <div className="ready-pill">
                <Check size={14} />
                Ready to test
              </div>
            </div>

            <div className="definition-grid">
              <DefinitionItem
                label="Instrument"
                value={experiment.instrument}
              />

              <DefinitionItem
                label="Timeframe"
                value={experiment.timeframe}
              />

              <DefinitionItem
                label="Action"
                value={experiment.entryAction}
              />

              <DefinitionItem
                label="Entry condition"
                value={experiment.entryCondition}
              />

              <DefinitionItem
                label="Exit condition"
                value={
                  experiment.exitCondition ||
                  "Not specified"
                }
              />

              <DefinitionItem
                label="Holding period"
                value={
                  experiment.holdingPeriod
                    ? `${experiment.holdingPeriod} trading days`
                    : "Not specified"
                }
              />

              <DefinitionItem
                label="Test period"
                value={
                  experiment.testPeriod ||
                  "Not specified"
                }
              />

              <DefinitionItem
                label="Filter"
                value={
                  experiment.filters?.length
                    ? experiment.filters.join(", ")
                    : "None"
                }
              />
            </div>

            <div className="hypothesis-box">
              <div className="hypothesis-icon">
                <Sparkles size={18} />
              </div>

              <div>
                <span>HYPOTHESIS</span>

                <p>
                  {experiment.hypothesis ||
                    "No hypothesis defined."}
                </p>
              </div>
            </div>
          </div>

          <div className="definition-note">
            <Check size={17} />

            <span>
              We will test exactly these parameters —
              no hidden changes and no cherry-picking
              the best result.
            </span>
          </div>

          <div className="bottom-action">
            <button
              className="primary-button large"
              onClick={handleRunExperiment}
            >
              Run experiment
              <ArrowRight size={18} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (step === "testing") {
    return (
      <div className="app-shell testing-screen">
        <TopBar />

        <main className="testing-container">
          <div className="loader-ring">
            <div className="loader-inner">
              <FlaskConical size={28} />
            </div>
          </div>

          <span className="eyebrow">
            EXPERIMENT IN PROGRESS
          </span>

          <h1>
            Running your experiment<span>...</span>
          </h1>

          <p>
            We're applying your defined conditions
            to the available sample data.
          </p>

          <div className="testing-steps">
            <TestingStep
              icon={<Database size={17} />}
              text="Loading historical observations"
              active
            />

            <TestingStep
              icon={<TrendingDown size={17} />}
              text="Applying entry conditions"
              active
            />

            <TestingStep
              icon={<BarChart3 size={17} />}
              text="Calculating returns"
              active
            />

            <TestingStep
              icon={<Brain size={17} />}
              text="Preparing research findings"
              active
            />
          </div>
        </main>
      </div>
    );
  }


  if (step === "result" && experiment && result) {
    return (
      <div className="app-shell">
        <TopBar showBack />

        <main className="research-container result-container">
          <StepIndicator current="result" />

          <div className="page-header result-header">
            <div className="header-icon green">
              <BarChart3 size={23} />
            </div>

            <div>
              <span className="eyebrow">
                EXPERIMENT COMPLETE
              </span>

              <h1>
                Here's what the data shows.
              </h1>

              <p>
                The experiment was tested against
                sample historical market data.
              </p>
            </div>
          </div>

          <div className="data-source-card">
            <Database size={17} />

            <div>
              <strong>Data source</strong>

              <span>
                {result.dataSource}
              </span>
            </div>

            <span className="mock-badge">
              Prototype data
            </span>
          </div>

          <div className="tested-summary">
            <span>EXPERIMENT TESTED</span>

            <p>
              {experiment.entryAction}{" "}
              {experiment.instrument} when{" "}
              {experiment.entryCondition?.toLowerCase()}
              , then hold for{" "}
              {experiment.holdingPeriod} trading days
              {experiment.filters?.length
                ? ` during ${experiment.filters[0].toLowerCase()} periods`
                : ""}
              .
            </p>
          </div>

          <section>
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  PERFORMANCE
                </span>

                <h2>What happened?</h2>
              </div>
            </div>

            <div className="metrics-grid">
              <Metric
                label="Occurrences"
                value={
                  result.summary.totalOccurrences
                }
              />

              <Metric
                label="Winning trades"
                value={
                  result.summary.winningTrades
                }
                positive
              />

              <Metric
                label="Losing trades"
                value={
                  result.summary.losingTrades
                }
              />

              <Metric
                label="Win rate"
                value={`${result.summary.winRate}%`}
              />

              <Metric
                label="Average return"
                value={`${result.summary.averageReturn}%`}
                highlight
              />
            </div>
          </section>

          <section className="trade-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  OBSERVATIONS
                </span>

                <h2>Individual trade outcomes</h2>
              </div>
            </div>

            <div className="trade-table-wrapper">
              <table className="trade-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Entry price</th>
                    <th>Exit price</th>
                    <th>Return</th>
                  </tr>
                </thead>

                <tbody>
                  {result.trades.map((trade) => (
                    <tr key={trade.tradeNumber}>
                      <td>
                        {String(
                          trade.tradeNumber
                        ).padStart(2, "0")}
                      </td>

                      <td>
                        {trade.entryPrice.toLocaleString()}
                      </td>

                      <td>
                        {trade.exitPrice.toLocaleString()}
                      </td>

                      <td>
                        <span
                          className={
                            trade.returnPercent > 0
                              ? "return-positive"
                              : "return-negative"
                          }
                        >
                          {trade.returnPercent > 0
                            ? "+"
                            : ""}
                          {trade.returnPercent}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <div className="section-heading">
              <div>
                <span className="eyebrow">
                  LEARN
                </span>

                <h2>
                  What should we learn from this?
                </h2>
              </div>
            </div>

            <div className="learning-grid">
              <div className="learning-card data-learning">
                <div className="learning-card-icon">
                  <BarChart3 size={18} />
                </div>

                <span>WHAT THE DATA SHOWS</span>

                <p>
                  In this sample, the strategy
                  produced an average return of{" "}
                  <strong>
                    {result.summary.averageReturn}%
                  </strong>{" "}
                  across{" "}
                  <strong>
                    {result.summary.totalOccurrences}
                  </strong>{" "}
                  occurrences, with a win rate of{" "}
                  <strong>
                    {result.summary.winRate}%
                  </strong>
                  .
                </p>
              </div>

              <div className="learning-card limitation-learning">
                <div className="learning-card-icon">
                  <AlertCircle size={18} />
                </div>

                <span>WHAT IT DOES NOT PROVE</span>

                <p>
                  This does not prove the strategy
                  will perform the same way in future
                  markets. The prototype uses sample
                  data and does not fully model
                  transaction costs, slippage or
                  changing market conditions.
                </p>
              </div>
            </div>
          </section>

          <div className="next-research">
            <div className="next-research-icon">
              <FlaskConical size={20} />
            </div>

            <div>
              <span className="eyebrow">
                NEXT RESEARCH
              </span>

              <h3>
                Don't optimize for the best-looking
                result.
              </h3>

              <p>
                Change one parameter at a time and
                compare the evidence. That makes the
                next experiment more meaningful and
                helps reduce overfitting.
              </p>
            </div>

            <button
              className="secondary-button"
              onClick={handleNewExperiment}
            >
              New experiment
              <ArrowRight size={16} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  return null;
}


function Parameter({
  label,
  value,
  assumption,
  large,
}) {
  return (
    <div
      className={`parameter-card ${
        large ? "large-parameter" : ""
      }`}
    >
      <span>{label}</span>

      <strong>{value}</strong>

      {assumption && (
        <small>
          Assumption made by system
        </small>
      )}
    </div>
  );
}

function DefinitionItem({ label, value }) {
  return (
    <div className="definition-item">
      <span>{label}</span>
      <strong>{value || "Not specified"}</strong>
    </div>
  );
}

function Metric({
  label,
  value,
  positive,
  highlight,
}) {
  return (
    <div
      className={`metric-card ${
        highlight ? "metric-highlight" : ""
      }`}
    >
      <span>{label}</span>

      <strong
        className={
          positive ? "metric-positive" : ""
        }
      >
        {value}
      </strong>
    </div>
  );
}

function TestingStep({ icon, text }) {
  return (
    <div className="testing-step">
      <div className="testing-step-icon">
        {icon}
      </div>

      <span>{text}</span>

      <div className="testing-check">
        <Check size={13} />
      </div>
    </div>
  );
}

export default App;
