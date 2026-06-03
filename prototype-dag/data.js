// 自动生成 —— 勿手改。重新运行 fetch-data.mjs 即刷新。
window.COCKPIT_DATA = {
  "repo": "Eric900614/foravia2027_harness_prod",
  "fetchedAt": "2026-06-03T11:01:12.189Z",
  "counts": {
    "openIssues": 36,
    "nodes": 59,
    "edges": 55,
    "ready": 16,
    "byStage": {
      "todo": 27,
      "in-review": 2,
      "accept": 4,
      "triage": 3,
      "done": 23
    }
  },
  "nodes": [
    {
      "id": "766",
      "number": 766,
      "title": "feat(demo-console): 透视镜第一条 tracer — 导航选路最小闭环（沙盘候选 + 决策轨选择子）",
      "labels": [
        "enhancement",
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039",
        "0008"
      ],
      "blockedBy": [],
      "warnings": [],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "762",
      "number": 762,
      "title": "feat(intent-router): candidate-verify-only parse prompt + golden re-lock (ADR-0039 NC3 step 2)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039"
      ],
      "blockedBy": [
        760,
        693
      ],
      "warnings": [],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "761",
      "number": 761,
      "title": "feat(intent-router): migrate saved-destination state-aware translation into Navigation Expert (ADR-0039 NC4)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039"
      ],
      "blockedBy": [
        733,
        759
      ],
      "warnings": [],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "760",
      "number": 760,
      "title": "feat(intent-router): shared selector-resolver across continuation lifecycle and Expert lane (ADR-0039 NC3 step 1)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039",
        "0024"
      ],
      "blockedBy": [
        732
      ],
      "warnings": [],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "759",
      "number": 759,
      "title": "feat(intent-router): Navigation Expert as domain front door + teardown idempotency (ADR-0039 NC1/NC2)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039"
      ],
      "blockedBy": [
        732,
        751
      ],
      "warnings": [],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "754",
      "number": 754,
      "title": "Vehicle-Control carve VC3: voice relative stepping (调高一档 / 调暗点) — two per-facet parser actions + read-modify-clamp verify across both facades (new feature)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039",
        "0036"
      ],
      "blockedBy": [
        750,
        733,
        751
      ],
      "warnings": [],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "751",
      "number": 751,
      "title": "Vehicle-Control carve VC2: migrate AC idempotency into verify + wire the already-satisfied ExpertOutcome spine path; delete the mapper gate",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039",
        "0036"
      ],
      "blockedBy": [
        750,
        733,
        744
      ],
      "warnings": [],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "750",
      "number": 750,
      "title": "Vehicle-Control carve VC1: VehicleControlExpert skeleton + the 1-to-many propose facade + absolute-set near-no-op (behavior-preserving)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039"
      ],
      "blockedBy": [
        732
      ],
      "warnings": [],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "745",
      "number": 745,
      "title": "Media carve M4: Media Expert owns topic continuation + the unique-artist read-facade reader; delete the mapper gate",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039"
      ],
      "blockedBy": [
        744,
        733
      ],
      "warnings": [],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "744",
      "number": 744,
      "title": "Media carve M3: Media Expert owns recommendation (popular/similar) + wire the needs-ask ExpertOutcome spine path; delete the mapper gate",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039"
      ],
      "blockedBy": [
        743
      ],
      "warnings": [],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "743",
      "number": 743,
      "title": "Media carve M2: Media Expert owns bare play (放首歌) + the resumable-session read-facade reader; delete the mapper gate",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039"
      ],
      "blockedBy": [
        742,
        733
      ],
      "warnings": [],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "719",
      "number": 719,
      "title": "TB6 (slice-3/Planner-DAG): golden trajectory regression lock + sequence-proposal scoring",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": true,
      "prd": 712,
      "adrs": [
        "0039"
      ],
      "blockedBy": [
        714
      ],
      "warnings": [],
      "stage": "in-review",
      "ready": true
    },
    {
      "id": "718",
      "number": 718,
      "title": "TB5 (slice-3/Planner-DAG): 顺路花店 (B) add-waypoint + multi-stop commit (B4)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": 712,
      "adrs": [
        "0039"
      ],
      "blockedBy": [
        717
      ],
      "warnings": [],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "717",
      "number": 717,
      "title": "TB4 (slice-3/Planner-DAG): 顺路花店 (A) along-route search — corridor provider + detour ranking (B4)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": 712,
      "adrs": [
        "0039"
      ],
      "blockedBy": [
        714
      ],
      "warnings": [],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "716",
      "number": 716,
      "title": "TB3 (slice-3/Planner-DAG): fact-state edge + WatchableConditionRegistry — 充到 80% 开空调",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": true,
      "prd": 712,
      "adrs": [
        "0039"
      ],
      "blockedBy": [
        715
      ],
      "warnings": [],
      "stage": "in-review",
      "ready": true
    },
    {
      "id": "712",
      "number": 712,
      "title": "Slice-3 PRD: full Planner/DAG executor — typed-edge trigger family (data-handoff / timer / fact-state)",
      "labels": [
        "enhancement",
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039"
      ],
      "blockedBy": [],
      "warnings": [],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "702",
      "number": 702,
      "title": "feat: 意图质量/评估面板（金样本回归 + 意图准确率/JSON合规率）",
      "labels": [
        "enhancement"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039"
      ],
      "blockedBy": [],
      "warnings": [],
      "stage": "accept",
      "ready": false
    },
    {
      "id": "701",
      "number": 701,
      "title": "feat(demo-console): ADR-0039 链路可视化「透视镜」大屏（地图沙盘 + 状况卡 + 时间轴）",
      "labels": [
        "enhancement"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0039",
        "0008",
        "0035",
        "0025"
      ],
      "blockedBy": [],
      "warnings": [],
      "stage": "accept",
      "ready": false
    },
    {
      "id": "688",
      "number": 688,
      "title": "Spotify Web Playback validation on Android WebView",
      "labels": [
        "ready-for-human"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": 680,
      "adrs": [],
      "blockedBy": [
        684
      ],
      "warnings": [],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "687",
      "number": 687,
      "title": "Two-pad Product HMI Android smoke path",
      "labels": [
        "ready-for-human"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": 680,
      "adrs": [],
      "blockedBy": [
        682,
        683,
        685,
        684
      ],
      "warnings": [],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "680",
      "number": 680,
      "title": "PRD: Product HMI Android Client for two-pad Cluster/CSD deployment",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0040",
        "0032",
        "0041"
      ],
      "blockedBy": [],
      "warnings": [],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "648",
      "number": 648,
      "title": "媒体离线兜底:Spotify 不可用时整个 media 域切到真本地库(whole-media local fallback)",
      "labels": [
        "enhancement",
        "needs-triage"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [
        "无父 PRD / 无 Blocked by / 无 ADR —— 可能连不上线"
      ],
      "stage": "triage",
      "ready": false
    },
    {
      "id": "627",
      "number": 627,
      "title": "Low-Battery Proactive Recharge Companion (auto-trigger → activity-first charge stop)",
      "labels": [],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0037",
        "0029",
        "0023"
      ],
      "blockedBy": [],
      "warnings": [],
      "stage": "accept",
      "ready": false
    },
    {
      "id": "593",
      "number": 593,
      "title": "Follow-up: complete media platform business capabilities",
      "labels": [
        "enhancement",
        "ready-for-human"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [
        "无父 PRD / 无 Blocked by / 无 ADR —— 可能连不上线"
      ],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "592",
      "number": 592,
      "title": "Follow-up: tune media transport rapid-click feedback and latency",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [
        "无父 PRD / 无 Blocked by / 无 ADR —— 可能连不上线"
      ],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "531",
      "number": 531,
      "title": "[EPIC] Vehicle Agent Workbench chains 2-5 (placeholder)",
      "labels": [
        "ready-for-human"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": 526,
      "adrs": [
        "0028"
      ],
      "blockedBy": [
        527,
        528,
        529,
        530
      ],
      "warnings": [],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "526",
      "number": 526,
      "title": "PRD: Vehicle Agent Workbench for same-run plan/goal continuity",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0022",
        "0028"
      ],
      "blockedBy": [],
      "warnings": [],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "442",
      "number": 442,
      "title": "[Discussion] Local LLM inference on DGX Spark — exploration",
      "labels": [
        "documentation",
        "question"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0016",
        "0020",
        "0024"
      ],
      "blockedBy": [],
      "warnings": [],
      "stage": "accept",
      "ready": false
    },
    {
      "id": "365",
      "number": 365,
      "title": "Multi-Entry Media Action Convergence",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": 357,
      "adrs": [
        "0029"
      ],
      "blockedBy": [
        535,
        361,
        363
      ],
      "warnings": [],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "362",
      "number": 362,
      "title": "Library And Browse Collection Tracer",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": 357,
      "adrs": [
        "0029"
      ],
      "blockedBy": [
        555
      ],
      "warnings": [],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "357",
      "number": 357,
      "title": "PRD: Product HMI Media Full-Chain Dual-Screen Experience",
      "labels": [
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [
        "无父 PRD / 无 Blocked by / 无 ADR —— 可能连不上线"
      ],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "181",
      "number": 181,
      "title": "Product HMI/Showroom: Open-Ended Agent Cockpit Experience Gate",
      "labels": [
        "enhancement",
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": 125,
      "adrs": [
        "0017"
      ],
      "blockedBy": [
        139,
        140,
        159,
        161
      ],
      "warnings": [],
      "stage": "todo",
      "ready": false
    },
    {
      "id": "140",
      "number": 140,
      "title": "Product HMI: manual smoke states and design-source visual acceptance",
      "labels": [
        "enhancement",
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": 125,
      "adrs": [],
      "blockedBy": [
        138,
        139
      ],
      "warnings": [],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "125",
      "number": 125,
      "title": "PRD: Product HMI First Slice and Showroom Runtime Profile",
      "labels": [
        "enhancement",
        "ready-for-agent"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [
        "0012"
      ],
      "blockedBy": [],
      "warnings": [],
      "stage": "todo",
      "ready": true
    },
    {
      "id": "67",
      "number": 67,
      "title": "Post-M0: Memory/Profile roadmap seed (PH-HAR-BL-004)",
      "labels": [
        "needs-triage"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": 54,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "triage",
      "ready": false
    },
    {
      "id": "66",
      "number": 66,
      "title": "M5: Fast Path real vehicle/HMI adapter integration (PH-HAR-BL-003b)",
      "labels": [
        "needs-triage"
      ],
      "state": "OPEN",
      "hasOpenPR": false,
      "prd": 54,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "triage",
      "ready": false
    },
    {
      "id": "693",
      "number": 693,
      "title": "TB3 (slice-2/接机): complete the ReAct read tools (car info + walk time)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "733",
      "number": 733,
      "title": "Expert scaffolding S3: read-facade declaration form + MR2/MR4 conformance, first instance = Navigation route_preview reader",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "732",
      "number": 732,
      "title": "Expert scaffolding S2: turn-disposition arbiter — five-member enum extracted from handle() (behavior-preserving)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "742",
      "number": 742,
      "title": "Media carve M1: Media Expert skeleton + named play, proven by registering a second Expert (behavior-preserving)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "714",
      "number": 714,
      "title": "TB1 (slice-3/Planner-DAG): plan/Trigger contract + slow-lane DAG executor skeleton via data-handoff #3 (导航发 ETA)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "715",
      "number": 715,
      "title": "TB2 (slice-3/Planner-DAG): durable trigger machinery + timer edge — 座椅加热定时关",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "684",
      "number": 684,
      "title": "Thin Android WebView APK loads configured Product HMI BFF",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "682",
      "number": 682,
      "title": "App chrome controls Cluster/CSD route and framing",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "683",
      "number": 683,
      "title": "BFF coordination room channel for Product HMI clients",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "685",
      "number": 685,
      "title": "CSD transient focus drives Cluster presentation across pads",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "527",
      "number": 527,
      "title": "Deferred Decision Workbench: defer a pending route/POI decision into a durable Work Item",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "528",
      "number": 528,
      "title": "Deferred Decision Workbench: resume a deferred Work Item from HMI (structured operation)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "529",
      "number": 529,
      "title": "Deferred Decision Workbench: resume a deferred Work Item by natural language",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "530",
      "number": 530,
      "title": "Deferred Decision Workbench: run-end expiry, cancel, and degraded-state hardening",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "535",
      "number": 535,
      "title": "Media Catalog Selection adapter (search) - governed media_catalog_choose (spine acceptance test)",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "361",
      "number": 361,
      "title": "For You Recommendation Tracer",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "363",
      "number": 363,
      "title": "Read-Only Queue Select-To-Play",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "555",
      "number": 555,
      "title": "Media CSD And Cluster Visual Convergence To Locked Prototype",
      "labels": [
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "139",
      "number": 139,
      "title": "Product HMI: Showroom E2E scripts and evidence packets",
      "labels": [
        "enhancement",
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "159",
      "number": 159,
      "title": "M4 Showroom: Cloud LLM agent flow close gate",
      "labels": [
        "enhancement",
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "161",
      "number": 161,
      "title": "M4 Showroom: Cloud LLM Intent Router for Text Intent commands",
      "labels": [
        "enhancement",
        "ready-for-human"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "138",
      "number": 138,
      "title": "Product HMI: Showroom Readiness Gate for M4 runtime profile",
      "labels": [
        "enhancement",
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    },
    {
      "id": "54",
      "number": 54,
      "title": "M1: Create M2-M5 GitHub milestone seed issues",
      "labels": [
        "documentation",
        "ready-for-agent"
      ],
      "state": "CLOSED",
      "hasOpenPR": false,
      "prd": null,
      "adrs": [],
      "blockedBy": [],
      "warnings": [],
      "stage": "done",
      "ready": false
    }
  ],
  "edges": [
    {
      "source": "760",
      "target": "762",
      "type": "blocks"
    },
    {
      "source": "693",
      "target": "762",
      "type": "blocks"
    },
    {
      "source": "733",
      "target": "761",
      "type": "blocks"
    },
    {
      "source": "759",
      "target": "761",
      "type": "blocks"
    },
    {
      "source": "732",
      "target": "760",
      "type": "blocks"
    },
    {
      "source": "732",
      "target": "759",
      "type": "blocks"
    },
    {
      "source": "751",
      "target": "759",
      "type": "blocks"
    },
    {
      "source": "750",
      "target": "754",
      "type": "blocks"
    },
    {
      "source": "733",
      "target": "754",
      "type": "blocks"
    },
    {
      "source": "751",
      "target": "754",
      "type": "blocks"
    },
    {
      "source": "750",
      "target": "751",
      "type": "blocks"
    },
    {
      "source": "733",
      "target": "751",
      "type": "blocks"
    },
    {
      "source": "744",
      "target": "751",
      "type": "blocks"
    },
    {
      "source": "732",
      "target": "750",
      "type": "blocks"
    },
    {
      "source": "744",
      "target": "745",
      "type": "blocks"
    },
    {
      "source": "733",
      "target": "745",
      "type": "blocks"
    },
    {
      "source": "743",
      "target": "744",
      "type": "blocks"
    },
    {
      "source": "742",
      "target": "743",
      "type": "blocks"
    },
    {
      "source": "733",
      "target": "743",
      "type": "blocks"
    },
    {
      "source": "714",
      "target": "719",
      "type": "blocks"
    },
    {
      "source": "712",
      "target": "719",
      "type": "prd"
    },
    {
      "source": "717",
      "target": "718",
      "type": "blocks"
    },
    {
      "source": "712",
      "target": "718",
      "type": "prd"
    },
    {
      "source": "714",
      "target": "717",
      "type": "blocks"
    },
    {
      "source": "712",
      "target": "717",
      "type": "prd"
    },
    {
      "source": "715",
      "target": "716",
      "type": "blocks"
    },
    {
      "source": "712",
      "target": "716",
      "type": "prd"
    },
    {
      "source": "684",
      "target": "688",
      "type": "blocks"
    },
    {
      "source": "680",
      "target": "688",
      "type": "prd"
    },
    {
      "source": "682",
      "target": "687",
      "type": "blocks"
    },
    {
      "source": "683",
      "target": "687",
      "type": "blocks"
    },
    {
      "source": "685",
      "target": "687",
      "type": "blocks"
    },
    {
      "source": "684",
      "target": "687",
      "type": "blocks"
    },
    {
      "source": "680",
      "target": "687",
      "type": "prd"
    },
    {
      "source": "527",
      "target": "531",
      "type": "blocks"
    },
    {
      "source": "528",
      "target": "531",
      "type": "blocks"
    },
    {
      "source": "529",
      "target": "531",
      "type": "blocks"
    },
    {
      "source": "530",
      "target": "531",
      "type": "blocks"
    },
    {
      "source": "526",
      "target": "531",
      "type": "prd"
    },
    {
      "source": "535",
      "target": "365",
      "type": "blocks"
    },
    {
      "source": "361",
      "target": "365",
      "type": "blocks"
    },
    {
      "source": "363",
      "target": "365",
      "type": "blocks"
    },
    {
      "source": "357",
      "target": "365",
      "type": "prd"
    },
    {
      "source": "555",
      "target": "362",
      "type": "blocks"
    },
    {
      "source": "357",
      "target": "362",
      "type": "prd"
    },
    {
      "source": "139",
      "target": "181",
      "type": "blocks"
    },
    {
      "source": "140",
      "target": "181",
      "type": "blocks"
    },
    {
      "source": "159",
      "target": "181",
      "type": "blocks"
    },
    {
      "source": "161",
      "target": "181",
      "type": "blocks"
    },
    {
      "source": "125",
      "target": "181",
      "type": "prd"
    },
    {
      "source": "138",
      "target": "140",
      "type": "blocks"
    },
    {
      "source": "139",
      "target": "140",
      "type": "blocks"
    },
    {
      "source": "125",
      "target": "140",
      "type": "prd"
    },
    {
      "source": "54",
      "target": "67",
      "type": "prd"
    },
    {
      "source": "54",
      "target": "66",
      "type": "prd"
    }
  ],
  "linter": [
    {
      "number": 648,
      "warnings": [
        "无父 PRD / 无 Blocked by / 无 ADR —— 可能连不上线"
      ]
    },
    {
      "number": 593,
      "warnings": [
        "无父 PRD / 无 Blocked by / 无 ADR —— 可能连不上线"
      ]
    },
    {
      "number": 592,
      "warnings": [
        "无父 PRD / 无 Blocked by / 无 ADR —— 可能连不上线"
      ]
    },
    {
      "number": 357,
      "warnings": [
        "无父 PRD / 无 Blocked by / 无 ADR —— 可能连不上线"
      ]
    }
  ]
};
