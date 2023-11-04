class NotificationItem {
  constructor(report) {
    this.report = report;
  }

  createItem = () => {
    const settings = this.report.hazardCategory.settings;
    return `
            <div class="notification-modal">
              <span class="notification__icon" style="background:${
                settings?.iconBackround ?? '#AD7311'
              }">
                <i class="${
                  settings?.icon ?? 'icon-warning'
                }" style="background:var(--white)">
                </i>
              </span>
              <div class="notification__body">
                <div class="notification__body__content">
                  <span> 
                    <strong>${this.report.hazardCategory.name}</strong> 
                    <span> has been reported at </span> 
                    <strong> ${this.report.location.address} </strong>
                  </span>
                  <span> ${new Date(
                    this.report.created_at
                  ).toLocaleString()} <span>
                </div>
                <button class="btn btn-secondary notification__body__button">View details</button>
              </div>
              <span class="badge" />
            </div>
            `;
  };
}

export default NotificationItem;
