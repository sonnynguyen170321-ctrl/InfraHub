# Claude SWARM Framework Configuration

This rule defines the workflow template for executing multi-agent swarm operations inside the workspace.

## Swarm Lifecycle Phases

### 1. Scope
- Break the overall mission down into modular, right-sized subtasks.
- Ensure each subagent gets a clear role, explicit file boundaries (read/write limits), and quantifiable success criteria.
- Balance granularity: avoid too small tasks (excessive token and context overhead) and too large tasks (agent confusion/hallucination).

### 2. Wire
- Define explicit dependencies between task scopes to ensure sequential execution.
- Auto-block subagents when prerequisites are unfulfilled.
- Use a shared mailbox or context logs to enable real-time asynchronous coordination without direct file write conflicts.

### 3. Assign
- Mix model tiers strategically depending on task difficulty to optimize speed and resource usage:
  - **Claude 3 Opus:** Allocate as the team lead / planner agent.
  - **Claude 3.5 Sonnet:** Allocate as the core code builder agent.
  - **Claude 3 Haiku:** Allocate for unit testing, structural verification, and code validation.

### 4. Run
- Launch subagent tasks asynchronously and monitor their log directories.
- Track execution metrics to detect stuck execution patterns, recursive file loops, or runaway agents.
- Terminate and reassign tasks if agents stall or burn tokens without measurable progress.

### 5. Merge
- The team lead agent compiles final deliverables.
- Validator agents verify output compatibility and run linters.
- Terminate all child subagents cleanly once success criteria are verified.
- Log total cost, extract template instructions for similar future tasks, and optimize swarm configuration parameters.
