import * as model from "./model.js";
import FormView from "./views/formView.js";
import FilterView from "./views/filterView.js";
import GoalListView from "./views/GoalListView.js";
import MatrixView from "./views/MatrixView.js";

const controlAddGoal = function () {
  const data = FormView._getFormData();
  if (!data.title) return;

  model.addGoal(data);
  FormView._clearInputs();

  FilterView.setActiveFilter(data.timeframe);
  updateUI();
};

const controlDeleteGoal = function (id) {
  const activeFilter = FilterView.getActiveFilter();
  model.deleteGoal(id, activeFilter);
  updateUI();
};

const controlToggleGoal = function (id) {
  const activeFilter = FilterView.getActiveFilter();
  model.toggleGoal(id, activeFilter);
  updateUI();
};

/**
 * NEW: Handles clearing completed tasks
 */
const controlClearCompleted = function () {
  const activeFilter = FilterView.getActiveFilter();
  model.clearCompletedGoals(activeFilter);
  updateUI();
};

/**
 * NEW: Handles clearing the entire timeframe
 */
const controlClearAll = function () {
  const activeFilter = FilterView.getActiveFilter();
  model.clearAllGoals(activeFilter);
  updateUI();
};

/**
 * NEW: Handles the Quick-Move rotation in the Matrix
 */
const controlQuickMove = function (id, updates) {
  const activeFilter = FilterView.getActiveFilter();
  model.updateGoalMatrix(id, activeFilter, updates);
  updateUI();
};

const controlFilter = function () {
  updateUI();
};

const controlReorder = function (newIdArray) {
  const activeFilter = FilterView.getActiveFilter();
  model.reorderGoals(activeFilter, newIdArray);
};

/**
 * UPDATED: Now passes progress data to the GoalListView
 */
const updateUI = function () {
  const activeFilter = FilterView.getActiveFilter();
  const goals = model.state[activeFilter];

  // Get progress percentage (0-100)
  const progress = model.getProgress(activeFilter);

  // 1. Update List View with goals and progress
  GoalListView.render(goals, progress);

  // 2. Update Matrix View
  const matrixData = model.getMatrixData(activeFilter);
  MatrixView.render(matrixData);
};

const controlViewSwitch = function (viewType) {
  const listContainer = document.getElementById("listContainer");
  const matrixContainer = document.getElementById("matrixContainer");
  const listBtn = document.getElementById("listViewBtn");
  const matrixBtn = document.getElementById("matrixViewBtn");

  if (viewType === "list") {
    listContainer.classList.remove("hidden");
    matrixContainer.classList.add("hidden");
    listBtn.classList.add("active-view");
    matrixBtn.classList.remove("active-view");
  } else {
    listContainer.classList.add("hidden");
    matrixContainer.classList.remove("hidden");
    listBtn.classList.remove("active-view");
    matrixBtn.classList.add("active-view");
  }
};
const controlTheme = function () {
  const isDark = document.body.classList.toggle("dark-mode");

  // Update Icon
  const icon = document.querySelector("#themeToggle i");
  icon.classList.toggle("fa-sun", isDark);
  icon.classList.toggle("fa-moon", !isDark);

  // Save preference
  localStorage.setItem("azm_theme", isDark ? "dark" : "light");
};
const init = function () {
  model.loadState();

  // 1. Theme Initialization
  const savedTheme = localStorage.getItem("azm_theme");
  const themeBtn = document.getElementById("themeToggle");
  const themeIcon = themeBtn?.querySelector("i");

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeIcon) themeIcon.classList.replace("fa-moon", "fa-sun");
  }

  // 2. Set Default View
  controlViewSwitch("list");

  // 3. Application Event Listeners
  FormView.addEventListener(controlAddGoal);
  FilterView.addEventListener(controlFilter);

  GoalListView.addEventListener(
    controlDeleteGoal,
    controlToggleGoal,
    controlClearCompleted,
    controlClearAll,
  );

  GoalListView.addDragListeners(controlReorder);
  MatrixView.addQuickMoveListener(controlQuickMove);

  // 4. UI Component Listeners
  document
    .getElementById("listViewBtn")
    .addEventListener("click", () => controlViewSwitch("list"));

  document
    .getElementById("matrixViewBtn")
    .addEventListener("click", () => controlViewSwitch("matrix"));

  // 5. Theme Toggle Listener
  themeBtn?.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");

    // Update Icon visually
    if (themeIcon) {
      themeIcon.classList.toggle("fa-sun", isDark);
      themeIcon.classList.toggle("fa-moon", !isDark);
    }

    // Persist preference
    localStorage.setItem("azm_theme", isDark ? "dark" : "light");
  });

  // 6. Final Initial Render
  updateUI();
};

init();
