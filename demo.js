:root {
  font-family: Inter, "Microsoft YaHei", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #17231c;
  background: #f3f7f4;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

button,
input,
select,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at 15% 15%, rgba(35, 126, 77, 0.18), transparent 28%),
    linear-gradient(145deg, #edf7f0, #f8faf8);
}

.login-card {
  width: min(920px, 100%);
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  overflow: hidden;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 24px 70px rgba(28, 66, 43, 0.16);
}

.login-brand {
  min-height: 520px;
  padding: 54px;
  color: #fff;
  background: linear-gradient(145deg, #15653a, #23925a);
}

.brand-mark {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border-radius: 18px;
  color: #17663b;
  background: #fff;
  font-size: 30px;
  font-weight: 800;
}

.login-brand h1 {
  max-width: 470px;
  margin: 30px 0 16px;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.16;
}

.login-brand p {
  max-width: 440px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 17px;
  line-height: 1.8;
}

.login-points {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 42px;
}

.login-point {
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.09);
}

.login-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;
}

.login-form h2 {
  margin: 0 0 8px;
  font-size: 28px;
}

.login-form > p {
  margin: 0 0 28px;
  color: #718078;
}

.role-grid {
  display: grid;
  gap: 12px;
}

.role-button {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid #dbe7df;
  border-radius: 16px;
  color: #25352c;
  background: #fff;
  text-align: left;
}

.role-button:hover,
.role-button.active {
  border-color: #27905a;
  background: #f0faf4;
}

.role-button strong,
.role-button span {
  display: block;
}

.role-button span {
  margin-top: 4px;
  color: #75827b;
  font-size: 13px;
}

.demo-tip {
  margin-top: 22px;
  padding: 12px 14px;
  border-radius: 12px;
  color: #536159;
  background: #f4f6f4;
  font-size: 13px;
  line-height: 1.6;
}

.app-shell {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 236px minmax(0, 1fr);
}

.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 22px 14px;
  color: #eef8f2;
  background: #153d29;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 4px 8px 22px;
}

.sidebar-brand .brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  font-size: 22px;
}

.sidebar-brand strong,
.sidebar-brand small {
  display: block;
}

.sidebar-brand small {
  margin-top: 4px;
  color: #a9c2b2;
}

.nav-list {
  display: grid;
  gap: 4px;
  overflow-y: auto;
}

.nav-button {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 11px 12px;
  border: 0;
  border-radius: 11px;
  color: #c7d9ce;
  background: transparent;
  text-align: left;
}

.nav-button:hover,
.nav-button.active {
  color: #fff;
  background: #276544;
}

.sidebar-user {
  margin-top: auto;
  padding: 14px 10px 2px;
  border-top: 1px solid rgba(255, 255, 255, 0.11);
}

.sidebar-user strong,
.sidebar-user small {
  display: block;
}

.sidebar-user small {
  margin-top: 4px;
  color: #a9c2b2;
}

.main-area {
  min-width: 0;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  height: 70px;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 28px;
  border-bottom: 1px solid #e2e9e4;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
}

.menu-toggle {
  display: none;
}

.topbar h1 {
  margin: 0;
  font-size: 21px;
}

.topbar-spacer {
  flex: 1;
}

.connection-status {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  border-radius: 999px;
  color: #55645b;
  background: #edf3ef;
  font-size: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #e6a11d;
}

.status-dot.online {
  background: #27a565;
}

.content {
  padding: 26px 28px 48px;
}

.page-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 22px;
}

.page-head h2 {
  margin: 0 0 6px;
  font-size: 25px;
}

.page-head p {
  margin: 0;
  color: #748179;
}

.button,
.icon-button {
  border: 0;
  border-radius: 11px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 40px;
  padding: 9px 15px;
  color: #fff;
  background: #237e4d;
  font-weight: 650;
}

.button:hover {
  background: #176b3e;
}

.button.secondary {
  color: #31503e;
  border: 1px solid #d7e2da;
  background: #fff;
}

.button.warning {
  background: #d28a14;
}

.button.danger {
  background: #c74343;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.icon-button {
  width: 38px;
  height: 38px;
  display: inline-grid;
  place-items: center;
  color: #526159;
  background: #eef3ef;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(145px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.stat-card {
  min-width: 0;
  padding: 18px;
  border: 1px solid #e3eae5;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(32, 66, 45, 0.045);
}

.stat-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #748179;
  font-size: 13px;
}

.stat-icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: 11px;
  color: #237e4d;
  background: #eaf7ef;
}

.stat-value {
  margin-top: 13px;
  font-size: 26px;
  font-weight: 800;
}

.stat-value.warning {
  color: #bd6a14;
}

.stat-value.danger {
  color: #c63e3e;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: 18px;
}

.panel {
  overflow: hidden;
  border: 1px solid #e2e9e4;
  border-radius: 17px;
  background: #fff;
}

.panel + .panel {
  margin-top: 18px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 17px 19px;
  border-bottom: 1px solid #edf1ee;
}

.panel-head h3 {
  margin: 0;
  font-size: 17px;
}

.panel-body {
  padding: 19px;
}

.todo-list {
  display: grid;
  gap: 10px;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 13px;
  border-radius: 12px;
  background: #f6f8f6;
}

.todo-item .stat-icon {
  flex: 0 0 auto;
}

.todo-item strong,
.todo-item span {
  display: block;
}

.todo-item span {
  margin-top: 3px;
  color: #7a867f;
  font-size: 13px;
}

.table-wrap {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

th,
td {
  padding: 13px 15px;
  border-bottom: 1px solid #edf1ee;
  text-align: left;
}

th {
  color: #708078;
  background: #f8faf8;
  font-size: 12px;
  font-weight: 650;
}

td {
  font-size: 14px;
}

tbody tr:hover {
  background: #fafcfb;
}

.status-badge,
.tag,
.stock-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 650;
}

.status-badge.pending {
  color: #996017;
  background: #fff3d9;
}

.status-badge.shipping {
  color: #2364a0;
  background: #e9f3ff;
}

.status-badge.audit {
  color: #6a51a3;
  background: #f0eaff;
}

.status-badge.done {
  color: #207448;
  background: #e7f7ed;
}

.status-badge.rejected {
  color: #ad3434;
  background: #fdeaea;
}

.tag {
  color: #6c5940;
  background: #f4eee4;
}

.tag.debt {
  color: #a22e2e;
  background: #fde8e8;
}

.tag.big {
  color: #a35f08;
  background: #fff0cf;
}

.stock-pill.low {
  color: #b13232;
  background: #fde9e9;
}

.stock-pill.ok {
  color: #277249;
  background: #e8f7ee;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 11px;
  margin-bottom: 17px;
}

.toolbar > select,
.toolbar > input[type="date"] {
  min-height: 42px;
  padding: 0 11px;
  border: 1px solid #dce5df;
  border-radius: 11px;
  color: #425047;
  background: #fff;
}

.search-box {
  min-width: min(340px, 100%);
  flex: 1;
  position: relative;
}

.search-box svg {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #8a958e;
}

.search-box input {
  width: 100%;
  height: 42px;
  padding: 0 13px 0 39px;
  border: 1px solid #dce5df;
  border-radius: 11px;
  outline: none;
  background: #fff;
}

.search-box input:focus,
.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #26905a;
  box-shadow: 0 0 0 3px rgba(38, 144, 90, 0.11);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 15px;
}

.order-card,
.product-card,
.customer-card {
  overflow: hidden;
  border: 1px solid #e0e8e2;
  border-radius: 16px;
  background: #fff;
}

.order-card {
  padding: 17px;
}

.order-card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.order-card h3 {
  margin: 0 0 4px;
  font-size: 17px;
}

.muted {
  color: #7b8780;
}

.order-number {
  color: #66746c;
  font-size: 13px;
}

.info-list {
  display: grid;
  gap: 8px;
  margin: 15px 0;
}

.info-line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #536159;
  font-size: 13px;
}

.info-line svg {
  flex: 0 0 auto;
  margin-top: 1px;
}

.order-items {
  padding: 11px;
  border-radius: 11px;
  background: #f6f8f6;
  font-size: 13px;
  line-height: 1.7;
}

.shipping-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 0;
}

.shipping-item span {
  flex: 1;
}

.photo-progress {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
  margin: 13px 0;
}

.photo-count {
  padding: 9px 6px;
  border-radius: 9px;
  color: #607067;
  background: #f0f4f1;
  text-align: center;
  font-size: 11px;
}

.photo-count strong {
  display: block;
  margin-top: 3px;
  color: #26362d;
  font-size: 15px;
}

.card-actions {
  display: flex;
  gap: 9px;
  margin-top: 14px;
}

.card-actions .button {
  flex: 1;
}

.row-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 12px;
}

.row-actions .button {
  min-height: 34px;
  padding: 6px 10px;
  font-size: 12px;
}

.product-card {
  display: grid;
  grid-template-columns: 92px minmax(0, 1fr);
}

.product-image {
  min-height: 116px;
  display: grid;
  place-items: center;
  color: #32805a;
  background: linear-gradient(145deg, #e5f5eb, #f4faf6);
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-image.compact {
  width: 42px;
  height: 42px;
  min-height: 42px;
  flex: 0 0 42px;
  border-radius: 9px;
}

.product-info {
  min-width: 0;
  padding: 14px;
}

.product-info h3 {
  margin: 0 0 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
}

.product-note {
  margin: 8px 0 0;
  color: #748179;
  font-size: 12px;
}

.product-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
}

.price {
  color: #b45f19;
  font-size: 17px;
  font-weight: 750;
}

.customer-card {
  padding: 17px;
}

.customer-card h3 {
  margin: 0;
}

.customer-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 14px;
}

.customer-actions {
  display: flex;
  gap: 8px;
  margin-top: 15px;
}

.customer-recent {
  margin-top: 10px;
  color: #748179;
  font-size: 12px;
  line-height: 1.6;
}

.sale-layout {
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  gap: 18px;
}

.customer-selector,
.sale-editor {
  border: 1px solid #e0e8e2;
  border-radius: 16px;
  background: #fff;
}

.section-title {
  padding: 16px 18px;
  border-bottom: 1px solid #edf1ee;
  font-weight: 750;
}

.section-content {
  padding: 17px;
}

.choice-list {
  display: grid;
  gap: 8px;
  max-height: 360px;
  overflow-y: auto;
}

.choice-item {
  padding: 12px;
  border: 1px solid #e5ebe7;
  border-radius: 11px;
  background: #fff;
}

.choice-item:hover,
.choice-item.active {
  border-color: #2b925c;
  background: #f1faf4;
}

.choice-item strong,
.choice-item span {
  display: block;
}

.choice-item span {
  margin-top: 4px;
  color: #75827b;
  font-size: 12px;
}

.selected-customer {
  margin-top: 14px;
  padding: 13px;
  border-radius: 11px;
  background: #eef8f2;
}

.selected-customer strong,
.selected-customer span {
  display: block;
}

.selected-customer span {
  margin-top: 5px;
  color: #5e6c64;
  font-size: 13px;
}

.product-picker {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  max-height: 285px;
  overflow-y: auto;
}

.picker-item {
  padding: 11px;
  border: 1px solid #e3eae5;
  border-radius: 11px;
  background: #fff;
  text-align: left;
}

.picker-item .product-image {
  margin-bottom: 8px;
}

.picker-item:hover {
  border-color: #27905a;
  background: #f3faf5;
}

.picker-item strong,
.picker-item span {
  display: block;
}

.picker-item span {
  margin-top: 4px;
  color: #78857d;
  font-size: 12px;
}

.table-product {
  display: flex;
  align-items: center;
  gap: 9px;
}

.sale-lines {
  margin-top: 17px;
}

.sale-line {
  position: relative;
  display: grid;
  grid-template-columns: minmax(160px, 1fr) 90px 105px 95px 38px;
  align-items: center;
  gap: 9px;
  padding: 11px 0;
  border-bottom: 1px solid #edf1ee;
}

.sale-line input {
  width: 100%;
  height: 38px;
  padding: 0 9px;
  border: 1px solid #dce5df;
  border-radius: 9px;
}

.history-price {
  margin-top: 5px;
  color: #7a867f;
  font-size: 11px;
}

.history-price.warning {
  color: #bd5b25;
  font-weight: 650;
}

.sale-summary {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
  align-items: end;
  margin-top: 18px;
}

.sale-total {
  min-width: 230px;
  padding: 16px;
  border-radius: 13px;
  background: #173f2b;
  color: #fff;
}

.sale-total-line {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin: 7px 0;
}

.sale-total-line.grand {
  padding-top: 9px;
  border-top: 1px solid rgba(255, 255, 255, 0.17);
  font-size: 18px;
  font-weight: 750;
}

.paid-input {
  align-items: center;
}

.paid-input input {
  width: 105px;
  padding: 6px 8px;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 8px;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  text-align: right;
}

.sale-buttons {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 8px;
  margin-top: 12px;
}

.sale-buttons .button.secondary {
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
  background: transparent;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.field {
  display: grid;
  gap: 7px;
}

.field.full {
  grid-column: 1 / -1;
}

.field label {
  color: #59675f;
  font-size: 13px;
  font-weight: 650;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 10px 11px;
  border: 1px solid #dce5df;
  border-radius: 10px;
  outline: none;
  background: #fff;
}

.field textarea {
  min-height: 82px;
  resize: vertical;
}

.empty-state {
  padding: 44px 20px;
  color: #7b8780;
  text-align: center;
}

.empty-state svg {
  margin-bottom: 10px;
  color: #a6b2aa;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(14, 31, 21, 0.57);
}

.modal {
  width: min(900px, 100%);
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 19px;
  background: #fff;
  box-shadow: 0 25px 80px rgba(0, 0, 0, 0.22);
}

.modal-head {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 17px 20px;
  border-bottom: 1px solid #e8ede9;
  background: #fff;
}

.modal-head h2 {
  margin: 0;
  font-size: 20px;
}

.modal-body {
  padding: 20px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 17px;
}

.detail-box {
  padding: 13px;
  border-radius: 11px;
  background: #f3f7f4;
}

.detail-box span,
.detail-box strong {
  display: block;
}

.detail-box span {
  margin-bottom: 5px;
  color: #78857d;
  font-size: 12px;
}

.upload-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 18px 0;
}

.upload-box {
  padding: 15px;
  border: 1px dashed #bdd1c3;
  border-radius: 13px;
  background: #f8fbf9;
}

.upload-box h4 {
  margin: 0 0 6px;
}

.upload-box p {
  min-height: 36px;
  margin: 0 0 11px;
  color: #77847c;
  font-size: 12px;
}

.upload-box input {
  width: 100%;
  font-size: 12px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 19px;
  padding-top: 17px;
  border-top: 1px solid #edf1ee;
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 12px 13px;
  border-radius: 11px;
  color: #93551b;
  background: #fff1d7;
  font-size: 13px;
}

.form-error {
  margin-top: 16px;
  padding: 12px 13px;
  border: 1px solid #efc0c0;
  border-radius: 11px;
  color: #a72f2f;
  background: #fff0f0;
  font-size: 13px;
  font-weight: 650;
}

.debt-text {
  color: #b63838;
}

.price-warning-list {
  display: grid;
  gap: 10px;
  margin-bottom: 14px;
}

.price-warning-card {
  padding: 14px;
  border: 1px solid #ead9bf;
  border-radius: 12px;
  background: #fffaf0;
}

.price-warning-card > strong {
  display: block;
  margin-bottom: 9px;
}

.price-warning-card > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 0;
  color: #66736b;
}

.price-warning-card small {
  display: block;
  margin-top: 7px;
  color: #849087;
}

.price-warning-card .price-up {
  color: #b44b2a;
}

.price-warning-card .price-down {
  color: #26734a;
}

.print-preview {
  width: min(980px, 100%);
  max-height: 96vh;
  overflow: auto;
  padding: 18px;
  border-radius: 18px;
  background: #eef2ef;
}

.print-toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin: 0 auto 14px;
  width: min(794px, 100%);
}

.sales-print-sheet {
  width: min(794px, 100%);
  min-height: 1123px;
  margin: 0 auto;
  padding: 46px 48px;
  color: #111;
  background: #fff;
  box-shadow: 0 12px 38px rgba(25, 49, 34, 0.16);
}

.print-title {
  padding-bottom: 14px;
  border-bottom: 2px solid #111;
  text-align: center;
}

.print-title h1 {
  margin: 0 0 15px;
  font-family: "Microsoft YaHei", sans-serif;
  font-size: 25px;
  letter-spacing: 2px;
}

.print-title div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 12px;
}

.print-customer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
  padding: 16px 4px;
  font-size: 13px;
}

.print-customer .full {
  grid-column: 1 / -1;
}

.print-table {
  width: 100%;
  border-collapse: collapse;
  white-space: normal;
}

.print-table th,
.print-table td {
  padding: 9px 7px;
  border: 1px solid #222;
  color: #111;
  background: #fff;
  text-align: center;
  font-size: 12px;
}

.print-table th:nth-child(2),
.print-table td:nth-child(2) {
  text-align: left;
}

.print-table tfoot td {
  font-weight: 750;
}

.print-money {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  margin-top: 14px;
  border: 1px solid #222;
}

.print-money > div {
  padding: 10px 7px;
  border-right: 1px solid #222;
  text-align: center;
}

.print-money > div:last-child {
  border-right: 0;
}

.print-money span,
.print-money strong {
  display: block;
}

.print-money span {
  margin-bottom: 5px;
  font-size: 11px;
}

.print-money strong {
  font-size: 13px;
}

.print-money .total {
  color: #a22e2e;
}

.print-note {
  min-height: 70px;
  padding: 14px 4px;
  font-size: 13px;
}

.print-footer {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding-top: 16px;
  border-top: 1px solid #222;
  font-size: 13px;
}

.audit-grid {
  display: grid;
  gap: 15px;
}

.audit-card {
  padding: 18px;
  border: 1px solid #e0e8e2;
  border-radius: 15px;
  background: #fff;
}

.audit-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.audit-photo-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 9px;
  margin: 14px 0;
}

.audit-photo {
  min-height: 82px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #557062;
  background: #edf4ef;
  text-align: center;
  font-size: 12px;
}

.mobile-overlay {
  display: none;
}

@media (max-width: 1280px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .cards-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 960px) {
  .app-shell {
    display: block;
  }

  .sidebar {
    position: fixed;
    left: 0;
    z-index: 40;
    width: 250px;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .mobile-overlay {
    position: fixed;
    inset: 0;
    z-index: 35;
    display: block;
    background: rgba(12, 28, 18, 0.45);
  }

  .menu-toggle {
    display: inline-grid;
  }

  .content {
    padding: 22px 18px 42px;
  }

  .topbar {
    padding: 0 18px;
  }

  .dashboard-grid,
  .sale-layout {
    grid-template-columns: 1fr;
  }

  .customer-selector {
    order: 0;
  }

  .sale-editor {
    order: 1;
  }
}

@media (max-width: 680px) {
  .login-page {
    padding: 0;
  }

  .login-card {
    min-height: 100vh;
    grid-template-columns: 1fr;
    border-radius: 0;
  }

  .login-brand {
    min-height: auto;
    padding: 34px 24px;
  }

  .login-brand h1 {
    margin-top: 20px;
    font-size: 31px;
  }

  .login-brand p {
    font-size: 15px;
  }

  .login-points {
    margin-top: 25px;
  }

  .login-form {
    padding: 32px 24px 46px;
  }

  .connection-status {
    display: none;
  }

  .topbar h1 {
    font-size: 18px;
  }

  .page-head {
    align-items: stretch;
    flex-direction: column;
  }

  .page-head .button {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .stat-card {
    padding: 14px;
  }

  .stat-value {
    font-size: 22px;
  }

  .cards-grid,
  .product-picker {
    grid-template-columns: 1fr;
  }

  .product-card {
    grid-template-columns: 82px minmax(0, 1fr);
  }

  .toolbar > .button,
  .toolbar > select,
  .toolbar > input[type="date"] {
    flex: 1;
  }

  .row-actions {
    width: 100%;
  }

  .sale-line {
    grid-template-columns: 1fr 76px;
    padding: 13px 0;
  }

  .sale-line > :first-child {
    grid-column: 1 / -1;
  }

  .sale-line .icon-button {
    position: absolute;
    right: 0;
  }

  .sale-summary {
    grid-template-columns: 1fr;
  }

  .sale-total {
    min-width: 0;
  }

  .sale-buttons {
    grid-template-columns: 1fr;
  }

  .form-grid,
  .detail-grid,
  .upload-grid {
    grid-template-columns: 1fr;
  }

  .upload-box p {
    min-height: 0;
  }

  .modal-backdrop {
    align-items: end;
    padding: 0;
  }

  .modal {
    width: 100%;
    max-height: 94vh;
    border-radius: 19px 19px 0 0;
  }

  .modal-body {
    padding: 16px;
  }

  .audit-photo-row {
    grid-template-columns: 1fr;
  }

  .print-modal {
    align-items: flex-start;
    overflow-y: auto;
  }

  .print-preview {
    width: 100%;
    max-height: none;
    padding: 10px;
    border-radius: 0;
  }

  .sales-print-sheet {
    min-height: 0;
    padding: 24px 18px;
  }

  .print-title h1 {
    font-size: 19px;
  }

  .print-title div,
  .print-customer,
  .print-footer {
    flex-direction: column;
    grid-template-columns: 1fr;
  }

  .print-customer .full {
    grid-column: auto;
  }

  .print-money {
    grid-template-columns: repeat(2, 1fr);
  }

  .print-money > div {
    border-bottom: 1px solid #222;
  }

  .print-table {
    min-width: 640px;
  }

  .card-actions {
    flex-direction: column;
  }
}

@media print {
  .sidebar,
  .topbar,
  .page-head,
  .toolbar,
  .button,
  .icon-button,
  .modal-backdrop:not(.print-modal) {
    display: none !important;
  }

  @page {
    size: A4 portrait;
    margin: 10mm;
  }

  body {
    background: #fff;
  }

  .app-shell {
    display: none !important;
  }

  .print-modal {
    position: static;
    display: block !important;
    padding: 0;
    background: #fff;
  }

  .print-preview {
    width: 100%;
    max-height: none;
    overflow: visible;
    padding: 0;
    background: #fff;
  }

  .print-toolbar {
    display: none !important;
  }

  .sales-print-sheet {
    width: 100%;
    min-height: 0;
    padding: 0;
    box-shadow: none;
  }

  .content {
    padding: 0;
  }

  .panel,
  .order-card {
    border: 0;
    box-shadow: none;
  }
}
