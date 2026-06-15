import React, { useState } from "react";
import {
  Archive,
  Bell,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Copy,
  CreditCard,
  FileImage,
  FilePlus2,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PackageCheck,
  Phone,
  Plus,
  Printer,
  Search,
  Settings,
  ShoppingCart,
  Tags,
  Truck,
  Upload,
  Users,
  Warehouse,
  X
} from "lucide-react";
import {
  categories as initialCategories,
  customers as initialCustomers,
  orders as initialOrders,
  products as initialProducts
} from "./data/demo";
import { supabaseEnabled } from "./lib/supabase";
import {
  createSalesOrder,
  createEmployee,
  getCurrentProfile,
  loadWorkspace,
  saveCategory,
  saveCategoryOrder,
  saveCustomer,
  saveProduct,
  setCategoryActive,
  setEmployeeActive,
  setProductActive,
  signIn,
  registerCustomerPayment,
  recordOrderPrint,
  uploadProductImage
} from "./lib/repository";

const initialCategoryRecords = initialCategories.map((name, index) => ({
  id: index + 1,
  name,
  sortOrder: index + 1,
  active: true
}));

const money = value =>
  `¥${Number(value || 0).toLocaleString("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;

const statusTone = status => {
  if (status === "待发货") return "pending";
  if (status === "退回重发") return "rejected";
  if (status.includes("待核查")) return "audit";
  return "done";
};

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async event => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await onLogin(null, { email, password });
    } catch (loginError) {
      setError(loginError.message || "登录失败，请检查账号和密码");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <section className="login-brand">
          <div className="brand-mark">博</div>
          <h1>博艺通节水灌溉进销存系统</h1>
          <p>开单快、发货快、查单快、查欠款快。电脑和手机浏览器都能使用。</p>
          <div className="login-points">
            <div className="login-point">销售开单</div>
            <div className="login-point">库存预警</div>
            <div className="login-point">员工发货</div>
            <div className="login-point">老板核查</div>
          </div>
        </section>
        <section className="login-form">
          {supabaseEnabled ? (
            <form onSubmit={submit}>
              <h2>账号登录</h2>
              <p>使用老板或员工账号登录</p>
              <div className="field">
                <label>登录账号</label>
                <input required value={email} onChange={event => setEmail(event.target.value)} placeholder="老板可用邮箱，员工输入登录账号" />
              </div>
              <div className="field" style={{ marginTop: 14 }}>
                <label>登录密码</label>
                <input type="password" required value={password} onChange={event => setPassword(event.target.value)} />
              </div>
              {error && <div className="alert" style={{ marginTop: 14 }}>{error}</div>}
              <button className="button" style={{ width: "100%", marginTop: 18 }} disabled={busy}>
                {busy ? "正在登录..." : "登录系统"}
              </button>
            </form>
          ) : (
            <>
              <h2>选择演示身份</h2>
              <p>先体验老板端和员工发货流程</p>
              <div className="role-grid">
                <button className="role-button active" onClick={() => onLogin("admin")}>
                  <Settings size={24} />
                  <div>
                    <strong>管理员（老板）</strong>
                    <span>开单、库存、欠款、发货核查和员工管理</span>
                  </div>
                </button>
                <button className="role-button" onClick={() => onLogin("employee")}>
                  <Truck size={24} />
                  <div>
                    <strong>仓库员工</strong>
                    <span>查看待发货订单、上传照片、完成发货</span>
                  </div>
                </button>
              </div>
              <div className="demo-tip">当前使用演示数据。配置 Supabase 环境变量后会自动切换为账号登录。</div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function App() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState(initialProducts);
  const [customers, setCustomers] = useState(initialCustomers);
  const [orders, setOrders] = useState(initialOrders);
  const [payments, setPayments] = useState([]);
  const [staff, setStaff] = useState([
    { id: "demo-1", name: "李师傅", loginAccount: "lisi", phone: "13800000001", role: "employee", active: true, createdAt: "2026-06-15" },
    { id: "demo-2", name: "张师傅", loginAccount: "zhangshi", phone: "13800000002", role: "employee", active: true, createdAt: "2026-06-15" }
  ]);
  const [categories, setCategories] = useState(initialCategoryRecords);
  const [profile, setProfile] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [salesDraft, setSalesDraft] = useState(null);
  const [printOrder, setPrintOrder] = useState(null);
  const [paymentCustomer, setPaymentCustomer] = useState(null);
  const [employeeModal, setEmployeeModal] = useState(false);

  const adminNav = [
    ["dashboard", LayoutDashboard, "老板首页"],
    ["sales", FilePlus2, "销售开单"],
    ["orders", ShoppingCart, "销售订单"],
    ["shipping", Truck, "发货管理"],
    ["audit", ClipboardCheck, "发货核查"],
    ["products", Boxes, "产品管理"],
    ["inventory", Warehouse, "库存管理"],
    ["customers", Users, "客户管理"],
    ["debt", CreditCard, "欠款管理"],
    ["images", FileImage, "图片档案"],
    ["categories", Tags, "分类管理"],
    ["staff", Settings, "员工管理"]
  ];
  const nav = role === "admin" ? adminNav : [["shipping", Truck, "待发货订单"]];
  const currentTitle = nav.find(item => item[0] === page)?.[2] || "待发货订单";

  const login = async (nextRole, credentials) => {
    let resolvedRole = nextRole;
    if (supabaseEnabled) {
      await signIn(credentials.email, credentials.password);
      const profile = await getCurrentProfile();
      const workspace = await loadWorkspace(profile.role);
      resolvedRole = profile.role;
      setProfile(profile);
      setCategories(workspace.categories);
      setProducts(workspace.products);
      setCustomers(workspace.customers);
      setOrders(workspace.orders);
      setPayments(workspace.payments || []);
      setStaff(workspace.staff || []);
    }
    setRole(resolvedRole);
    setPage(resolvedRole === "admin" ? "dashboard" : "shipping");
  };

  const openPage = nextPage => {
    setPage(nextPage);
    setMenuOpen(false);
  };

  const patchOrder = (id, patch) => {
    setOrders(current => current.map(order => (order.id === id ? { ...order, ...patch } : order)));
    setSelectedOrder(current => (current?.id === id ? { ...current, ...patch } : current));
  };

  if (!role) return <Login onLogin={login} />;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">博</div>
          <div>
            <strong>博艺通节水灌溉</strong>
            <small>进销存系统 V2 第二阶段</small>
          </div>
        </div>
        <nav className="nav-list">
          {nav.map(([id, Icon, label]) => (
            <button
              key={id}
              className={`nav-button ${page === id ? "active" : ""}`}
              onClick={() => openPage(id)}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <strong>{role === "admin" ? "老板账号" : (profile?.display_name || "仓库员工")}</strong>
          <small>{role === "admin" ? "管理员" : "仓库员工"}</small>
          <button className="nav-button" onClick={() => setRole(null)}>
            <LogOut size={17} />
            退出登录
          </button>
        </div>
      </aside>

      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="icon-button menu-toggle" onClick={() => setMenuOpen(true)}>
            <Menu size={20} />
          </button>
          <h1>{currentTitle}</h1>
          <div className="topbar-spacer" />
          <span className="connection-status">
            <i className={`status-dot ${supabaseEnabled ? "online" : ""}`} />
            {supabaseEnabled ? "正式数据库" : "演示数据"}
          </span>
          <button className="icon-button" title="提醒">
            <Bell size={19} />
          </button>
        </header>

        <div className="content">
          {page === "dashboard" && (
            <Dashboard orders={orders} products={products} customers={customers} onPage={openPage} />
          )}
          {page === "sales" && (
            <SalesPage
              customers={customers}
              products={products}
              orders={orders}
              draft={salesDraft}
              onDraftUsed={() => setSalesDraft(null)}
              onPrint={setPrintOrder}
              onSave={async (order, changes) => {
                let savedOrder = order;
                if (supabaseEnabled) {
                  const result = await createSalesOrder(order);
                  savedOrder = {
                    ...order,
                    id: result.id,
                    no: result.order_no,
                    amount: Number(result.amount),
                    paid: Number(result.paid_amount),
                    unpaid: Number(result.unpaid_amount),
                    paymentStatus: result.payment_status
                  };
                }
                setOrders(current => [savedOrder, ...current]);
                setCustomers(current => current.map(customer =>
                  customer.id === savedOrder.customerId
                    ? { ...customer, debt: customer.debt + savedOrder.amount - savedOrder.paid }
                    : customer
                ));
                if (savedOrder.paid > 0) {
                  setPayments(current => [{
                    id: Date.now(),
                    customerId: savedOrder.customerId,
                    customer: savedOrder.customer,
                    orderId: savedOrder.id,
                    amount: savedOrder.paid,
                    method: "其他",
                    note: "开单时收款",
                    receivedAt: savedOrder.createdAt
                  }, ...current]);
                }
                setProducts(current =>
                  current.map(product => ({
                    ...product,
                    stock: product.stock - (changes[product.id] || 0)
                  }))
                );
                openPage("orders");
                return savedOrder;
              }}
            />
          )}
          {page === "orders" && (
            <OrdersPage
              orders={orders}
              onOpen={setSelectedOrder}
              onPrint={setPrintOrder}
              onCopy={order => {
                setSalesDraft(order);
                openPage("sales");
              }}
            />
          )}
          {page === "shipping" && (
            <ShippingPage orders={orders} products={products} onOpen={setSelectedOrder} role={role} />
          )}
          {page === "audit" && (
            <AuditPage
              orders={orders}
              onOpen={setSelectedOrder}
              onPass={order => patchOrder(order.id, { status: "核查通过" })}
              onReject={order =>
                patchOrder(order.id, { status: "退回重发", rejectReason: "照片不清楚" })
              }
            />
          )}
          {page === "products" && (
            <ProductsPage
              products={products}
              categories={categories}
              onAdd={() => setEditingProduct({})}
              onEdit={setEditingProduct}
              onToggle={async product => {
                if (supabaseEnabled) await setProductActive(product.id, !product.active);
                setProducts(current => current.map(item => item.id === product.id ? { ...item, active: !item.active } : item));
              }}
            />
          )}
          {page === "inventory" && (
            <InventoryPage
              products={products}
              onAdjust={(id, stock) =>
                setProducts(current =>
                  current.map(product => (product.id === id ? { ...product, stock } : product))
                )
              }
            />
          )}
          {page === "customers" && (
            <CustomersPage
              customers={customers}
              orders={orders}
              onAdd={() => setEditingCustomer({})}
              onEdit={setEditingCustomer}
              onOpen={setSelectedCustomer}
              onCopyOrder={order => {
                setSalesDraft(order);
                setSelectedCustomer(null);
                openPage("sales");
              }}
            />
          )}
          {page === "debt" && (
            <DebtPage
              customers={customers}
              orders={orders}
              payments={payments}
              onRegister={setPaymentCustomer}
            />
          )}
          {page === "images" && <ImageArchive orders={orders} onOpen={setSelectedOrder} />}
          {page === "categories" && (
            <CategoryPage
              categories={categories}
              products={products}
              onAdd={() => setEditingCategory({})}
              onEdit={setEditingCategory}
              onToggle={async category => {
                if (supabaseEnabled) await setCategoryActive(category.id, !category.active);
                setCategories(current => current.map(item => item.id === category.id ? { ...item, active: !item.active } : item));
              }}
              onMove={async (category, direction) => {
                const index = categories.findIndex(item => item.id === category.id);
                const target = index + direction;
                if (target < 0 || target >= categories.length) return;
                const next = [...categories];
                [next[index], next[target]] = [next[target], next[index]];
                const reordered = next.map((item, itemIndex) => ({ ...item, sortOrder: itemIndex + 1 }));
                setCategories(reordered);
                if (supabaseEnabled) await saveCategoryOrder(reordered);
              }}
            />
          )}
          {page === "staff" && (
            <StaffPage
              staff={staff}
              onAdd={() => setEmployeeModal(true)}
              onToggle={async employee => {
                try {
                  if (supabaseEnabled) await setEmployeeActive(employee.id, !employee.active);
                  setStaff(current => current.map(item =>
                    item.id === employee.id ? { ...item, active: !item.active } : item
                  ));
                } catch (error) {
                  window.alert(error.message || "修改员工状态失败");
                }
              }}
            />
          )}
        </div>
      </main>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          products={products}
          role={role}
          onClose={() => setSelectedOrder(null)}
          onPrint={setPrintOrder}
          onUpload={(kind, count) => {
            const limit = kind === "sales" ? 5 : kind === "logistics" ? 3 : Infinity;
            const nextCount = Math.min(selectedOrder.images[kind] + count, limit);
            patchOrder(selectedOrder.id, {
              images: { ...selectedOrder.images, [kind]: nextCount }
            });
          }}
          onShip={() => {
            const current = orders.find(order => order.id === selectedOrder.id);
            if (!current.images.sales || !current.images.logistics) {
              window.alert("销售单照片和物流单照片为必传资料，请补充后再完成发货。");
              return;
            }
            patchOrder(current.id, {
              status: "已发货（待核查）",
              shipper: "李师傅",
              shippedAt: new Date().toLocaleString("zh-CN")
            });
          }}
        />
      )}

      {editingProduct && (
        <ProductModal
          categories={categories}
          product={editingProduct.id ? editingProduct : null}
          onClose={() => setEditingProduct(null)}
          onSave={async (product, imageFile) => {
            let imagePath = product.imagePath;
            if (supabaseEnabled && imageFile) {
              imagePath = await uploadProductImage({ userId: profile.id, file: imageFile });
            } else if (imageFile) {
              imagePath = URL.createObjectURL(imageFile);
            }
            const payload = { ...product, imagePath };
            const saved = supabaseEnabled
              ? await saveProduct(payload)
              : { ...payload, id: payload.id || Date.now() };
            setProducts(current => saved.id && current.some(item => item.id === saved.id)
              ? current.map(item => item.id === saved.id ? saved : item)
              : [...current, saved]);
            setEditingProduct(null);
          }}
        />
      )}
      {editingCategory && (
        <CategoryModal
          category={editingCategory.id ? editingCategory : null}
          nextOrder={categories.length + 1}
          onClose={() => setEditingCategory(null)}
          onSave={async category => {
            if (categories.some(item => item.id !== category.id && item.name.trim() === category.name.trim())) {
              window.alert("分类名称已存在，请换一个名称。");
              return;
            }
            const saved = supabaseEnabled
              ? await saveCategory(category)
              : { ...category, id: category.id || Date.now() };
            setCategories(current => current.some(item => item.id === saved.id)
              ? current.map(item => item.id === saved.id ? saved : item)
              : [...current, saved]);
            setEditingCategory(null);
          }}
        />
      )}
      {editingCustomer && (
        <CustomerModal
          customer={editingCustomer.id ? editingCustomer : null}
          onClose={() => setEditingCustomer(null)}
          onSave={async customer => {
            const saved = supabaseEnabled
              ? await saveCustomer(customer)
              : { ...customer, id: customer.id || Date.now(), debt: customer.debt || 0 };
            setCustomers(current => current.some(item => item.id === saved.id)
              ? current.map(item => item.id === saved.id ? saved : item)
              : [...current, saved]);
            setEditingCustomer(null);
          }}
        />
      )}
      {selectedCustomer && (
        <CustomerDetail
          customer={selectedCustomer}
          orders={orders.filter(order => order.customerId === selectedCustomer.id)}
          onClose={() => setSelectedCustomer(null)}
          onCopyOrder={order => {
            setSalesDraft(order);
            setSelectedCustomer(null);
            openPage("sales");
          }}
        />
      )}
      {paymentCustomer && (
        <PaymentModal
          customer={paymentCustomer}
          onClose={() => setPaymentCustomer(null)}
          onSave={async payment => {
            if (supabaseEnabled) await registerCustomerPayment(payment);
            setOrders(current => {
              let remaining = payment.amount;
              const allocations = new Map();
              [...current]
                .filter(order => order.customerId === payment.customerId && order.status !== "已作废")
                .sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)))
                .forEach(order => {
                  if (remaining <= 0) return;
                  const unpaid = Number(order.unpaid ?? (order.amount - order.paid));
                  if (unpaid <= 0) return;
                  const allocation = Math.min(remaining, unpaid);
                  allocations.set(order.id, allocation);
                  remaining -= allocation;
                });
              return current.map(order => {
                const allocation = allocations.get(order.id);
                if (!allocation) return order;
                const unpaid = Number(order.unpaid ?? (order.amount - order.paid));
                const nextPaid = Number(order.paid) + allocation;
                const nextUnpaid = unpaid - allocation;
                return {
                  ...order,
                  paid: nextPaid,
                  unpaid: nextUnpaid,
                  paymentStatus: nextUnpaid === 0 ? "已收款" : "部分收款"
                };
              });
            });
            setCustomers(current => current.map(customer =>
              customer.id === payment.customerId
                ? { ...customer, debt: customer.debt - payment.amount }
                : customer
            ));
            setPayments(current => [{
              ...payment,
              id: Date.now(),
              customer: paymentCustomer.name,
              receivedAt: new Date().toLocaleString("zh-CN")
            }, ...current]);
            setPaymentCustomer(null);
          }}
        />
      )}
      {printOrder && (
        <SalesPrintModal
          order={printOrder}
          onClose={() => setPrintOrder(null)}
          onPrinted={async () => {
            if (supabaseEnabled) await recordOrderPrint(printOrder.id);
          }}
        />
      )}
      {employeeModal && (
        <EmployeeModal
          onClose={() => setEmployeeModal(false)}
          onSave={async employee => {
            const saved = supabaseEnabled
              ? await createEmployee(employee)
              : { ...employee, id: `demo-${Date.now()}`, role: "employee", createdAt: new Date().toLocaleString("zh-CN") };
            setStaff(current => [saved, ...current]);
            setEmployeeModal(false);
          }}
        />
      )}
    </div>
  );
}

function Dashboard({ orders, products, customers, onPage }) {
  const todayOrders = orders.filter(order => order.createdAt.startsWith("2026-06-15"));
  const stats = [
    ["今日订单", todayOrders.length, ShoppingCart, "orders"],
    ["今日销售额", money(todayOrders.reduce((sum, order) => sum + order.amount, 0)), CreditCard, "orders"],
    ["待发货订单", orders.filter(order => ["待发货", "退回重发"].includes(order.status)).length, Truck, "shipping"],
    ["待核查订单", orders.filter(order => order.status.includes("待核查")).length, ClipboardCheck, "audit"],
    ["库存预警", products.filter(product => product.stock <= product.warning).length, Boxes, "inventory"],
    ["欠款客户", customers.filter(customer => customer.debt > 0).length, Users, "debt"]
  ];

  return (
    <>
      <div className="page-head">
        <div>
          <h2>今天的生意，一眼看清</h2>
          <p>优先处理待发货、待核查和库存预警。</p>
        </div>
        <button className="button" onClick={() => onPage("sales")}>
          <Plus size={18} />
          快速开单
        </button>
      </div>
      <div className="stats-grid">
        {stats.map(([label, value, Icon, target]) => (
          <button className="stat-card" key={label} onClick={() => onPage(target)}>
            <div className="stat-card-head">
              <span>{label}</span>
              <span className="stat-icon"><Icon size={18} /></span>
            </div>
            <div className="stat-value">{value}</div>
          </button>
        ))}
      </div>
      <div className="dashboard-grid">
        <Panel title="待办提醒">
          <div className="todo-list">
            <Todo icon={Truck} title="待发货订单" text="仓库员工按图片配货并上传凭证" count={stats[2][1]} onClick={() => onPage("shipping")} />
            <Todo icon={ClipboardCheck} title="待核查订单" text="老板核对销售单、发货和物流照片" count={stats[3][1]} onClick={() => onPage("audit")} />
            <Todo icon={Boxes} title="库存预警" text="库存低于预警值，需要及时补货" count={stats[4][1]} onClick={() => onPage("inventory")} />
          </div>
        </Panel>
        <Panel title="最近订单">
          <div className="todo-list">
            {orders.slice(0, 3).map(order => (
              <div className="todo-item" key={order.id}>
                <span className="stat-icon"><ShoppingCart size={17} /></span>
                <div>
                  <strong>{order.customer}</strong>
                  <span>{order.no} · {money(order.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}

function Todo({ icon: Icon, title, text, count, onClick }) {
  return (
    <button className="todo-item" onClick={onClick}>
      <span className="stat-icon"><Icon size={18} /></span>
      <div>
        <strong>{title}：{count}</strong>
        <span>{text}</span>
      </div>
      <ChevronRight size={18} />
    </button>
  );
}

function SalesPage({ customers, products, orders, draft, onDraftUsed, onSave, onPrint }) {
  const [customerId, setCustomerId] = useState(draft ? String(draft.customerId) : "");
  const [customerQuery, setCustomerQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [lines, setLines] = useState(() => {
    if (!draft) return [];
    return draft.items.map(item => {
      const product = products.find(candidate => candidate.id === item.productId);
      return {
        productId: item.productId,
        name: item.name,
        spec: item.spec,
        qty: item.qty,
        price: product?.price ?? item.price,
        imagePath: product?.imagePath || item.imagePath || ""
      };
    });
  });
  const [note, setNote] = useState(draft ? `复制自销售单 ${draft.no}` : "");
  const [paid, setPaid] = useState(0);
  const [saving, setSaving] = useState(false);
  const [priceWarnings, setPriceWarnings] = useState([]);
  const [pendingMode, setPendingMode] = useState("save");
  const customer = customers.find(item => item.id === Number(customerId));
  const total = lines.reduce((sum, line) => sum + line.qty * line.price, 0);

  const getHistory = productId => {
    if (!customer) return null;
    const purchases = orders
      .filter(order => order.customerId === customer.id && order.status !== "已作废")
      .flatMap(order =>
        order.items
          .filter(item => item.productId === productId)
          .map(item => ({ ...item, date: order.createdAt, orderId: order.id }))
      )
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));
    if (!purchases.length) return null;
    return {
      lastPrice: purchases[0].price,
      lastDate: purchases[0].date.split(" ")[0],
      purchaseCount: purchases.length,
      totalQuantity: purchases.reduce((sum, item) => sum + Number(item.qty), 0)
    };
  };

  const addProduct = product => {
    if (lines.some(line => line.productId === product.id)) return;
    setLines(current => [
      ...current,
      {
        productId: product.id,
        name: product.name,
        spec: product.spec,
        qty: 1,
        price: product.price,
        imagePath: product.imagePath || ""
      }
    ]);
  };

  const updateLine = (id, key, value) => {
    setLines(current =>
      current.map(line => (line.productId === id ? { ...line, [key]: Number(value) } : line))
    );
  };

  const save = async (mode = "save", priceConfirmed = false) => {
    if (!customer || lines.length === 0) {
      window.alert("请先选择客户并添加产品。");
      return;
    }
    const invalidStock = lines.find(line => {
      const product = products.find(item => item.id === line.productId);
      return !product || line.qty > product.stock;
    });
    if (invalidStock) {
      window.alert(`${invalidStock.name} 库存不足，请修改数量后再保存。`);
      return;
    }
    if (paid < 0 || paid > total) {
      window.alert("本次已收款不能小于0或超过本单金额。");
      return;
    }
    const changedPrices = lines
      .map(line => ({ line, history: getHistory(line.productId) }))
      .filter(item => item.history && Number(item.line.price) !== Number(item.history.lastPrice));
    if (changedPrices.length && !priceConfirmed) {
      setPriceWarnings(changedPrices);
      setPendingMode(mode);
      return;
    }

    const suffix = String(Date.now()).slice(-4);
    setSaving(true);
    try {
      const savedOrder = await onSave({
        id: Date.now(),
        no: `BYT20260615-${suffix}`,
        customerId: customer.id,
        customer: customer.name,
        phone: customer.phone,
        address: customer.address,
        status: "待发货",
        amount: total,
        paid: Number(paid),
        unpaid: total - Number(paid),
        paymentStatus: paid >= total ? "已收款" : paid > 0 ? "部分收款" : "未收款",
        previousDebt: customer.debt,
        createdAt: "2026-06-15 15:20",
        creator: "老板",
        note,
        priceConfirmed: changedPrices.length > 0 && priceConfirmed,
        items: lines,
        images: { sales: 0, shipping: 0, logistics: 0 }
      }, Object.fromEntries(lines.map(line => [line.productId, line.qty])));
      onDraftUsed?.();
      if (mode === "print") onPrint(savedOrder);
    } catch (error) {
      window.alert(error.message || "销售单保存失败，请重试。");
    } finally {
      setSaving(false);
    }
  };

  const visibleCustomers = customers.filter(item =>
    `${item.name}${item.phone}`.includes(customerQuery)
  );
  const visibleProducts = products.filter(item => item.active !== false &&
    `${item.name}${item.spec}`.includes(productQuery)
  );

  return (
    <>
      <div className="page-head">
        <div>
          <h2>快速销售开单</h2>
          <p>选择客户和产品，输入数量，系统自动计算金额并扣减库存。</p>
        </div>
      </div>
      <div className="sale-layout">
        <section className="customer-selector">
          <div className="section-title">1. 选择客户</div>
          <div className="section-content">
            <SearchInput value={customerQuery} onChange={setCustomerQuery} placeholder="搜索客户或电话" />
            <div className="choice-list">
              {visibleCustomers.map(item => (
                <button
                  className={`choice-item ${Number(customerId) === item.id ? "active" : ""}`}
                  key={item.id}
                  onClick={() => setCustomerId(String(item.id))}
                >
                  <strong>{item.name}</strong>
                  <span>{item.phone} · 欠款 {money(item.debt)}</span>
                </button>
              ))}
            </div>
            {customer && (
              <div className="selected-customer">
                <strong>{customer.name}</strong>
                <span>{customer.phone}</span>
                <span>{customer.address}</span>
                <span>客户标签：{customer.tag}</span>
                <span>最近订单：{orders.filter(order => order.customerId === customer.id).slice(0, 3).map(order => order.no).join("、") || "暂无"}</span>
              </div>
            )}
          </div>
        </section>

        <section className="sale-editor">
          <div className="section-title">2. 添加产品与数量</div>
          <div className="section-content">
            <SearchInput value={productQuery} onChange={setProductQuery} placeholder="搜索产品名称或规格" />
            <div className="product-picker">
              {visibleProducts.map(product => (
                <button className="picker-item" key={product.id} onClick={() => addProduct(product)}>
                  <ProductImage product={product} compact />
                  <strong>{product.name}</strong>
                  <span>{product.spec} · 库存 {product.stock}</span>
                </button>
              ))}
            </div>
            <div className="sale-lines">
              {lines.map(line => (
                <div className="sale-line" key={line.productId}>
                  <div>
                    <strong>{line.name} · {line.spec}</strong>
                    {(() => {
                      const history = getHistory(line.productId);
                      if (!history) return <div className="history-price">首次购买（0次记录）</div>;
                      return (
                        <div className={`history-price ${Number(line.price) !== Number(history.lastPrice) ? "warning" : ""}`}>
                          最近成交价 {money(history.lastPrice)} · 最近成交日期 {history.lastDate} ·
                          购买次数 {history.purchaseCount}次 · 累计购买数量 {history.totalQuantity}
                        </div>
                      );
                    })()}
                  </div>
                  <input type="number" min="1" value={line.qty} onChange={event => updateLine(line.productId, "qty", event.target.value)} title="数量" />
                  <input type="number" min="0" step="0.01" value={line.price} onChange={event => updateLine(line.productId, "price", event.target.value)} title="单价" />
                  <strong>{money(line.qty * line.price)}</strong>
                  <button className="icon-button" onClick={() => setLines(current => current.filter(item => item.productId !== line.productId))}>
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="sale-summary">
              <div className="field">
                <label>订单备注</label>
                <textarea value={note} onChange={event => setNote(event.target.value)} placeholder="例如：下午发货、改发顺丰、加急" />
              </div>
              <div className="sale-total">
                <div className="sale-total-line"><span>产品种类</span><strong>{lines.length}</strong></div>
                <div className="sale-total-line"><span>上期欠款</span><strong>{money(customer?.debt)}</strong></div>
                <div className="sale-total-line paid-input"><span>本次已收</span><input type="number" min="0" max={total} value={paid} onChange={event => setPaid(Number(event.target.value))} /></div>
                <div className="sale-total-line"><span>本期欠款</span><strong>{money(Math.max(total - paid, 0))}</strong></div>
                <div className="sale-total-line grand"><span>本单应收</span><strong>{money(total)}</strong></div>
                <div className="sale-buttons">
                  <button className="button secondary" onClick={() => save("save")} disabled={saving}>仅保存</button>
                  <button className="button" onClick={() => save("print")} disabled={saving}>{saving ? "正在保存..." : "保存并打印"}</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {priceWarnings.length > 0 && (
        <PriceConfirmModal
          warnings={priceWarnings}
          onCancel={() => setPriceWarnings([])}
          onConfirm={() => {
            setPriceWarnings([]);
            save(pendingMode, true);
          }}
        />
      )}
    </>
  );
}

function OrdersPage({ orders, onOpen, onCopy, onPrint }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const filtered = orders.filter(order =>
    `${order.no}${order.customer}${order.phone}`.includes(query) &&
    (!status || order.status === status) &&
    (!date || order.createdAt.startsWith(date))
  );
  return (
    <>
      <PageTitle title="销售订单" text="搜索客户、电话或销售单号，查看完整历史记录。" />
      <div className="toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="搜索客户、电话或销售单号" />
        <select value={status} onChange={event => setStatus(event.target.value)}>
          <option value="">全部状态</option>
          {["待发货", "已发货（待核查）", "核查通过", "退回重发", "已作废"].map(item => <option key={item}>{item}</option>)}
        </select>
        <input type="date" value={date} onChange={event => setDate(event.target.value)} />
      </div>
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="table-wrap">
          <table>
            <thead><tr><th>销售单号</th><th>客户</th><th>金额</th><th>未收款</th><th>付款状态</th><th>发货状态</th><th>开单时间</th><th>操作</th></tr></thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id}>
                  <td>{order.no}</td>
                  <td>{order.customer}</td>
                  <td>{money(order.amount)}</td>
                  <td>{money(order.unpaid ?? order.amount - order.paid)}</td>
                  <td>{order.paymentStatus || (order.paid > 0 ? "部分收款" : "未收款")}</td>
                  <td><Status status={order.status} /></td>
                  <td>{order.createdAt}</td>
                  <td>
                    <div className="row-actions">
                      <button className="button secondary" onClick={() => onOpen(order)}>查看</button>
                      <button className="button secondary" onClick={() => onCopy(order)}>复制订单</button>
                      <button className="button secondary" onClick={() => onPrint(order)}><Printer size={14} />打印</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function ShippingPage({ orders, products, onOpen, role }) {
  const waiting = orders.filter(order => ["待发货", "退回重发"].includes(order.status));
  return (
    <>
      <PageTitle
        title={role === "employee" ? "待发货订单" : "仓库发货中心"}
        text="按产品和规格配货，上传销售单、发货及物流照片。"
      />
      <div className="cards-grid">
        {waiting.map(order => (
          <article className="order-card" key={order.id}>
            <div className="order-card-top">
              <div><h3>{order.customer}</h3><span className="order-number">{order.no}</span></div>
              <Status status={order.status} />
            </div>
            <div className="info-list">
              <div className="info-line"><Phone size={15} />{order.phone}</div>
              <div className="info-line"><Package size={15} />{order.address}</div>
            </div>
            <div className="order-items">
              {order.items.map(item => (
                <div className="shipping-item" key={item.productId}>
                  <ProductImage product={{ ...item, imagePath: products.find(product => product.id === item.productId)?.imagePath || item.imagePath }} compact />
                  <span>{item.name} {item.spec}</span>
                  <strong>× {item.qty}</strong>
                </div>
              ))}
            </div>
            {order.rejectReason && <div className="alert">退回原因：{order.rejectReason}</div>}
            <PhotoCounts images={order.images} />
            <div className="card-actions">
              <button className="button" onClick={() => onOpen(order)}>
                开始发货 <ChevronRight size={17} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {waiting.length === 0 && <Empty text="当前没有待发货订单" />}
    </>
  );
}

function AuditPage({ orders, onOpen, onPass, onReject }) {
  const pending = orders.filter(order => order.status.includes("待核查"));
  return (
    <>
      <PageTitle title="发货核查中心" text="核对销售单、发货照片、物流单和发货人员。" />
      <div className="audit-grid">
        {pending.map(order => (
          <article className="audit-card" key={order.id}>
            <div className="audit-head">
              <div>
                <h3>{order.customer}</h3>
                <span className="order-number">{order.no} · {order.shipper} · {order.shippedAt}</span>
              </div>
              <Status status={order.status} />
            </div>
            <div className="audit-photo-row">
              <div className="audit-photo">销售单照片 {order.images.sales} 张</div>
              <div className="audit-photo">发货照片 {order.images.shipping} 张</div>
              <div className="audit-photo">物流单照片 {order.images.logistics} 张</div>
            </div>
            <div className="card-actions">
              <button className="button secondary" onClick={() => onOpen(order)}>查看档案</button>
              <button className="button danger" onClick={() => onReject(order)}>退回重发</button>
              <button className="button" onClick={() => onPass(order)}>核查通过</button>
            </div>
          </article>
        ))}
      </div>
      {pending.length === 0 && <Empty text="当前没有待核查订单" />}
    </>
  );
}

function ProductsPage({ products, categories, onAdd, onEdit, onToggle }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("active");
  const filtered = products.filter(product =>
    (!category || product.category === category) &&
    (state === "all" || (state === "active" ? product.active !== false : product.active === false)) &&
    `${product.name}${product.spec}${product.note || ""}`.includes(query)
  );
  return (
    <>
      <PageTitle title="产品管理" text="产品只停用不删除，保留全部历史销售记录。" action={<button className="button" onClick={onAdd}><Plus size={17} />新增产品</button>} />
      <div className="toolbar">
        <SearchInput value={query} onChange={setQuery} placeholder="搜索产品名称或规格" />
        <select value={category} onChange={event => setCategory(event.target.value)}>
          <option value="">全部分类</option>
          {categories.filter(item => item.active).map(item => <option key={item.id} value={item.name}>{item.name}</option>)}
        </select>
        <select value={state} onChange={event => setState(event.target.value)}>
          <option value="active">使用中</option>
          <option value="inactive">已停用</option>
          <option value="all">全部产品</option>
        </select>
      </div>
      <div className="cards-grid">
        {filtered.map(product => (
          <article className="product-card" key={product.id}>
            <ProductImage product={product} />
            <div className="product-info">
              <h3>{product.name}</h3>
              <span className="muted">{product.spec} · {product.category}</span>
              {product.note && <p className="product-note">{product.note}</p>}
              <div className="product-meta">
                <span className="price">{money(product.price)}</span>
                <span className={`stock-pill ${product.stock <= product.warning ? "low" : "ok"}`}>库存 {product.stock}</span>
              </div>
              <div className="row-actions">
                <button className="button secondary" onClick={() => onEdit(product)}>修改</button>
                <button className={`button ${product.active === false ? "" : "secondary"}`} onClick={() => onToggle(product)}>
                  {product.active === false ? "恢复使用" : "停用"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function InventoryPage({ products, onAdjust }) {
  return (
    <>
      <PageTitle title="库存管理" text="销售开单后自动扣减库存，也可手工调整。" />
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>产品</th><th>分类</th><th>规格</th><th>库存状态</th><th>当前库存</th><th>预警值</th></tr></thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.spec}</td>
                  <td><span className={`stock-pill ${product.stock <= product.warning ? "low" : "ok"}`}>{product.stock <= product.warning ? "库存预警" : "库存正常"}</span></td>
                  <td><input type="number" defaultValue={product.stock} onBlur={event => onAdjust(product.id, Number(event.target.value))} /></td>
                  <td>{product.warning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function CustomersPage({ customers, orders, onAdd, onEdit, onOpen, onCopyOrder }) {
  const [query, setQuery] = useState("");
  const visible = customers.filter(customer =>
    customer.active !== false &&
    `${customer.name}${customer.contactName || ""}${customer.phone}${customer.address}`.includes(query)
  );
  return (
    <>
      <PageTitle title="客户管理" text="查看联系方式、最近订单、累计欠款和最近成交信息。" action={<button className="button" onClick={onAdd}><Plus size={17} />新增客户</button>} />
      <SearchInput value={query} onChange={setQuery} placeholder="搜索客户名称或电话" />
      <div className="cards-grid" style={{ marginTop: 16 }}>
        {visible.map(customer => (
          <article className="customer-card" key={customer.id}>
            <div className="customer-card-head">
              <h3>{customer.name}</h3>
              <span className={`tag ${customer.debt > 0 ? "debt" : "big"}`}>{customer.tag}</span>
            </div>
            <div className="info-list">
              <a className="info-line" href={`tel:${customer.phone}`}><Phone size={15} />{customer.phone}</a>
              <div className="info-line"><Package size={15} />{customer.address}</div>
            </div>
            <strong>累计欠款：{money(customer.debt)}</strong>
            <div className="customer-recent">
              最近订单：{orders.filter(order => order.customerId === customer.id).slice(0, 3).map(order => order.no).join("、") || "暂无"}
            </div>
            <div className="customer-actions">
              <button className="button secondary" onClick={() => navigator.clipboard?.writeText(customer.address)}><Copy size={15} />复制地址</button>
              <button className="button secondary" onClick={() => onEdit(customer)}>修改</button>
              <button className="button" onClick={() => onOpen(customer)}>客户详情</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function DebtPage({ customers, orders, payments, onRegister }) {
  const [query, setQuery] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const debtCustomers = customers.filter(customer =>
    customer.debt > 0 && `${customer.name}${customer.phone}`.includes(query)
  );
  const total = debtCustomers.reduce((sum, customer) => sum + customer.debt, 0);
  const today = new Date().toLocaleDateString("zh-CN");
  const todayReceived = payments
    .filter(payment => payment.receivedAt?.startsWith(today))
    .reduce((sum, payment) => sum + payment.amount, 0);
  const selectedCustomer = customers.find(customer => customer.id === selectedCustomerId);
  const customerOrders = orders.filter(order => order.customerId === selectedCustomerId && order.status !== "已作废");
  const customerPayments = payments.filter(payment => payment.customerId === selectedCustomerId);
  return (
    <>
      <PageTitle title="欠款管理" text="登记收款后自动更新客户累计欠款。" />
      <div className="stats-grid">
        <Stat label="欠款客户" value={`${debtCustomers.length} 家`} icon={Users} />
        <Stat label="累计欠款" value={money(total)} icon={CreditCard} />
        <Stat label="今日收款" value={money(todayReceived)} icon={CheckCircle2} />
      </div>
      <SearchInput value={query} onChange={setQuery} placeholder="搜索欠款客户或电话" />
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>客户</th><th>电话</th><th>上期欠款</th><th>本期欠款</th><th>已收款</th><th>未收款</th><th /></tr></thead>
            <tbody>
              {debtCustomers.map(customer => {
                const related = orders
                  .filter(order => order.customerId === customer.id && order.status !== "已作废")
                  .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
                const latest = related[0];
                const received = related.reduce((sum, order) => sum + Number(order.paid || 0), 0);
                const currentUnpaid = latest ? Number(latest.unpaid ?? latest.amount - latest.paid) : 0;
                const previous = latest ? Number(latest.previousDebt || 0) : customer.debt;
                return (
                  <tr key={customer.id}>
                    <td>{customer.name}</td>
                    <td>{customer.phone}</td>
                    <td>{money(previous)}</td>
                    <td>{money(currentUnpaid)}</td>
                    <td>{money(received)}</td>
                    <td><strong className="debt-text">{money(customer.debt)}</strong></td>
                    <td><div className="row-actions"><button className="button secondary" onClick={() => setSelectedCustomerId(customer.id)}>查看明细</button><button className="button" onClick={() => onRegister(customer)}>登记收款</button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {selectedCustomer && (
        <DebtDetailModal
          customer={selectedCustomer}
          orders={customerOrders}
          payments={customerPayments}
          onClose={() => setSelectedCustomerId(null)}
          onRegister={() => {
            setSelectedCustomerId(null);
            onRegister(selectedCustomer);
          }}
        />
      )}
    </>
  );
}

function ImageArchive({ orders, onOpen }) {
  const [query, setQuery] = useState("");
  const visible = orders.filter(order => `${order.customer}${order.no}`.includes(query));
  return (
    <>
      <PageTitle title="图片档案" text="按客户名称或销售单号查找全部发货凭证。" />
      <SearchInput value={query} onChange={setQuery} placeholder="搜索客户或销售单号" />
      <div className="cards-grid" style={{ marginTop: 16 }}>
        {visible.map(order => (
          <article className="order-card" key={order.id}>
            <div className="order-card-top">
              <div><h3>{order.customer}</h3><span className="order-number">{order.no}</span></div>
              <Archive size={22} />
            </div>
            <PhotoCounts images={order.images} />
            <button className="button secondary" onClick={() => onOpen(order)}>查看档案</button>
          </article>
        ))}
      </div>
    </>
  );
}

function CategoryPage({ categories, products, onAdd, onEdit, onToggle, onMove }) {
  return (
    <>
      <PageTitle title="产品分类" text="分类只停用不直接删除，历史产品与订单永久保留。" action={<button className="button" onClick={onAdd}><Plus size={17} />新增分类</button>} />
      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead><tr><th>排序</th><th>分类名称</th><th>产品数量</th><th>状态</th><th /></tr></thead>
            <tbody>
              {categories.map((category, index) => {
                const count = products.filter(product => product.category === category.name).length;
                return (
                  <tr key={category.id}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>{count}</td>
                    <td><span className={`stock-pill ${category.active ? "ok" : "low"}`}>{category.active ? "使用中" : "已停用"}</span></td>
                    <td>
                      <div className="row-actions">
                        <button className="button secondary" onClick={() => onMove(category, -1)} disabled={index === 0}>上移</button>
                        <button className="button secondary" onClick={() => onMove(category, 1)} disabled={index === categories.length - 1}>下移</button>
                        <button className="button secondary" onClick={() => onEdit(category)}>修改</button>
                        <button className="button secondary" onClick={() => onToggle(category)}>{category.active ? "停用" : "恢复"}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function StaffPage({ staff, onAdd, onToggle }) {
  return (
    <>
      <PageTitle title="员工管理" text="员工登录后仅能查看待发货订单和上传照片。" action={<button className="button" onClick={onAdd}><Plus size={17} />新增员工</button>} />
      <div className="cards-grid">
        {staff.map(item => (
          <article className="customer-card" key={item.id}>
            <div className="customer-card-head">
              <h3>{item.name}</h3>
              <span className={`stock-pill ${item.active ? "ok" : "low"}`}>{item.active ? "正常" : "已停用"}</span>
            </div>
            <div className="info-list">
              <div className="info-line"><Users size={15} />登录账号：{item.loginAccount}</div>
              <a className="info-line" href={`tel:${item.phone}`}><Phone size={15} />{item.phone || "未填写手机号"}</a>
            </div>
            <p className="muted">仓库员工 · 创建时间 {item.createdAt || "未知"}</p>
            <button className={`button ${item.active ? "secondary" : ""}`} onClick={() => onToggle(item)}>
              {item.active ? "停用账号" : "恢复账号"}
            </button>
          </article>
        ))}
      </div>
      {!staff.length && <Empty text="暂无员工账号，请点击右上角新增员工" />}
    </>
  );
}

function OrderModal({ order, products, role, onClose, onUpload, onShip, onPrint }) {
  const canShip = role === "employee" && ["待发货", "退回重发"].includes(order.status);
  return (
    <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <h2>{order.no}</h2>
            <span className="muted">{order.customer}</span>
          </div>
          <button className="icon-button" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            {role === "admin" && <Detail label="销售单金额" value={money(order.amount)} />}
            {role === "admin" && <Detail label="累计欠款" value={money(order.previousDebt + order.amount - order.paid)} />}
            <Detail label="当前状态" value={order.status} />
            <Detail label="收货电话" value={order.phone} />
            <Detail label="开单人员" value={order.creator} />
            <Detail label="发货人员" value={order.shipper || "待发货"} />
          </div>

          <Panel title="收货信息">
            <p>{order.address}</p>
            <p className="muted">备注：{order.note || "无"}</p>
          </Panel>

          <Panel title="产品明细">
            <div className="table-wrap">
              <table>
                <thead><tr><th>产品</th><th>规格</th><th>数量</th>{role === "admin" && <th>单价</th>}</tr></thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.productId}>
                      <td><div className="table-product"><ProductImage product={{ ...item, imagePath: products.find(product => product.id === item.productId)?.imagePath || item.imagePath }} compact /><span>{item.name}</span></div></td>
                      <td>{item.spec}</td><td>{item.qty}</td>{role === "admin" && <td>{money(item.price)}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>

          <div className="upload-grid">
            <UploadBox title="销售单照片" text="最多5张，必传" count={order.images.sales} onUpload={count => onUpload("sales", count)} />
            <UploadBox title="发货照片" text="不限数量" count={order.images.shipping} onUpload={count => onUpload("shipping", count)} />
            <UploadBox title="物流单照片" text="最多3张，必传" count={order.images.logistics} onUpload={count => onUpload("logistics", count)} />
          </div>

          {canShip && (!order.images.sales || !order.images.logistics) && (
            <div className="alert">资料未上传完整：销售单照片和物流单照片必须至少各1张。</div>
          )}

          <div className="modal-actions">
            {role === "admin" && <button className="button secondary" onClick={() => onPrint(order)}><Printer size={17} />打印销售单</button>}
            {canShip && <button className="button" onClick={onShip}><PackageCheck size={17} />完成发货</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function UploadBox({ title, text, count, onUpload }) {
  return (
    <div className="upload-box">
      <h4>{title}：{count} 张</h4>
      <p>{text}，支持手机直接拍照或从相册多选。</p>
      <label className="button secondary">
        <Upload size={16} />
        拍照 / 选择图片
        <input
          hidden
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={event => onUpload(event.target.files.length)}
        />
      </label>
    </div>
  );
}

function PriceConfirmModal({ warnings, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-head">
          <div><h2>价格异常确认</h2><span className="muted">本次价格与该客户最近成交价不同</span></div>
          <button className="icon-button" onClick={onCancel}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="price-warning-list">
            {warnings.map(({ line, history }) => {
              const difference = Number(line.price) - Number(history.lastPrice);
              return (
                <div className="price-warning-card" key={line.productId}>
                  <strong>{line.name} · {line.spec}</strong>
                  <div><span>最近成交价</span><b>{money(history.lastPrice)}</b></div>
                  <div><span>本次价格</span><b>{money(line.price)}</b></div>
                  <div className={difference > 0 ? "price-up" : "price-down"}>
                    <span>{difference > 0 ? "本次高出" : "本次降低"}</span>
                    <b>{money(Math.abs(difference))}</b>
                  </div>
                  <small>最近成交日期：{history.lastDate}</small>
                </div>
              );
            })}
          </div>
          <div className="alert">请核对价格。点击确认后，系统才会按本次价格生成销售单。</div>
          <div className="modal-actions">
            <button className="button secondary" onClick={onCancel}>返回修改</button>
            <button className="button warning" onClick={onConfirm}>确认使用本次价格</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentModal({ customer, onClose, onSave }) {
  const [amount, setAmount] = useState(customer.debt);
  const [method, setMethod] = useState("微信");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    if (amount <= 0 || amount > customer.debt) {
      window.alert("收款金额必须大于0，并且不能超过客户累计欠款。");
      return;
    }
    setSaving(true);
    try {
      await onSave({ customerId: customer.id, amount: Number(amount), method, note });
    } catch (error) {
      window.alert(error.message || "收款登记失败，请重试。");
      setSaving(false);
    }
  };
  return (
    <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div><h2>登记收款</h2><span className="muted">{customer.name}</span></div>
          <button className="icon-button" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <Detail label="当前累计欠款" value={money(customer.debt)} />
            <Detail label="收款后剩余" value={money(Math.max(customer.debt - amount, 0))} />
          </div>
          <div className="form-grid">
            <Field label="本次收款金额"><input type="number" min="0.01" max={customer.debt} value={amount} onChange={event => setAmount(Number(event.target.value))} /></Field>
            <Field label="收款方式">
              <select value={method} onChange={event => setMethod(event.target.value)}>
                {["现金", "微信", "支付宝", "银行转账", "其他"].map(item => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <div className="field full"><label>收款备注</label><textarea value={note} onChange={event => setNote(event.target.value)} placeholder="例如：微信收款、月底结清" /></div>
          </div>
          <div className="alert">收款将按时间顺序优先冲抵最早的未结清销售单。</div>
          <div className="modal-actions">
            <button className="button secondary" onClick={onClose}>取消</button>
            <button className="button" onClick={submit} disabled={saving}>{saving ? "正在保存..." : "确认收款"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DebtDetailModal({ customer, orders, payments, onClose, onRegister }) {
  return (
    <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div><h2>{customer.name} · 欠款明细</h2><span className="muted">累计欠款 {money(customer.debt)}</span></div>
          <button className="icon-button" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <Panel title="未结清销售单">
            <div className="table-wrap">
              <table>
                <thead><tr><th>销售单号</th><th>日期</th><th>应收</th><th>已收</th><th>未收</th><th>付款状态</th></tr></thead>
                <tbody>
                  {orders.filter(order => Number(order.unpaid ?? order.amount - order.paid) > 0).map(order => (
                    <tr key={order.id}>
                      <td>{order.no}</td>
                      <td>{order.createdAt}</td>
                      <td>{money(order.amount)}</td>
                      <td>{money(order.paid)}</td>
                      <td>{money(order.unpaid ?? order.amount - order.paid)}</td>
                      <td>{order.paymentStatus || "未收款"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
          <Panel title="最近收款记录">
            {payments.length ? (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>时间</th><th>金额</th><th>方式</th><th>备注</th></tr></thead>
                  <tbody>{payments.slice(0, 20).map(payment => (
                    <tr key={payment.id}><td>{payment.receivedAt}</td><td>{money(payment.amount)}</td><td>{payment.method}</td><td>{payment.note || "无"}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            ) : <Empty text="暂无收款记录" />}
          </Panel>
          <div className="modal-actions">
            <button className="button" onClick={onRegister}>登记收款</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SalesPrintModal({ order, onClose, onPrinted }) {
  const totalQuantity = order.items.reduce((sum, item) => sum + Number(item.qty), 0);
  const unpaid = Number(order.unpaid ?? order.amount - order.paid);
  const cumulativeDebt = Number(order.previousDebt || 0) + unpaid;
  const print = async () => {
    try {
      await onPrinted();
    } catch (error) {
      console.error(error);
    }
    window.print();
  };
  return (
    <div className="modal-backdrop print-modal">
      <div className="print-preview">
        <div className="print-toolbar">
          <button className="button secondary" onClick={onClose}><X size={16} />关闭预览</button>
          <button className="button" onClick={print}><Printer size={17} />打印销售单</button>
        </div>
        <article className="sales-print-sheet">
          <header className="print-title">
            <h1>云南博艺通节水灌溉销售单</h1>
            <div><span>销售单号：{order.no}</span><span>日期：{order.createdAt}</span></div>
          </header>
          <section className="print-customer">
            <div><b>客户名称：</b>{order.customer}</div>
            <div><b>联系电话：</b>{order.phone}</div>
            <div className="full"><b>收货地址：</b>{order.address}</div>
          </section>
          <table className="print-table">
            <thead><tr><th>序号</th><th>产品名称</th><th>规格型号</th><th>数量</th><th>单价</th><th>金额</th></tr></thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={`${item.productId}-${index}`}>
                  <td>{index + 1}</td><td>{item.name}</td><td>{item.spec}</td><td>{item.qty}</td><td>{money(item.price)}</td><td>{money(item.qty * item.price)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot><tr><td colSpan="3">合计</td><td>{totalQuantity}</td><td>-</td><td>{money(order.amount)}</td></tr></tfoot>
          </table>
          <section className="print-money">
            <div><span>本单应收</span><strong>{money(order.amount)}</strong></div>
            <div><span>本次已收</span><strong>{money(order.paid)}</strong></div>
            <div><span>本期欠款</span><strong>{money(unpaid)}</strong></div>
            <div><span>上期欠款</span><strong>{money(order.previousDebt)}</strong></div>
            <div className="total"><span>累计欠款</span><strong>{money(cumulativeDebt)}</strong></div>
          </section>
          <section className="print-note"><b>订单备注：</b>{order.note || "无"}</section>
          <footer className="print-footer">
            <span>开单人：{order.creator || "老板"}</span>
            <span>客户签字：________________</span>
          </footer>
        </article>
      </div>
    </div>
  );
}

function EmployeeModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    loginAccount: "",
    password: "",
    phone: "",
    active: true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (key, value) => {
    setForm(current => ({ ...current, [key]: value }));
    setError("");
  };
  const submit = async () => {
    if (!form.name.trim()) return setError("请填写员工姓名");
    if (!/^[a-zA-Z0-9._-]{3,30}$/.test(form.loginAccount.trim())) {
      return setError("登录账号只能使用3-30位字母、数字、点、横线或下划线");
    }
    if (form.password.length < 6) return setError("初始密码至少需要6位");
    if (form.phone && !/^[0-9+\-\s]{6,20}$/.test(form.phone.trim())) {
      return setError("手机号格式不正确");
    }
    setSaving(true);
    setError("");
    try {
      await onSave({
        ...form,
        name: form.name.trim(),
        loginAccount: form.loginAccount.trim().toLowerCase(),
        phone: form.phone.trim()
      });
    } catch (saveError) {
      setError(saveError.message || "新增员工失败，请检查网络和数据库配置");
      setSaving(false);
    }
  };
  return (
    <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div><h2>新增员工</h2><span className="muted">创建后可使用登录账号和初始密码进入员工端</span></div>
          <button className="icon-button" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <Field label="员工姓名"><input value={form.name} onChange={event => update("name", event.target.value)} placeholder="例如：王师傅" /></Field>
            <Field label="登录账号"><input value={form.loginAccount} onChange={event => update("loginAccount", event.target.value)} placeholder="例如：wangshi" autoCapitalize="none" /></Field>
            <Field label="初始密码"><input type="password" value={form.password} onChange={event => update("password", event.target.value)} placeholder="至少6位" /></Field>
            <Field label="手机号"><input value={form.phone} onChange={event => update("phone", event.target.value)} placeholder="例如：13800000000" /></Field>
            <Field label="状态">
              <select value={form.active ? "active" : "inactive"} onChange={event => update("active", event.target.value === "active")}>
                <option value="active">正常</option>
                <option value="inactive">停用</option>
              </select>
            </Field>
          </div>
          {error && <div className="form-error">{error}</div>}
          {!supabaseEnabled && <div className="alert">当前是演示模式：员工会加入演示列表，但真实登录需要配置并部署 Supabase。</div>}
          <div className="modal-actions">
            <button className="button secondary" onClick={onClose} disabled={saving}>取消</button>
            <button className="button" onClick={submit} disabled={saving}>{saving ? "正在创建..." : "保存员工"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ categories, product, onClose, onSave }) {
  const activeCategories = categories.filter(item => item.active || item.id === product?.categoryId);
  const firstCategory = activeCategories[0];
  const [form, setForm] = useState(product || {
    categoryId: firstCategory?.id,
    category: firstCategory?.name || "",
    name: "",
    spec: "",
    price: 0,
    stock: 0,
    warning: 20,
    imagePath: "",
    note: "",
    active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const save = () => {
    if (!form.name.trim() || !form.spec.trim() || !form.categoryId) {
      window.alert("请填写产品名称、规格型号并选择分类。");
      return;
    }
    onSave(form, imageFile);
  };
  return (
    <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head"><h2>{product ? "修改产品" : "新增产品"}</h2><button className="icon-button" onClick={onClose}><X size={18} /></button></div>
        <div className="modal-body">
          <div className="form-grid">
            <Field label="产品分类">
              <select
                value={form.categoryId}
                onChange={event => {
                  const selected = activeCategories.find(item => item.id === Number(event.target.value));
                  setForm(current => ({ ...current, categoryId: selected.id, category: selected.name }));
                }}
              >
                {activeCategories.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
              </select>
            </Field>
            <Field label="产品名称"><input value={form.name} onChange={event => update("name", event.target.value)} /></Field>
            <Field label="规格型号"><input value={form.spec} onChange={event => update("spec", event.target.value)} /></Field>
            <Field label="销售价"><input type="number" value={form.price} onChange={event => update("price", Number(event.target.value))} /></Field>
            <Field label="当前库存"><input type="number" value={form.stock} onChange={event => update("stock", Number(event.target.value))} /></Field>
            <Field label="库存预警值"><input type="number" value={form.warning} onChange={event => update("warning", Number(event.target.value))} /></Field>
            <Field label="产品图片"><input type="file" accept="image/*" onChange={event => setImageFile(event.target.files[0] || null)} /></Field>
            <div className="field full"><label>备注</label><textarea value={form.note || ""} onChange={event => update("note", event.target.value)} /></div>
          </div>
          <div className="modal-actions"><button className="button" onClick={save}>保存产品</button></div>
        </div>
      </div>
    </div>
  );
}

function CategoryModal({ category, nextOrder, onClose, onSave }) {
  const [form, setForm] = useState(category || {
    name: "",
    sortOrder: nextOrder,
    active: true
  });
  return (
    <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head"><h2>{category ? "修改分类" : "新增分类"}</h2><button className="icon-button" onClick={onClose}><X size={18} /></button></div>
        <div className="modal-body">
          <div className="form-grid">
            <Field label="分类名称"><input value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></Field>
            <Field label="排序"><input type="number" value={form.sortOrder} onChange={event => setForm({ ...form, sortOrder: Number(event.target.value) })} /></Field>
          </div>
          <div className="modal-actions">
            <button className="button" onClick={() => form.name.trim() ? onSave(form) : window.alert("请填写分类名称。")}>保存分类</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState(customer || {
    name: "",
    contactName: "",
    phone: "",
    address: "",
    tag: "普通客户",
    note: "",
    debt: 0,
    active: true
  });
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  return (
    <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head"><h2>{customer ? "修改客户" : "新增客户"}</h2><button className="icon-button" onClick={onClose}><X size={18} /></button></div>
        <div className="modal-body">
          <div className="form-grid">
            <Field label="客户名称"><input value={form.name} onChange={event => update("name", event.target.value)} /></Field>
            <Field label="联系人"><input value={form.contactName || ""} onChange={event => update("contactName", event.target.value)} /></Field>
            <Field label="联系电话"><input value={form.phone} onChange={event => update("phone", event.target.value)} /></Field>
            <Field label="客户标签">
              <select value={form.tag} onChange={event => update("tag", event.target.value)}>
                {["大客户", "老客户", "普通客户", "欠款客户", "先付款后发货"].map(tag => <option key={tag}>{tag}</option>)}
              </select>
            </Field>
            <div className="field full"><label>收货地址</label><textarea value={form.address} onChange={event => update("address", event.target.value)} /></div>
            <div className="field full"><label>客户备注</label><textarea value={form.note || ""} onChange={event => update("note", event.target.value)} /></div>
          </div>
          <div className="modal-actions">
            <button className="button" onClick={() => {
              if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
                window.alert("请填写客户名称、联系电话和收货地址。");
                return;
              }
              onSave(form);
            }}>保存客户</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomerDetail({ customer, orders, onClose, onCopyOrder }) {
  const sortedOrders = [...orders].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const recentOrders = sortedOrders.slice(0, 10);
  const productHistory = new Map();
  sortedOrders.forEach(order => order.items.forEach(item => {
    const current = productHistory.get(item.productId);
    const record = current || { name: item.name, spec: item.spec, count: 0, quantity: 0, lastPrice: item.price, lastDate: order.createdAt };
    record.count += 1;
    record.quantity += Number(item.qty);
    if (!current) {
      record.lastPrice = item.price;
      record.lastDate = order.createdAt;
    }
    productHistory.set(item.productId, record);
  }));
  return (
    <div className="modal-backdrop" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div><h2>{customer.name}</h2><span className="muted">{customer.tag}</span></div>
          <button className="icon-button" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">
          <div className="detail-grid">
            <Detail label="联系电话" value={customer.phone} />
            <Detail label="联系人" value={customer.contactName || "未填写"} />
            <Detail label="累计欠款" value={money(customer.debt)} />
          </div>
          <Panel title="收货地址">
            <p>{customer.address}</p>
            <div className="row-actions">
              <a className="button secondary" href={`tel:${customer.phone}`}><Phone size={16} />拨打电话</a>
              <button className="button secondary" onClick={() => navigator.clipboard?.writeText(customer.address)}><Copy size={16} />复制地址</button>
            </div>
          </Panel>
          <Panel title="最近成交产品">
            {productHistory.size ? (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>产品</th><th>最近成交价</th><th>购买次数</th><th>累计数量</th></tr></thead>
                  <tbody>{[...productHistory.values()].map(item => (
                    <tr key={`${item.name}-${item.spec}`}><td>{item.name} {item.spec}</td><td>{money(item.lastPrice)}</td><td>{item.count}</td><td>{item.quantity}</td></tr>
                  ))}</tbody>
                </table>
              </div>
            ) : <Empty text="该客户暂无购买记录" />}
          </Panel>
          <Panel title="最近10笔订单">
            {recentOrders.length ? (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>销售单号</th><th>日期</th><th>金额</th><th>状态</th><th /></tr></thead>
                  <tbody>{recentOrders.map(order => (
                    <tr key={order.id}><td>{order.no}</td><td>{order.createdAt}</td><td>{money(order.amount)}</td><td><Status status={order.status} /></td><td><button className="button secondary" onClick={() => onCopyOrder(order)}>复制此单</button></td></tr>
                  ))}</tbody>
                </table>
              </div>
            ) : <Empty text="该客户暂无历史订单" />}
          </Panel>
        </div>
      </div>
    </div>
  );
}

function ProductImage({ product, compact = false }) {
  if (product.imagePath) {
    return <div className={`product-image ${compact ? "compact" : ""}`}><img src={product.imagePath} alt={product.name} /></div>;
  }
  return <div className={`product-image ${compact ? "compact" : ""}`}><Package size={compact ? 19 : 34} /></div>;
}

function Field({ label, children }) {
  return <div className="field"><label>{label}</label>{children}</div>;
}

function Detail({ label, value }) {
  return <div className="detail-box"><span>{label}</span><strong>{value}</strong></div>;
}

function PageTitle({ title, text, action }) {
  return <div className="page-head"><div><h2>{title}</h2><p>{text}</p></div>{action}</div>;
}

function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="search-box">
      <Search size={17} />
      <input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

function Panel({ title, children }) {
  return <section className="panel"><div className="panel-head"><h3>{title}</h3></div><div className="panel-body">{children}</div></section>;
}

function Status({ status }) {
  return <span className={`status-badge ${statusTone(status)}`}>{status}</span>;
}

function PhotoCounts({ images }) {
  return (
    <div className="photo-progress">
      <div className="photo-count">销售单<strong>{images.sales}/5</strong></div>
      <div className="photo-count">发货照片<strong>{images.shipping}</strong></div>
      <div className="photo-count">物流单<strong>{images.logistics}/3</strong></div>
    </div>
  );
}

function Stat({ label, value, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-head"><span>{label}</span><span className="stat-icon"><Icon size={18} /></span></div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

function Empty({ text }) {
  return <div className="empty-state"><PackageCheck size={36} /><div>{text}</div></div>;
}

export default App;
