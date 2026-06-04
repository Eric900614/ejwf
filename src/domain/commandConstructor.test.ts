import { describe, expect, it } from "vitest";
import { buildAgentCommand } from "./commandConstructor";

describe("buildAgentCommand", () => {
  it("Claude 不传可配项时，给出 build agent 默认档 argv，提示词是单独一个元素", () => {
    const command = buildAgentCommand({
      agent: "claude",
      prompt: "把 #36 命令构造器做完。"
    });

    expect(command.file).toBe("claude");
    expect(command.args).toEqual([
      "-p",
      "把 #36 命令构造器做完。",
      "--permission-mode",
      "bypassPermissions",
      "--max-turns",
      "6",
      "--model",
      "opus",
      "--effort",
      "xhigh"
    ]);
    // 提示词原样落在单个 argv 元素里（防注入的根基）
    expect(command.args.filter((arg) => arg === "把 #36 命令构造器做完。")).toHaveLength(1);
  });

  it("Claude 传了 model/effort/权限档/轮数时，覆盖默认档", () => {
    const command = buildAgentCommand({
      agent: "claude",
      prompt: "审查这张卡。",
      model: "sonnet",
      effort: "medium",
      permissionMode: "acceptEdits",
      maxTurns: 3
    });

    expect(command.file).toBe("claude");
    expect(command.args).toEqual([
      "-p",
      "审查这张卡。",
      "--permission-mode",
      "acceptEdits",
      "--max-turns",
      "3",
      "--model",
      "sonnet",
      "--effort",
      "medium"
    ]);
  });

  it("Codex 不传可配项时，给出 exec + 默认沙箱，提示词是末尾的单个位置参数", () => {
    const command = buildAgentCommand({
      agent: "codex",
      prompt: "把 #36 命令构造器做完。"
    });

    expect(command.file).toBe("codex");
    expect(command.args).toEqual([
      "exec",
      "--sandbox",
      "workspace-write",
      "--color",
      "never",
      "把 #36 命令构造器做完。"
    ]);
    // 提示词是 argv 最后一个元素，且只出现一次
    expect(command.args[command.args.length - 1]).toBe("把 #36 命令构造器做完。");
    expect(command.args.filter((arg) => arg === "把 #36 命令构造器做完。")).toHaveLength(1);
  });

  it("Codex 传了 model 时，加 -m <model>（排在沙箱后、提示词前）", () => {
    const command = buildAgentCommand({
      agent: "codex",
      prompt: "干活。",
      model: "gpt-5.5"
    });

    expect(command.args).toEqual([
      "exec",
      "--sandbox",
      "workspace-write",
      "--color",
      "never",
      "-m",
      "gpt-5.5",
      "干活。"
    ]);
  });

  it("Codex 传了 effort 时，走 -c model_reasoning_effort=<effort> 配置（非 flag）", () => {
    const command = buildAgentCommand({
      agent: "codex",
      prompt: "干活。",
      effort: "high"
    });

    expect(command.args).toEqual([
      "exec",
      "--sandbox",
      "workspace-write",
      "--color",
      "never",
      "-c",
      "model_reasoning_effort=high",
      "干活。"
    ]);
  });

  it("Codex 可覆盖沙箱和输出颜色", () => {
    const command = buildAgentCommand({
      agent: "codex",
      prompt: "干活。",
      sandbox: "danger-full-access",
      color: "auto"
    });

    expect(command.args).toEqual([
      "exec",
      "--sandbox",
      "danger-full-access",
      "--color",
      "auto",
      "干活。"
    ]);
  });

  // 防注入：提示词无论塞什么特殊字符，都原样落在单个 argv 元素里——
  // 不拆、不拼、不被解释（启动器再走 execFile + shell:false，shell 永远碰不到它）。
  const nastyPrompt =
    '审查"这张"卡; rm -rf /; $(whoami) `反引号` & 管道 | 反斜杠 \\ 末尾\n第二行 中文与换行';

  it("Claude：含引号/$()/;/换行/中文的提示词原样进单个 argv 元素", () => {
    const command = buildAgentCommand({ agent: "claude", prompt: nastyPrompt });

    expect(command.args.filter((arg) => arg === nastyPrompt)).toHaveLength(1);
    // 没有任何一个 argv 元素被「拼接」进别的内容——特殊字符没污染相邻参数
    expect(command.args).toContain(nastyPrompt);
    expect(command.args).toContain("--permission-mode");
  });

  it("Codex：含引号/$()/;/换行/中文的提示词原样进末尾单个 argv 元素", () => {
    const command = buildAgentCommand({ agent: "codex", prompt: nastyPrompt });

    expect(command.args.filter((arg) => arg === nastyPrompt)).toHaveLength(1);
    expect(command.args[command.args.length - 1]).toBe(nastyPrompt);
  });

  it("传入 executable 全路径时，file 用全路径，参数不变（路径解析归 #32 启动器）", () => {
    const exe = "C:\\Users\\me\\AppData\\Roaming\\npm\\claude.exe";
    const command = buildAgentCommand({
      agent: "claude",
      prompt: "干活。",
      executable: exe
    });

    expect(command.file).toBe(exe);
    expect(command.args).toEqual([
      "-p",
      "干活。",
      "--permission-mode",
      "bypassPermissions",
      "--max-turns",
      "6",
      "--model",
      "opus",
      "--effort",
      "xhigh"
    ]);
  });
});
