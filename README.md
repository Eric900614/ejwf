# Agents 团队驾驶舱

TB1 最薄一条龙：读取单个 GitHub repo 的 open 卡片，解析正文 `## Blocked by` 段，渲染 blocked-by 依赖 DAG。

## 运行

```powershell
npm install
npm run fetch -- Eric900614/ejwf
npm run dev
```

打开 Vite 输出的本地地址，例如 `http://127.0.0.1:5173/`。

## 测试

```powershell
npm test
npm run build
```

当前纯逻辑测试覆盖：

- `## Blocked by` 是正文最后一段时仍能解析
- `Blocked by` 写 `None` 时不生成依赖
- 建图时箭头方向为「前置卡片 -> 被挡卡片」
