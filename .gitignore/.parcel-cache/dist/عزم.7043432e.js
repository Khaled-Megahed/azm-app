let t,e,i,n,a={daily:[],weekly:[],monthly:[],yearly:[]},s=function(){localStorage.setItem("azm_goals",JSON.stringify(a))},r=function(t){let e=a[t];return e&&0!==e.length?Math.round(e.filter(t=>t.completed).length/e.length*100):0},l=function(t){a[t]=a[t].filter(t=>!t.completed),s()},d=function(t){a[t]=[],s()},o=function(t,e,i){let n=a[e].find(e=>e.id===t);n&&(Object.assign(n,i),s())},c=function(t){let e=a[t];return{doFirst:e.filter(t=>"high"===t.importance&&"urgent"===t.urgency),schedule:e.filter(t=>"high"===t.importance&&"not-urgent"===t.urgency),delegate:e.filter(t=>"low"===t.importance&&"urgent"===t.urgency),eliminate:e.filter(t=>"low"===t.importance&&"not-urgent"===t.urgency)}};var m=new class{constructor(){this.form=document.getElementById("taskForm"),this.titleInput=document.getElementById("title"),this.importanceInput=document.getElementById("importance"),this.urgencyInput=document.getElementById("urgency"),this.timeframeInput=document.getElementById("timeframe")}_getFormData(){return{title:this.titleInput.value.trim(),importance:this.importanceInput.value,urgency:this.urgencyInput.value,timeframe:this.timeframeInput.value}}addEventListener(t){this.form.addEventListener("submit",e=>{e.preventDefault(),t()})}_clearInputs(){this.form.reset(),this.titleInput.focus()}},u=new class{constructor(){this.parentElement=document.querySelector(".filter-nav")}get _buttons(){return this.parentElement.querySelectorAll("button")}addEventListener(t){this.parentElement.addEventListener("click",e=>{let i=e.target.closest("button");if(!i)return;let n=i.dataset.filter;this._updateActiveButton(i),t(n)})}_updateActiveButton(t){this._buttons.forEach(t=>t.classList.remove("selectedFilter")),t.classList.add("selectedFilter")}getActiveFilter(){let t=Array.from(this._buttons).find(t=>t.classList.contains("selectedFilter"));return t?t.dataset.filter:"daily"}setActiveFilter(t){let e=Array.from(this._buttons).find(e=>e.dataset.filter===t);e&&this._updateActiveButton(e)}},g=new class{constructor(){this.parentElement=document.getElementById("goalsList"),this.taskCountElement=document.getElementById("taskCount")}render(t,e=0){this.parentElement.innerHTML="";let i=`
      <div class="progress-container">
        <div class="progress-bar" style="width: ${e}%"></div>
      </div>
      <div class="actions-bar">
        <button type="button" class="text-btn clear-completed-btn">Clear Completed</button>
        <button type="button" class="text-btn clear-all-btn">Clear All</button>
      </div>
    `;if(this.parentElement.insertAdjacentHTML("afterbegin",i),0===t.length){this.parentElement.insertAdjacentHTML("beforeend",'<p class="empty-msg">No goals found for this period.</p>'),this._updateTaskCount(0);return}let n=t.map(t=>this._generateMarkup(t)).join("");this.parentElement.insertAdjacentHTML("beforeend",n),this._updateTaskCount(t.length)}addEventListener(t,e,i,n){this.parentElement.addEventListener("click",a=>{let s=a.target.closest(".delete-btn"),r=a.target.closest(".task-checkbox"),l=a.target.closest(".clear-completed-btn"),d=a.target.closest(".clear-all-btn");s&&t(Number(s.dataset.id)),r&&e(Number(r.dataset.id)),l&&i(),d&&confirm("Are you sure you want to delete all goals in this timeframe?")&&n()})}_generateMarkup(t){return`
      <li class="goal-item ${"high"===t.importance?"important":"not-important"} ${t.completed?"completed":""}" 
          draggable="true" 
          data-id="${t.id}">
        <div class="goal-content">
          <p class="goal-title">${t.title}</p>
          <div class="tags-container">
            <span class="tag ${t.importance}">${t.importance}</span>
            <span class="tag ${t.urgency}">${t.urgency}</span>
          </div>
        </div>
        <div class="goal-action">
          <input type="checkbox" class="task-checkbox" data-id="${t.id}" ${t.completed?"checked":""} />
          <button type="button" class="delete-btn" data-id="${t.id}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </li>
    `}addDragListeners(t){this.parentElement.addEventListener("dragstart",t=>{let e=t.target.closest(".goal-item");e&&e.classList.add("dragging")}),this.parentElement.addEventListener("dragend",e=>{let i=e.target.closest(".goal-item");i&&i.classList.remove("dragging"),t(Array.from(this.parentElement.querySelectorAll(".goal-item")).map(t=>Number(t.dataset.id)))}),this.parentElement.addEventListener("dragover",t=>{t.preventDefault();let e=document.querySelector(".dragging");if(!e)return;let i=[...this.parentElement.querySelectorAll(".goal-item:not(.dragging)")].find(e=>t.clientY<=e.offsetTop+e.offsetHeight/2);this.parentElement.insertBefore(e,i)})}_updateTaskCount(t){this.taskCountElement.textContent=t}},p=new class{constructor(){this.parentElement=document.getElementById("matrixContainer")}render(t){this.parentElement&&(this.parentElement.querySelector(".matrix-grid").innerHTML=`
      <div class="quadrant" id="doFirst">
        <h3 class="q-title q-do">Do First</h3>
        <div class="q-list">${this._generateList(t.doFirst)}</div>
      </div>
      <div class="quadrant" id="schedule">
        <h3 class="q-title q-schedule">Schedule</h3>
        <div class="q-list">${this._generateList(t.schedule)}</div>
      </div>
      <div class="quadrant" id="delegate">
        <h3 class="q-title q-delegate">Delegate</h3>
        <div class="q-list">${this._generateList(t.delegate)}</div>
      </div>
      <div class="quadrant" id="eliminate">
        <h3 class="q-title q-eliminate">Eliminate</h3>
        <div class="q-list">${this._generateList(t.eliminate)}</div>
      </div>
    `)}addQuickMoveListener(t){this.parentElement.addEventListener("click",e=>{let i=e.target.closest(".move-btn");if(!i)return;let n=Number(i.dataset.id),a=i.dataset.importance,s=i.dataset.urgency,r=a,l=s;"high"===a&&"urgent"===s?l="not-urgent":"high"===a&&"not-urgent"===s?(r="low",l="urgent"):"low"===a&&"urgent"===s?l="not-urgent":(r="high",l="urgent"),t(n,{importance:r,urgency:l})})}_generateList(t){return 0===t.length?'<p class="empty-msg">No tasks</p>':t.map(t=>`
      <div class="matrix-item priority-${t.importance} ${t.completed?"completed":""}">
        ${t.completed?'<i class="fa-solid fa-check" style="margin-right: 8px; color: var(--success);"></i>':""}
        <span>${t.title}</span>
        <button class="move-btn text-btn" 
                data-id="${t.id}" 
                data-importance="${t.importance}" 
                data-urgency="${t.urgency}" 
                title="Move to next quadrant">
          <i class="fa-solid fa-arrows-rotate"></i>
        </button>
      </div>`).join("")}};let h=function(){let t=u.getActiveFilter(),e=a[t],i=r(t);g.render(e,i);let n=c(t);p.render(n)},v=function(t){let e=document.getElementById("listContainer"),i=document.getElementById("matrixContainer"),n=document.getElementById("listViewBtn"),a=document.getElementById("matrixViewBtn");"list"===t?(e.classList.remove("hidden"),i.classList.add("hidden"),n.classList.add("active-view"),a.classList.remove("active-view")):(e.classList.add("hidden"),i.classList.remove("hidden"),n.classList.remove("active-view"),a.classList.add("active-view"))};(t=localStorage.getItem("azm_goals"))&&Object.assign(a,JSON.parse(t)),e=localStorage.getItem("azm_theme"),i=document.getElementById("themeToggle"),n=i?.querySelector("i"),"dark"===e&&(document.body.classList.add("dark-mode"),n&&n.classList.replace("fa-moon","fa-sun")),v("list"),m.addEventListener(function(){let t=m._getFormData();t.title&&(!function(t){let{title:e,importance:i,urgency:n,timeframe:r}=t,l={id:Date.now(),title:e,importance:i,urgency:n,completed:!1,createdAt:new Date().toISOString()};if(a[r])a[r].push(l),s();else throw Error(`Timeframe "${r}" does not exist in state.`)}(t),m._clearInputs(),u.setActiveFilter(t.timeframe),h())}),u.addEventListener(function(){h()}),g.addEventListener(function(t){let e=u.getActiveFilter();if(!a.hasOwnProperty(e))throw Error(`Timeframe "${e}" does not exist in state.`);a[e]=a[e].filter(e=>e.id!==t),s(),h()},function(t){let e;(e=a[u.getActiveFilter()].find(e=>e.id===t))&&(e.completed=!e.completed,s()),h()},function(){l(u.getActiveFilter()),h()},function(){d(u.getActiveFilter()),h()}),g.addDragListeners(function(t){var e;let i;e=u.getActiveFilter(),i=t.map(t=>a[e].find(e=>e.id==t)),a[e]=i.filter(t=>void 0!==t),s()}),p.addQuickMoveListener(function(t,e){o(t,u.getActiveFilter(),e),h()}),document.getElementById("listViewBtn").addEventListener("click",()=>v("list")),document.getElementById("matrixViewBtn").addEventListener("click",()=>v("matrix")),i?.addEventListener("click",()=>{let t=document.body.classList.toggle("dark-mode");n&&(n.classList.toggle("fa-sun",t),n.classList.toggle("fa-moon",!t)),localStorage.setItem("azm_theme",t?"dark":"light")}),h();
//# sourceMappingURL=عزم.7043432e.js.map
