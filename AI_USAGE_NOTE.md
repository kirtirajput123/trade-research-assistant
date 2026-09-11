# AI Usage Note — TradeLens AI

I used AI tools during the development of TradeLens AI as a development and problem-solving assistant. I used them mainly to discuss ideas, understand technical concepts, debug issues, improve the interface, and review parts of the implementation.

The AI was used as a support tool rather than as a replacement for my own decisions and implementation.

### How I Used AI

I used ChatGPT during different stages of the project for:

* Discussing the assignment requirements and breaking the problem into smaller parts.
* Understanding how a natural-language trading question could be converted into a structured experiment.
* Thinking through which parameters should be required before an experiment can be tested.
* Discussing how to handle ambiguous terms such as sharp fall.
* Getting suggestions for the application flow and UI structure.
* Debugging React and Node.js issues.
* Reviewing frontend and backend logic.
* Understanding how to separate natural-language processing from deterministic backtesting calculations.
* Improving the clarity of the result and learning sections.

### What I Personally Designed

I personally worked on the overall product direction and decided how the application should behave.

The main product decisions included:

* Using the ASK → UNDERSTAND → CLARIFY → DEFINE → TEST → LEARN flow.
* Asking the user for missing information instead of silently guessing important parameters.
* Treating sharp fall as an ambiguous condition that needs clarification.
* Showing the final experiment definition before running the test.
* Separating what the data shows from what the result actually proves.
* Avoiding automatic parameter optimization and cherry-picking the best result.
* Keeping the prototype focused on the research workflow instead of adding unnecessary production features.

### What I Personally Implemented

I implemented and worked on the React frontend and Node.js backend.

On the frontend, I worked on:

* The multi-step research workflow.
* Question input and example questions.
* Experiment understanding screen.
* Missing-information flow.
* Clarification options.
* Experiment definition screen.
* Testing/loading screen.
* Result screen.
* Trade results table.
* Evidence and learning sections.
* Responsive styling and visual interface.

On the backend, I worked on:

* The Express server.
* API endpoints for analyzing questions and running experiments.
* Experiment parameter extraction.
* Missing-information detection.
* Mock/sample market data.
* Backtesting logic.
* Return calculations.
* Win-rate and average-return calculations.
* Returning experiment results to the frontend.

### Debugging and Problem Solving

One important issue I encountered was with ambiguous questions containing the phrase sharp fall.

The backend correctly identified that the fall threshold was missing, but the frontend clarification screen initially handled only the holding period and test period.

Because of this mismatch, the backend rejected the experiment when the frontend tried to run it, and the UI remained on the testing screen.

I traced the issue to the difference between the parameters detected by the backend and the parameters handled by the frontend.

I then updated the frontend to:

* Store the fall threshold.
* Ask the user to define what sharp fall means.
* Include the selected threshold in the experiment definition.
* Remove it from the missing-information list once answered.
* Prevent the experiment from running while required information is still missing.
* Handle API errors instead of leaving the testing screen stuck.

This was an important example of using AI to help debug the problem while understanding and applying the actual fix in the project.

### Use of AI-Generated Code

AI suggestions were used as a starting point in some parts of the implementation, particularly while debugging and structuring code.

I reviewed, modified, and integrated the code according to the requirements of the project.

I did not treat generated code as automatically correct. When something did not work, I tested it, identified the problem, and changed the implementation.

### What I Would Improve Without AI

If I continued developing the project, I would further strengthen the backtesting and data layer by connecting the application to reliable historical market data and adding realistic transaction costs, slippage, and more robust validation.

I would also improve the natural-language understanding layer so that more types of trading questions could be converted into structured experiments.

### Overall Use of AI

AI helped me work faster and explore technical solutions, but the product decisions, experiment workflow, implementation choices, debugging, testing, and final integration were part of my own development process.

The main goal was to use AI as a development partner while still understanding why the application works the way it does.
