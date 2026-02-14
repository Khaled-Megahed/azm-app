class FilterView {
  constructor() {
    this.parentElement = document.querySelector(".filter-nav");
    // We select buttons dynamically in methods to avoid stale references
  }

  // Helper to get buttons on the fly
  get _buttons() {
    return this.parentElement.querySelectorAll("button");
  }

  addEventListener(handler) {
    this.parentElement.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const filter = btn.dataset.filter;
      this._updateActiveButton(btn);
      handler(filter);
    });
  }

  _updateActiveButton(activeBtn) {
    this._buttons.forEach((btn) => btn.classList.remove("selectedFilter"));
    activeBtn.classList.add("selectedFilter");
  }

  getActiveFilter() {
    const activeBtn = Array.from(this._buttons).find((btn) =>
      btn.classList.contains("selectedFilter"),
    );
    return activeBtn ? activeBtn.dataset.filter : "daily";
  }

  // NEW: Call this from the controller to switch tabs programmatically
  setActiveFilter(filter) {
    const targetBtn = Array.from(this._buttons).find(
      (btn) => btn.dataset.filter === filter,
    );
    if (targetBtn) this._updateActiveButton(targetBtn);
  }
}

export default new FilterView();
