@echo off
echo 正在启动Vue前端和Strapi后端项目...

:: 启动Vue前端项目
start cmd /k "cd /d %~dp0 && npm run dev"

:: 启动Strapi后端项目
start cmd /k "cd /d %~dp0server-strapi && npm run develop"

echo 两个项目已在新窗口中启动 