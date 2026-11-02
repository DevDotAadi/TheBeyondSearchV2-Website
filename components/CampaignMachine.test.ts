import { describe, it, expect } from "vitest";
import {
  campaignReducer,
  INITIAL_STATE,
  type CampaignAction,
  type CampaignStage,
  LEGAL_TRANSITIONS,
} from "@/components/CampaignMachine";

function act(state: any, action: CampaignAction) {
  return campaignReducer(state, action);
}

// Advance through the legal chain to reach a given stage (for test setup).
function toStage(state: any, target: CampaignStage) {
  let s = state;
  let safety = 0;
  while (s.stage !== target && safety++ < 25) {
    switch (s.stage) {
      case "idle":
        s = act(s, { type: "START", payload: { prompt: "Launch ads for my burger and pasta restaurant" } });
        break;
      case "researching":
        s = act(s, { type: "RESEARCH_COMPLETE" });
        break;
      case "designing":
        s = act(s, { type: "GENERATING_START" });
        break;
      case "generating":
        s = act(s, { type: "GENERATING_COMPLETE" });
        break;
      case "reviewing":
        s = act(s, { type: "SET_BUDGET", payload: 100 });
        break;
      case "budgeting":
        s = act(s, { type: "CONNECT_START", payload: { platform: "meta" } });
        break;
      case "connecting":
        s = act(s, { type: "CONNECTED", payload: { platform: "meta", account: "m" } });
        s = act(s, { type: "CONNECTED", payload: { platform: "google", account: "g" } });
        if (target === "launching" || target === "live") {
          s = act(s, { type: "LAUNCH_START" });
        }
        break;
      case "launching":
        s = act(s, { type: "LAUNCH_COMPLETE", payload: { summary: "live" } });
        break;
      default:
        throw new Error(`Cannot advance from ${s.stage}`);
    }
  }
  return s;
}

describe("campaign state machine", () => {
  it("starts at idle", () => {
    expect(INITIAL_STATE.stage).toBe("idle");
    expect(INITIAL_STATE.stageStatus).toBe("idle");
  });

  it("START moves idle -> researching", () => {
    const next = act(INITIAL_STATE, { type: "START", payload: { prompt: "Launch ads" } });
    expect(next.stage).toBe("researching");
    expect(next.stageStatus).toBe("active");
    expect(next.userPrompt).toBe("Launch ads");
  });

  it("START is illegal from non-idle (no-op)", () => {
    const mid = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const next = act(mid, { type: "START", payload: { prompt: "y" } });
    expect(next.stage).toBe("researching");
    expect(next.userPrompt).toBe("x");
  });

  it("research rows stream pending -> active -> done", () => {
    const researching = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const active = act(researching, {
      type: "RESEARCH_ROW_START",
      payload: { id: "r1" },
    });
    expect(active.research[0].status).toBe("active");
    const done = act(active, {
      type: "RESEARCH_ROW_DONE",
      payload: { id: "r1", detail: "example.com", chips: ["Casual dining"] },
    });
    expect(done.research[0].status).toBe("done");
    expect(done.research[0].resultChips).toEqual(["Casual dining"]);
  });

  it("research row error stays on that row only", () => {
    const researching = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const err = act(researching, {
      type: "RESEARCH_ROW_ERROR",
      payload: { id: "r2", message: "timeout" },
    });
    expect(err.research[1].status).toBe("error");
    expect(err.research[0].status).toBe("pending");
    expect(err.errors["r2"]).toBe("timeout");
  });

  it("RESEARCH_COMPLETE moves researching -> designing", () => {
    const researching = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const next = act(researching, { type: "RESEARCH_COMPLETE" });
    expect(next.stage).toBe("designing");
    expect(next.stageStatus).toBe("active");
  });

  it("BRAND_KIT_SET stores brandKit", () => {
    const designing = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const designed = act(designing, { type: "RESEARCH_COMPLETE" });
    const kit = {
      palette: [{ role: "Primary", hex: "#3f8cff" }],
      headlineFont: "Inter",
      bodyFont: "Inter",
      styleDescriptors: ["Warm editorial"],
      referenceImages: [],
    };
    const next = act(designed, { type: "BRAND_KIT_SET", payload: kit });
    expect(next.brandKit).toEqual(kit);
  });

  it("GENERATING_START moves designing -> generating and resets creative loading", () => {
    const designing = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const designed = act(designing, { type: "RESEARCH_COMPLETE" });
    const next = act(designed, { type: "GENERATING_START" });
    expect(next.stage).toBe("generating");
    expect(next.creatives.every((c) => c.imageLoading)).toBe(true);
    expect(next.creatives.length).toBe(4);
  });

  it("CREATIVE_IMAGE_READY updates one slot", () => {
    const generating = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const designed = act(generating, { type: "RESEARCH_COMPLETE" });
    const started = act(designed, { type: "GENERATING_START" });
    const next = act(started, {
      type: "CREATIVE_IMAGE_READY",
      payload: { id: "c1", url: "https://example.com/c1.png" },
    });
    expect(next.creatives[0].imageUrl).toBe("https://example.com/c1.png");
    expect(next.creatives[0].imageLoading).toBe(false);
    expect(next.creatives[1].imageUrl).toBeNull();
  });

  it("CREATIVE_IMAGE_ERROR marks one slot only", () => {
    const generating = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const designed = act(generating, { type: "RESEARCH_COMPLETE" });
    const started = act(designed, { type: "GENERATING_START" });
    const next = act(started, {
      type: "CREATIVE_IMAGE_ERROR",
      payload: { id: "c3", message: "rejected" },
    });
    expect(next.creatives[2].imageError).toBe("rejected");
    expect(next.creatives[2].imageLoading).toBe(false);
    expect(next.errors["c3"]).toBe("rejected");
  });

  it("GENERATING_COMPLETE moves generating -> reviewing", () => {
    const generating = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const designed = act(generating, { type: "RESEARCH_COMPLETE" });
    const started = act(designed, { type: "GENERATING_START" });
    const next = act(started, { type: "GENERATING_COMPLETE" });
    expect(next.stage).toBe("reviewing");
  });

  it("TOGGLE_CREATIVE flips selection", () => {
    const reviewing = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const designed = act(reviewing, { type: "RESEARCH_COMPLETE" });
    const started = act(designed, { type: "GENERATING_START" });
    const ready = act(started, { type: "GENERATING_COMPLETE" });
    const toggled = act(ready, { type: "TOGGLE_CREATIVE", payload: { id: "c2", selected: false } });
    expect(toggled.creatives[1].selected).toBe(false);
    const back = act(toggled, { type: "TOGGLE_CREATIVE", payload: { id: "c2" } });
    expect(back.creatives[1].selected).toBe(true);
  });

  it("SET_BUDGET sets amount", () => {
    const s = act(INITIAL_STATE, { type: "SET_BUDGET", payload: 250 });
    expect(s.budget.amount).toBe(250);
  });

  it("SET_BUDGET_MODE toggles mode", () => {
    const s = act(INITIAL_STATE, { type: "SET_BUDGET_MODE", payload: "total" });
    expect(s.budget.mode).toBe("total");
  });

  it("SET_SPLIT moves percentage", () => {
    const s = act(INITIAL_STATE, { type: "SET_SPLIT", payload: { platform: "meta", pct: 70 } });
    expect(s.budget.metaPct).toBe(70);
    expect(s.budget.googlePct).toBe(40);
  });

  it("CONNECT_START moves reviewing -> budgeting -> connecting", () => {
    const reviewing = toStage(INITIAL_STATE, "reviewing");
    const budgeting = act(reviewing, { type: "SET_BUDGET", payload: 100 });
    expect(budgeting.stage).toBe("budgeting");
    const next = act(budgeting, { type: "CONNECT_START", payload: { platform: "meta" } });
    expect(next.stage).toBe("connecting");
    expect(next.connections.meta).toBe("connecting");
  });

  it("CONNECTED marks platform connected", () => {
    const connecting = toStage(INITIAL_STATE, "connecting");
    const next = act(connecting, { type: "CONNECTED", payload: { platform: "meta", account: "user_meta" } });
    expect(next.connections.meta).toBe("connected");
    expect(next.connections.metaAccount).toBe("user_meta");
  });

  it("CONNECT_ERROR disconnects and records message", () => {
    const connecting = toStage(INITIAL_STATE, "connecting");
    const next = act(connecting, {
      type: "CONNECT_ERROR",
      payload: { platform: "google", message: "OAuth cancelled" },
    });
    expect(next.connections.google).toBe("disconnected");
    expect(next.errors["connect-google"]).toBe("OAuth cancelled");
  });

  it("LAUNCH_START moves connecting -> launching", () => {
    const connecting = toStage(INITIAL_STATE, "connecting");
    const next = act(connecting, { type: "LAUNCH_START" });
    expect(next.stage).toBe("launching");
  });

  it("LAUNCH_COMPLETE moves launching -> live with summary", () => {
    const launching = toStage(INITIAL_STATE, "launching");
    const next = act(launching, {
      type: "LAUNCH_COMPLETE",
      payload: { summary: "Launched 4 campaigns" },
    });
    expect(next.stage).toBe("live");
    expect(next.stageStatus).toBe("done");
    expect(next.liveSummary).toBe("Launched 4 campaigns");
  });

  it("RETRY returns to current stage only", () => {
    const generating = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const designed = act(generating, { type: "RESEARCH_COMPLETE" });
    const started = act(designed, { type: "GENERATING_START" });
    const retried = act(started, { type: "RETRY" });
    expect(retried.stage).toBe("generating");
    expect(retried.stageStatus).toBe("active");
  });

  it("RESET returns to INITIAL_STATE", () => {
    const live = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const next = act(live, { type: "RESET" });
    expect(next).toEqual(INITIAL_STATE);
  });

  it("illegal transitions are rejected (no-op)", () => {
    // Researching complete from idle is illegal
    const a = act(INITIAL_STATE, { type: "RESEARCH_COMPLETE" });
    expect(a.stage).toBe("idle");

    // Generating start from researching is illegal
    const researching = act(INITIAL_STATE, { type: "START", payload: { prompt: "x" } });
    const b = act(researching, { type: "GENERATING_START" });
    expect(b.stage).toBe("researching");

    // Launch complete from idle is illegal
    const c = act(INITIAL_STATE, { type: "LAUNCH_COMPLETE", payload: { summary: "x" } });
    expect(c.stage).toBe("idle");

    // Connect start from idle is illegal
    const d = act(INITIAL_STATE, { type: "CONNECT_START", payload: { platform: "meta" } });
    expect(d.stage).toBe("idle");
  });

  it("RESET returns to the exact initial state", () => {
    const advanced = toStage(INITIAL_STATE, "live");
    expect(advanced.stage).toBe("live");
    const reset = act(advanced, { type: "RESET" });
    expect(reset).toEqual(INITIAL_STATE);
    expect(reset.stage).toBe("idle");
    expect(reset.stageStatus).toBe("idle");
    expect(reset.userPrompt).toBeNull();
    expect(reset.creatives.length).toBe(4);
    expect(reset.liveSummary).toBeNull();
  });

  it("every declared stage has a legal transition map entry", () => {
    const stages: CampaignStage[] = [
      "idle","researching","designing","generating","reviewing",
      "budgeting","connecting","launching","live",
    ];
    stages.forEach((s) => {
      expect(LEGAL_TRANSITIONS[s]).toBeDefined();
    });
  });
});
