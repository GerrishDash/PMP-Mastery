bias.

#### 11.4.2.4 REPRESENTATIONS OF UNCERTAINTY

Quantitative risk analysis requires inputs to a quantitative risk analysis model that reflect individual project risks and other sources of uncertainty.

Where the duration, cost, or resource requirement for a planned activity is uncertain, the range of possible values can be represented in the model as a probability distribution. This may take several forms. The most commonly used are triangular, normal, lognormal, beta, uniform, or discrete distributions. Care should be taken when selecting an appropriate probability distribution to reflect the range of possible values for the planned activity.

Individual project risks may be covered by probability distributions. Alternatively, risks may be included in the model as probabilistic branches, where optional activities are added to the model to represent the time and/or cost impact of the risk should it occur, and the chance that these activities actually occur in a particular simulation run matches the risk's probability. Branches are most useful for risks that might occur independently of any planned activity. Where risks are related, for example, with a common cause or a logical dependency, correlation is used in the model to indicate this relationship.

Other sources of uncertainty may also be represented using branches to describe alternative paths through the project.

#### 11.4.2.5 DATA ANALYSIS

Data analysis techniques that can be used during this process include but are not limited to:

- ◆ Simulation. Quantitative risk analysis uses a model that simulates the combined effects of individual project risks and other sources of uncertainty to evaluate their potential impact on achieving project objectives. Simulations are typically performed using a Monte Carlo analysis. When running a Monte Carlo analysis for cost risk, the simulation uses the project cost estimates. When running a Monte Carlo analysis for schedule risk, the schedule network diagram and duration estimates are used. An integrated quantitative cost-schedule risk analysis uses both inputs. The output is a quantitative risk analysis model.

Computer software is used to iterate the quantitative risk analysis model several thousand times. The input values (e.g., cost estimates, duration estimates, or occurrence of probabilistic branches) are chosen at random for each iteration. Outputs represent the range of possible outcomes for the project (e.g., project end date, project cost at completion). Typical outputs include a histogram presenting the number of iterations where a particular outcome resulted from the simulation, or a cumulative probability distribution (S-curve) representing the probability of

422