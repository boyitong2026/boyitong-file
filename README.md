# 博艺通节水灌溉进销存系统 V2

这是一个适用于节水灌溉配件批发行业的网页版进销存系统，支持电脑、安卓手机和苹果手机。

## 已完成模块

- 老板首页：今日订单、销售额、待发货、待核查、库存预警、欠款客户
- 销售开单：客户与产品搜索、多产品开单、自动计算、历史价格提醒
- 产品与分类：新增、筛选、库存和停用规则预留
- 库存管理：开单扣减、库存预警、手工调整
- 客户与欠款：电话、地址、标签、累计欠款、收款入口
- 员工发货：手机拍照/相册上传、必传资料检查、完成发货
- 老板核查：核查通过、退回重发、图片档案
- 数据安全：Supabase 登录、数据库权限、私有图片存储和操作日志表
- 响应式页面：Windows、安卓、iPhone 浏览器自适应
2026.6.15 备份项目文件
## V2 第二阶段测试版本

当前版本已完成：

- 产品分类新增、修改、排序、停用和恢复
- 产品新增、修改、停用、恢复、搜索、分类筛选和图片上传
- 客户新增、修改、搜索和客户详情
- 客户详情显示联系电话、地址、累计欠款、最近10笔订单和最近成交产品
- 销售开单支持客户搜索、产品搜索、多产品开单和库存校验
- 支持复制历史订单
- 开单显示最近成交价、成交日期、购买次数和累计购买数量
- 从未购买的产品显示“首次购买（0次记录）”，不显示历史价格
- 价格高于或低于最近成交价时必须确认
- 销售订单支持客户、电话、单号、日期和状态筛选
- 产品、分类、客户和订单保留历史，不提供物理删除
- 员工端仍只保留待发货、看图片、上传照片和完成发货

第二阶段新增：

- A4销售单打印预览
- 打印显示本单应收、已收、未收、上期欠款和累计欠款
- 打印次数和打印操作日志
- 客户价格高于或低于最近成交价时强制确认
- 数据库端再次校验价格确认状态
- 开单后自动更新客户价格记忆
- 欠款客户搜索和欠款明细
- 登记收款并优先冲抵最早未结清订单
- 收款方式、收款记录和订单付款状态

## 一、Windows 电脑本地启动

### 1. 安装 Node.js

安装 Node.js 20 LTS 或更高版本：

https://nodejs.org/

安装完成后重启电脑。

### 2. 双击启动

双击项目根目录中的：

`start.bat`

首次启动会自动安装系统组件，完成后浏览器打开：

`http://localhost:3000`

以后启动只需再次双击 `start.bat`。

## 二、手机在同一局域网访问

1. 电脑和手机连接同一个路由器或 Wi-Fi。
2. Windows 按 `Win + R`，输入 `cmd`。
3. 输入 `ipconfig`，找到电脑的 IPv4 地址，例如 `192.168.1.20`。
4. 手机浏览器访问 `http://192.168.1.20:3000`。
5. Windows 防火墙弹窗时，允许 Node.js 访问“专用网络”。

Vite 已设置监听 `0.0.0.0`，手机可以通过局域网 IP 访问。

## 三、连接 Supabase

### 1. 创建项目

在 https://supabase.com 创建一个项目。

### 2. 建立数据表

打开 Supabase 后台的 SQL Editor，复制并运行：

`supabase/schema.sql`

如果已经运行过 V1.5 的 `schema.sql`，不要重新清空数据库。备份后继续运行：

`supabase/v2_phase1_migration.sql`

第一阶段已经升级完成后，再运行：

`supabase/v2_phase2_migration.sql`

员工管理功能还需要继续运行：

`supabase/v2_staff_management_migration.sql`

然后使用 Supabase CLI 部署安全创建账号的函数：

```bash
supabase functions deploy create-employee
```

Supabase 托管的 Edge Function 会自动获得 `SUPABASE_URL` 和
`SUPABASE_SERVICE_ROLE_KEY`，不要把 `service_role` 密钥写入前端 `.env`。

新增员工后，员工直接使用“登录账号”和初始密码登录。例如登录账号为
`wangshi`，登录页面直接输入 `wangshi`，无需输入内部邮箱。

该脚本会创建：

- 员工与权限
- 产品分类和产品
- 客户
- 销售订单和明细
- 客户历史价格
- 订单图片
- 收款记录
- 库存流水
- 操作日志
- 私有图片存储桶及访问规则

### 3. 配置环境变量

复制 `.env.example` 为 `.env`，填写：

```env
VITE_SUPABASE_URL=https://你的项目.supabase.co
VITE_SUPABASE_ANON_KEY=你的匿名公钥
```

不要把 Supabase `service_role` 密钥放入前端。

### 4. 创建第一个老板账号

在 Supabase Authentication 中创建用户，然后在 SQL Editor 执行：

```sql
insert into public.profiles (id, display_name, role)
values ('这里填写用户UUID', '老板', 'admin');
```

员工账号的 `role` 填写 `employee`。

## 四、部署到 Vercel

1. 将项目上传到 GitHub。
2. 在 https://vercel.com 新建项目并导入仓库。
3. Framework Preset 选择 `Vite`。
4. Build Command 使用 `npm run build`。
5. Output Directory 使用 `dist`。
6. 在 Vercel Environment Variables 添加：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. 点击部署。

部署成功后，电脑和手机直接打开 Vercel 提供的 HTTPS 地址。

## 五、安全建议

- 正式使用时必须启用 Supabase Auth，不使用演示身份按钮。
- 所有业务表已经启用 RLS 权限控制，不要关闭。
- 图片存储桶保持私有，通过短期签名地址查看。
- 老板账号启用高强度密码，员工一人一个账号。
- 不在微信或公开群发送 Supabase 密钥。
- 定期导出数据库备份，并检查 Supabase 的数据库备份设置。
- 订单只作废不物理删除，产品和客户只停用。

## 当前说明

项目已包含完整前端界面、Supabase 数据结构和访问规则。未配置 `.env` 时使用内置演示数据，方便先查看操作流程；配置后可接入正式 Supabase 数据。

## V2 第三阶段

第三阶段已增加真实发货图片上传、员工完成发货、老板核查与退回重发、欠款校准、正式数据库连接检查，并完善销售单打印记录。

正式数据库升级和验收步骤请查看：

`supabase/PHASE3_SETUP.md`
