export const state = {
  daily: [],
  weekly: [],
  monthly: [],
  yearly: [],
};

const persistData = function () {
  localStorage.setItem("azm_goals", JSON.stringify(state));
};

export function addGoal(goalData) {
  const { title, importance, urgency, timeframe } = goalData;

  const newGoal = {
    id: Date.now(),
    title,
    importance,
    urgency,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  if (state[timeframe]) {
    state[timeframe].push(newGoal);
    persistData();
  } else {
    throw new Error(`Timeframe "${timeframe}" does not exist in state.`);
  }
}

export function deleteGoal(id, timeframe) {
  if (!state.hasOwnProperty(timeframe)) {
    throw new Error(`Timeframe "${timeframe}" does not exist in state.`);
  }

  state[timeframe] = state[timeframe].filter((goal) => goal.id !== id);
  persistData();
}

export function toggleGoal(id, timeframe) {
  const goal = state[timeframe].find((g) => g.id === id);
  if (goal) {
    goal.completed = !goal.completed;
    persistData();
  }
}

export function loadState() {
  const storage = localStorage.getItem("azm_goals");
  if (storage) {
    const data = JSON.parse(storage);
    Object.assign(state, data);
  }
}

/**
 * NEW: Calculates completion percentage for a timeframe
 */
export const getProgress = function (timeframe) {
  const goals = state[timeframe];
  if (!goals || goals.length === 0) return 0;

  const completedCount = goals.filter((g) => g.completed).length;
  return Math.round((completedCount / goals.length) * 100);
};

/**
 * NEW: Clears only completed goals
 */
export const clearCompletedGoals = function (timeframe) {
  state[timeframe] = state[timeframe].filter((g) => !g.completed);
  persistData();
};

/**
 * NEW: Wipes all goals for a timeframe
 */
export const clearAllGoals = function (timeframe) {
  state[timeframe] = [];
  persistData();
};

/**
 * NEW: Updates goal attributes for "Quick-Move" feature
 */
export const updateGoalMatrix = function (id, timeframe, updates) {
  const goal = state[timeframe].find((g) => g.id === id);
  if (goal) {
    // updates could be { importance: 'high', urgency: 'urgent' }
    Object.assign(goal, updates);
    persistData();
  }
};

export const getMatrixData = function (timeframe) {
  const goals = state[timeframe];
  return {
    doFirst: goals.filter(
      (g) => g.importance === "high" && g.urgency === "urgent",
    ),
    schedule: goals.filter(
      (g) => g.importance === "high" && g.urgency === "not-urgent",
    ),
    delegate: goals.filter(
      (g) => g.importance === "low" && g.urgency === "urgent",
    ),
    eliminate: goals.filter(
      (g) => g.importance === "low" && g.urgency === "not-urgent",
    ),
  };
};

export function reorderGoals(timeframe, newIdArray) {
  const reordered = newIdArray.map((id) =>
    state[timeframe].find((g) => g.id == id),
  );

  state[timeframe] = reordered.filter((el) => el !== undefined);
  persistData();
}
