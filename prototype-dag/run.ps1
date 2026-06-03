param(
  [string]$Repo = $env:COCKPIT_REPO
)

# PROTOTYPE — throwaway. 一键：拉最新真实数据 → 打开依赖图。
# 用法：在本目录下  ./run.ps1 -Repo owner/repo   （需要本机 gh 已登录、Node 已装）
$ErrorActionPreference = "Stop"
$here = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($Repo)) {
  throw "请传入 -Repo owner/repo，或先设置环境变量 COCKPIT_REPO。"
}
Write-Host "[1/2] 拉取 $Repo 真实数据并解析 …" -ForegroundColor Cyan
node "$here\fetch-data.mjs" $Repo
Write-Host "[2/2] 打开依赖图（浏览器）…" -ForegroundColor Cyan
Start-Process "$here\index.html"
Write-Host "完成。底部切换条或 左/右 方向键 切换 A/B 两版画法。" -ForegroundColor Green
