// views/MatrixView.js
class MatrixView {
  constructor() {
    this.parentElement = document.getElementById("matrixContainer");
  }

  /**
   * Renders the 2x2 Eisenhower Matrix
   * @param {Object} data - Categorized goals (doFirst, schedule, delegate, eliminate)
   */
  render(data) {
    if (!this.parentElement) return;

    const grid = this.parentElement.querySelector(".matrix-grid");

    const markup = `
      <div class="quadrant" id="doFirst">
        <h3 class="q-title q-do">Do First</h3>
        <div class="q-list">${this._generateList(data.doFirst)}</div>
      </div>
      <div class="quadrant" id="schedule">
        <h3 class="q-title q-schedule">Schedule</h3>
        <div class="q-list">${this._generateList(data.schedule)}</div>
      </div>
      <div class="quadrant" id="delegate">
        <h3 class="q-title q-delegate">Delegate</h3>
        <div class="q-list">${this._generateList(data.delegate)}</div>
      </div>
      <div class="quadrant" id="eliminate">
        <h3 class="q-title q-eliminate">Eliminate</h3>
        <div class="q-list">${this._generateList(data.eliminate)}</div>
      </div>
    `;

    grid.innerHTML = markup;
  }

  /**
   * Adds listener for the Quick-Move feature
   */
  addQuickMoveListener(handler) {
    this.parentElement.addEventListener("click", (e) => {
      const moveBtn = e.target.closest(".move-btn");
      if (!moveBtn) return;

      const id = Number(moveBtn.dataset.id);
      const currentImportance = moveBtn.dataset.importance;
      const currentUrgency = moveBtn.dataset.urgency;

      // Logic to "cycle" the task to the next quadrant
      let nextImportance = currentImportance;
      let nextUrgency = currentUrgency;

      if (currentImportance === "high" && currentUrgency === "urgent") {
        nextUrgency = "not-urgent"; // Move to Schedule
      } else if (
        currentImportance === "high" &&
        currentUrgency === "not-urgent"
      ) {
        nextImportance = "low";
        nextUrgency = "urgent"; // Move to Delegate
      } else if (currentImportance === "low" && currentUrgency === "urgent") {
        nextUrgency = "not-urgent"; // Move to Eliminate
      } else {
        nextImportance = "high";
        nextUrgency = "urgent"; // Loop back to Do First
      }

      handler(id, { importance: nextImportance, urgency: nextUrgency });
    });
  }

  _generateList(goals) {
    if (goals.length === 0) return `<p class="empty-msg">No tasks</p>`;

    return goals
      .map(
        (g) => `
      <div class="matrix-item priority-${g.importance} ${g.completed ? "completed" : ""}">
        ${g.completed ? '<i class="fa-solid fa-check" style="margin-right: 8px; color: var(--success);"></i>' : ""}
        <span>${g.title}</span>
        <button class="move-btn text-btn" 
                data-id="${g.id}" 
                data-importance="${g.importance}" 
                data-urgency="${g.urgency}" 
                title="Move to next quadrant">
          <i class="fa-solid fa-arrows-rotate"></i>
        </button>
      </div>`,
      )
      .join("");
  }
}

export default new MatrixView();
