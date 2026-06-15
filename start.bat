@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

set "NPM_CMD=npm"
where npm >nul 2>nul
if not errorlevel 1 goto npm_ready
if exist "C:\Program Files\nodejs\npm.cmd" (
  set "NPM_CMD=C:\Program Files\nodejs\npm.cmd"
  goto npm_ready
)
(
  echo.
  echo 未检测到 Node.js。
  echo 请先安装 Node.js 20 LTS，然后重新双击 start.bat。
  echo 下载地址：https://nodejs.org/
  echo.
  pause
  exit /b 1
)

:npm_ready

if not exist "node_modules" (
  echo 正在首次安装系统组件，请稍候...
  call "%NPM_CMD%" install
  if errorlevel 1 (
    echo.
    echo 安装失败，请检查网络后重试。
    pause
    exit /b 1
  )
)

echo.
echo 博艺通进销存系统正在启动...
echo 电脑访问：http://localhost:3000
echo 手机访问：请使用本机局域网IP加端口3000
echo.

start "" http://localhost:3000
call "%NPM_CMD%" run dev

endlocal
