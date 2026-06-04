import type { AgentCommand } from "./types";

export interface BuildClaudeCommandInput {
  agent: "claude";
  prompt: string;
  /** 已解析的可执行文件全路径；省略时用逻辑名 "claude"（路径解析是 I/O，归 #32 启动器）。 */
  executable?: string;
  model?: string;
  effort?: string;
  permissionMode?: string;
  maxTurns?: number;
}

export interface BuildCodexCommandInput {
  agent: "codex";
  prompt: string;
  executable?: string;
  model?: string;
  effort?: string;
  sandbox?: string;
  color?: "always" | "auto" | "never";
}

export type BuildAgentCommandInput =
  | BuildClaudeCommandInput
  | BuildCodexCommandInput;

// build agent 的默认档（#29 spike 实测：opus 4.8 + xhigh，无头全放行 + 内层软闸）。
// 都是可被输入覆盖的默认，不是写死——满足「权限档/model/effort 作为可配维度」。
const CLAUDE_DEFAULTS = {
  permissionMode: "bypassPermissions",
  maxTurns: 6,
  model: "opus",
  effort: "xhigh"
} as const;

// 派活默认在 workspace-write 沙箱跑（#30 spike：exec 下「不卡确认」的旋钮，且默认禁网够安全）。
const CODEX_DEFAULTS = {
  sandbox: "workspace-write",
  color: "never"
} as const;

export function buildAgentCommand(input: BuildAgentCommandInput): AgentCommand {
  const file = input.executable ?? input.agent;

  if (input.agent === "claude") {
    return { file, args: buildClaudeArgs(input) };
  }

  return { file, args: buildCodexArgs(input) };
}

function buildClaudeArgs(input: BuildClaudeCommandInput): string[] {
  const permissionMode = input.permissionMode ?? CLAUDE_DEFAULTS.permissionMode;
  const maxTurns = input.maxTurns ?? CLAUDE_DEFAULTS.maxTurns;
  const model = input.model ?? CLAUDE_DEFAULTS.model;
  const effort = input.effort ?? CLAUDE_DEFAULTS.effort;

  return [
    "-p",
    input.prompt,
    "--permission-mode",
    permissionMode,
    "--max-turns",
    String(maxTurns),
    "--model",
    model,
    "--effort",
    effort
  ];
}

function buildCodexArgs(input: BuildCodexCommandInput): string[] {
  const sandbox = input.sandbox ?? CODEX_DEFAULTS.sandbox;
  const color = input.color ?? CODEX_DEFAULTS.color;

  const args = ["exec", "--sandbox", sandbox, "--color", color];
  if (input.model !== undefined) {
    args.push("-m", input.model);
  }
  // Codex 的 effort 不是 flag，走 -c 配置项（#30 spike）。
  if (input.effort !== undefined) {
    args.push("-c", `model_reasoning_effort=${input.effort}`);
  }

  // 提示词是 exec 的位置参数，必须排在所有 flag 之后（末尾）。
  args.push(input.prompt);
  return args;
}
