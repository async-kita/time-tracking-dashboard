class Dashboard {
  selectors = {
    root: "[data-js-dashboard]",
    wrapper: "[data-js-dashboard-wrapper]",
    tabs: "[data-js-dashboard-tabs]",
    tab: "[data-js-dashboard-tab]",
    item: "[data-js-dashboard-item]",
    time: "[data-js-dashboard-time]",
    prev: "[data-js-dashboard-prev]",
  };

  stateView = {
    daily: "Day",
    weekly: "Week",
    monthly: "Month",
  };

  stateClasses = {
    isActive: "is-active",
  };

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.wrapperElement = this.rootElement.querySelector(
      this.selectors.wrapper,
    );
    this.tabsElement = this.rootElement.querySelector(this.selectors.tabs);
    this.state = {
      data: [],
      view: "daily",
    };
    this.init();
  }

  async getDashboardData(url = "./data.json") {
    const response = await fetch(url);
    const data = await response.json();

    return data;
  }

  generateMarkupItem(id, title, time, previous) {
    return `
    <div class="dashboard__item dashboard__item--${id}" data-js-dashboard-item>
            <article class="tracking-card">
              <header class="tracking-card__header">
                <h4 class="tracking-card__title">${title}</h4>
                <button
                  class="tracking-card__button"
                  type="button"
                  aria-label="Menu">
                  <img
                    class="tracking-card__menu"
                    src="./images/icon-ellipsis.svg"
                    alt="Menu">
                  <span class="visually-hidden">Menu</span>
                </button>
              </header>
              <div class="tracking-card__body">
                <p class="tracking-card__time">
                  <span data-js-dashboard-time>${time}</span>hrs
                </p>
                <p class="tracking-card__prev-period">
                  Last ${this.stateView[this.state.view]} -
                  <span data-js-dashboard-prev>${previous}</span>hrs
                </p>
              </div>
            </article>
          </div>
    `;
  }

  render(data) {
    data.forEach(element => {
      const title = element.title;
      const id = title.toLowerCase().replace(/ /g, "-");
      const timeframes = this.state.view;
      const currentTime = element.timeframes[timeframes].current;
      const previousTime = element.timeframes[timeframes].previous;

      this.wrapperElement.insertAdjacentHTML(
        "beforeend",
        this.generateMarkupItem(id, title, currentTime, previousTime),
      );
    });
  }

  updateInfo() {
    this.itemElement = this.rootElement.querySelectorAll(this.selectors.item);
    this.itemElement.forEach(item => item.remove());
    this.render(this.state.data);
  }

  updateActiveTab() {
    this.tabElements = this.rootElement.querySelectorAll(this.selectors.tab);
    this.tabElements.forEach(tab => {
      const tabView = tab.textContent.trim().toLowerCase();
      const isActive = tabView === this.state.view;

      if (isActive) {
        tab.classList.add(this.stateClasses.isActive);
      } else {
        tab.classList.remove(this.stateClasses.isActive);
      }

      tab.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  onClickTab = e => {
    if (e.target.closest("button")) {
      this.state.view = e.target.textContent.trim().toLowerCase();
      this.updateInfo();
      this.updateActiveTab();
    }
  };

  async init() {
    try {
      const data = await this.getDashboardData();
      this.state.data = data;
      this.render(data);
      this.tabsElement.addEventListener("click", this.onClickTab);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }
}

new Dashboard();
