#Requires -Version 5.1
<#
.SYNOPSIS
  一键启动「Agents 团队驾驶舱」做 smoke。

.DESCRIPTION
  首次自动装依赖 → 可选地从 GitHub 拉最新卡片 → 起本地 dev server 并自动打开浏览器。
  全程只读，不写回 GitHub（对齐 ADR-0001/0002）。看完按 Ctrl+C 停止。

.PARAMETER Repo
  要拉取的 GitHub 仓库 (owner/repo)。给了就先刷新数据再起图；
  不给就直接用现有的 src/data/cards.generated.ts（没有则兜底拉当前仓库）。

.EXAMPLE
  ./scripts/smoke.ps1
  用现有数据直接起图。

.EXAMPLE
  ./scripts/smoke.ps1 -Repo Eric900614/foravia2027_harness_prod
  先拉 foravia 的真实 open 卡片，再起图（攒真实手感）。
#>
[CmdletBinding()]
param(
  [string]$Repo
)

$ErrorActionPreference = "Stop"

# 校验 repo 形如 owner/repo，避免把奇怪的值原样喂给 gh
if ($Repo -and $Repo -notmatch '^[\w.-]+/[\w.-]+$') {
  throw "Repo 格式应为 owner/repo，收到的是：$Repo"
}

# 切到仓库根目录（本脚本在 scripts/ 下）
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot
Write-Host "驾驶舱 smoke 启动器 (repo: $repoRoot)" -ForegroundColor Green

function Invoke-Step {
  param([string]$Label, [scriptblock]$Action)
  Write-Host "==> $Label" -ForegroundColor Cyan
  & $Action
  if ($LASTEXITCODE -ne 0) {
    throw "$Label 失败 (exit $LASTEXITCODE)"
  }
}

# 1) 依赖（首次或缺失时）
if (-not (Test-Path (Join-Path $repoRoot "node_modules"))) {
  Invoke-Step "安装依赖 npm install" { npm install }
}

# 2) 数据：给了 -Repo 就刷新；没给但本地还没数据，就拉当前仓库兜底；都没有就用现成的
$dataFile = Join-Path $repoRoot "src/data/cards.generated.ts"
if ($Repo) {
  try {
    Invoke-Step "拉取 $Repo 的 open 卡片（只读）" { npm run fetch -- $Repo }
  } catch {
    Write-Host "   拉取失败。请先确认本机 gh 已登录：gh auth status" -ForegroundColor Yellow
    throw
  }
} elseif (-not (Test-Path $dataFile)) {
  Invoke-Step "本地还没数据，拉当前仓库兜底" { npm run fetch }
} else {
  Write-Host "==> 用现有数据 src/data/cards.generated.ts（要换/刷新数据就加 -Repo owner/repo）" -ForegroundColor DarkGray
}

# 3) 起 dev server + 自动开浏览器（Ctrl+C 停止）
Write-Host "==> 启动 dev server，浏览器将自动打开；看完按 Ctrl+C 停止" -ForegroundColor Green
npm run dev -- --open
