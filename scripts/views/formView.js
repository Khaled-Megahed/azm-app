class FormView {
  constructor() {
    this.form = document.getElementById("taskForm");
    this.titleInput = document.getElementById("title");
    this.importanceInput = document.getElementById("importance");
    this.urgencyInput = document.getElementById("urgency");
    this.timeframeInput = document.getElementById("timeframe");
  }

  _getFormData() {
    return {
      title: this.titleInput.value.trim(),
      importance: this.importanceInput.value,
      urgency: this.urgencyInput.value,
      timeframe: this.timeframeInput.value,
    };
  }

  addEventListener(handler) {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  }

  _clearInputs() {
    this.form.reset();
    this.titleInput.focus();
  }
}

export default new FormView();
