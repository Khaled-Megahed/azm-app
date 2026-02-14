class GoalListView {
  constructor() {
    this.parentElement = document.getElementById("goalsList");
    this.taskCountElement = document.getElementById("taskCount");
  }

  /**
   * Renders the goals list with progress bar and action buttons
   * @param {Array} goals - The list of goals to display
   * @param {Number} progress - Completion percentage (0-100)
   */
  render(goals, progress = 0) {
    this.parentElement.innerHTML = "";

    // 1. Create Progress and Actions Header
    const headerMarkup = `
      <div class="progress-container">
        <div class="progress-bar" style="width: ${progress}%"></div>
      </div>
      <div class="actions-bar">
        <button type="button" class="text-btn clear-completed-btn">Clear Completed</button>
        <button type="button" class="text-btn clear-all-btn">Clear All</button>
      </div>
    `;
    this.parentElement.insertAdjacentHTML("afterbegin", headerMarkup);

    // 2. Handle Empty State
    if (goals.length === 0) {
      this.parentElement.insertAdjacentHTML(
        "beforeend",
        `<p class="empty-msg">No goals found for this period.</p>`,
      );
      this._updateTaskCount(0);
      return;
    }

    // 3. Render Goals
    const markup = goals.map((goal) => this._generateMarkup(goal)).join("");
    this.parentElement.insertAdjacentHTML("beforeend", markup);
    this._updateTaskCount(goals.length);
  }

  /**
   * Updated to handle Delete, Toggle, Clear Completed, and Clear All
   */
  addEventListener(
    handlerDelete,
    handlerToggle,
    handlerClearCompleted,
    handlerClearAll,
  ) {
    this.parentElement.addEventListener("click", (e) => {
      const deleteBtn = e.target.closest(".delete-btn");
      const checkbox = e.target.closest(".task-checkbox");
      const clearCompletedBtn = e.target.closest(".clear-completed-btn");
      const clearAllBtn = e.target.closest(".clear-all-btn");

      if (deleteBtn) {
        const id = Number(deleteBtn.dataset.id);
        handlerDelete(id);
      }

      if (checkbox) {
        const id = Number(checkbox.dataset.id);
        handlerToggle(id);
      }

      if (clearCompletedBtn) {
        handlerClearCompleted();
      }

      if (clearAllBtn) {
        if (
          confirm(
            "Are you sure you want to delete all goals in this timeframe?",
          )
        ) {
          handlerClearAll();
        }
      }
    });
  }

  _generateMarkup(goal) {
    return `
      <li class="goal-item ${goal.importance === "high" ? "important" : "not-important"} ${goal.completed ? "completed" : ""}" 
          draggable="true" 
          data-id="${goal.id}">
        <div class="goal-content">
          <p class="goal-title">${goal.title}</p>
          <div class="tags-container">
            <span class="tag ${goal.importance}">${goal.importance}</span>
            <span class="tag ${goal.urgency}">${goal.urgency}</span>
          </div>
        </div>
        <div class="goal-action">
          <input type="checkbox" class="task-checkbox" data-id="${goal.id}" ${goal.completed ? "checked" : ""} />
          <button type="button" class="delete-btn" data-id="${goal.id}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </li>
    `;
  }

  addDragListeners(handlerReorder) {
    this.parentElement.addEventListener("dragstart", (e) => {
      const item = e.target.closest(".goal-item");
      if (item) item.classList.add("dragging");
    });

    this.parentElement.addEventListener("dragend", (e) => {
      const item = e.target.closest(".goal-item");
      if (item) item.classList.remove("dragging");

      const newOrderIds = Array.from(
        this.parentElement.querySelectorAll(".goal-item"),
      ).map((el) => Number(el.dataset.id));

      handlerReorder(newOrderIds);
    });

    this.parentElement.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingItem = document.querySelector(".dragging");
      if (!draggingItem) return;

      const siblings = [
        ...this.parentElement.querySelectorAll(".goal-item:not(.dragging)"),
      ];

      const nextSibling = siblings.find((sibling) => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
      });

      this.parentElement.insertBefore(draggingItem, nextSibling);
    });
  }

  _updateTaskCount(count) {
    this.taskCountElement.textContent = count;
  }
}

export default new GoalListView();
