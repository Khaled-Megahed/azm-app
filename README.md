# 🎯 عزم | Azm

### Eisenhower Matrix & Strategic Goal Tracker

## **Azm (عزم)** is a sophisticated productivity application designed to help users move beyond simple "To-Do" lists and into strategic task prioritization. Built with a clean **MVC (Model-View-Controller) architecture**, it implements the famous Eisenhower Matrix to categorize goals by importance and urgency.

## ✨ Key Features

- **⚡ Smart Prioritization:** Automatically categorizes tasks into four Eisenhower quadrants (Do First, Schedule, Delegate, Eliminate).
- **🌓 Unified Dark Mode:** Seamlessly switch between light and dark themes with persistent user preferences.
- **📊 Dynamic Progress Tracking:** Real-time visual progress bars for Daily, Weekly, Monthly, and Yearly timeframes.
- **🖱️ Drag & Drop Interface:** Intuitive reordering of tasks within the list view for manual prioritization.
- **🔄 Matrix Quick-Move:** A "cycle" feature to rotate tasks between quadrants directly within the Matrix view.
- **💾 LocalStorage Persistence:** Your data is automatically saved in the browser, ensuring zero data loss on refresh.

---

## 🛠️ Tech Stack

- **Architecture:** Modular MVC (Model-View-Controller)
- **Frontend:** Vanilla JavaScript (ES6+), HTML5, CSS3
- **Icons:** FontAwesome 6
- **Typography:** Amiri (Arabic Serif) & Segoe UI
- **Deployment:** GitHub Pages / Vercel

---

## 📁 Project Structure

```text
├── index.html          # Main entry point
├── style.css           # Custom CSS with Dark Mode
scripts
├── controller.js       # App orchestrator
├── model.js            # State management & logic
└── views/              # UI Components
    ├── FormView.js
    ├── GoalListView.js
    ├── MatrixView.js
    └── FilterView.js
```
