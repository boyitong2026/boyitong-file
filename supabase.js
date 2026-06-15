export const categories = [
  "吸肥三通系列",
  "旁通阀系列",
  "打孔器系列",
  "滴灌系列",
  "微喷系列",
  "过滤器系列",
  "PE管件系列",
  "PVC给水管件系列",
  "软带配件系列",
  "主水带系列",
  "涂塑水带",
  "帆布水带",
  "编织水带"
];

export const products = [
  { id: 1, categoryId: 2, category: "旁通阀系列", name: "滴灌带旁通阀", spec: "Φ16", price: 1.8, stock: 1260, warning: 200, note: "常用滴灌配件", imagePath: "", active: true },
  { id: 2, categoryId: 1, category: "吸肥三通系列", name: "文丘里吸肥器", spec: "1寸", price: 38, stock: 46, warning: 20, note: "", imagePath: "", active: true },
  { id: 3, categoryId: 3, category: "打孔器系列", name: "软带打孔器", spec: "Φ16/20", price: 12.5, stock: 18, warning: 30, note: "库存偏低", imagePath: "", active: true },
  { id: 4, categoryId: 6, category: "过滤器系列", name: "叠片过滤器", spec: "2寸 120目", price: 145, stock: 9, warning: 10, note: "", imagePath: "", active: true },
  { id: 5, categoryId: 7, category: "PE管件系列", name: "PE外丝直接", spec: "Φ63×2寸", price: 8.6, stock: 368, warning: 50, note: "", imagePath: "", active: true },
  { id: 6, categoryId: 5, category: "微喷系列", name: "旋转微喷头", spec: "G型", price: 0.85, stock: 2380, warning: 500, note: "", imagePath: "", active: true }
];

export const customers = [
  { id: 1, name: "红河绿源农业", contactName: "张老板", phone: "13808736621", address: "云南省红河州蒙自市银河路88号", tag: "大客户", note: "每月固定补货", debt: 12860, active: true },
  { id: 2, name: "大理丰收农资店", contactName: "李经理", phone: "18687221048", address: "云南省大理市下关镇人民北路126号", tag: "老客户", note: "发顺丰", debt: 0, active: true },
  { id: 3, name: "曲靖绿野商贸", contactName: "王姐", phone: "15987453302", address: "云南省曲靖市麒麟区南宁西路22号", tag: "欠款客户", note: "月结", debt: 5680, active: true },
  { id: 4, name: "玉溪兴农植保", contactName: "陈师傅", phone: "15808772119", address: "云南省玉溪市红塔区珊瑚路11号", tag: "先付款后发货", note: "", debt: 2200, active: true }
];

export const orders = [
  {
    id: 1,
    no: "BYT20260615-0012",
    customerId: 1,
    customer: "红河绿源农业",
    phone: "13808736621",
    address: "云南省红河州蒙自市银河路88号",
    status: "待发货",
    amount: 6180,
    paid: 5000,
    previousDebt: 9500,
    createdAt: "2026-06-15 09:32",
    creator: "老板",
    note: "下午发货，加急",
    items: [
      { productId: 1, name: "滴灌带旁通阀", spec: "Φ16", qty: 2000, price: 1.8 },
      { productId: 5, name: "PE外丝直接", spec: "Φ63×2寸", qty: 300, price: 8.6 }
    ],
    images: { sales: 1, shipping: 0, logistics: 0 }
  },
  {
    id: 2,
    no: "BYT20260615-0011",
    customerId: 2,
    customer: "大理丰收农资店",
    phone: "18687221048",
    address: "云南省大理市下关镇人民北路126号",
    status: "已发货（待核查）",
    amount: 3890,
    paid: 3890,
    previousDebt: 0,
    createdAt: "2026-06-15 08:48",
    creator: "老板",
    shipper: "李师傅",
    shippedAt: "2026-06-15 11:06",
    note: "",
    items: [
      { productId: 2, name: "文丘里吸肥器", spec: "1寸", qty: 80, price: 38 },
      { productId: 3, name: "软带打孔器", spec: "Φ16/20", qty: 68, price: 12.5 }
    ],
    images: { sales: 2, shipping: 8, logistics: 1 }
  },
  {
    id: 3,
    no: "BYT20260614-0026",
    customerId: 3,
    customer: "曲靖绿野商贸",
    phone: "15987453302",
    address: "云南省曲靖市麒麟区南宁西路22号",
    status: "核查通过",
    amount: 10650,
    paid: 7000,
    previousDebt: 2030,
    createdAt: "2026-06-14 15:20",
    creator: "老板",
    shipper: "张师傅",
    shippedAt: "2026-06-14 17:40",
    note: "月结",
    items: [
      { productId: 4, name: "叠片过滤器", spec: "2寸 120目", qty: 50, price: 145 },
      { productId: 6, name: "旋转微喷头", spec: "G型", qty: 4000, price: 0.85 }
    ],
    images: { sales: 1, shipping: 12, logistics: 2 }
  }
];
