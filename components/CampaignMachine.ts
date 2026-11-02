"use client";

/*============================================================================
  CAMPAIGN STATE MACHINE
  Single source of truth for the "New campaign" experience.
  Stages: idle -> researching -> designing -> generating -> reviewing
          -> budgeting -> connecting -> launching -> live
  Any error retries only the current stage.
============================================================================*/

export type CampaignStage =
  | "idle"
  | "researching"
  | "designing"
  | "generating"
  | "reviewing"
  | "budgeting"
  | "connecting"
  | "launching"
  | "live";

export type StageStatus = "idle" | "pending" | "active" | "done" | "error";

export type ConnectionState = "disconnected" | "connecting" | "connected";

export type BudgetMode = "day" | "total";

export type Platform = "meta" | "google";

export interface BrandKit {
  palette: Array<{ role: string; hex: string }>;
  headlineFont: string;
  bodyFont: string;
  styleDescriptors: string[];
  referenceImages: Array<{ src: string; label: string }>;
}

export interface ResearchRow {
  id: string;
  label: string;
  detail: string | null;
  favicon?: string;
  status: StageStatus;
  resultChips: string[];
}

export interface Creative {
  id: string;
  platform: Platform;
  name: string;
  aspect: "feed" | "story" | "display";
  imageUrl: string | null;
  imageLoading: boolean;
  imageError: string | null;
  headline: string;
  cta: string;
  selected: boolean;
  why: string;
}

export interface CampaignState {
  stage: CampaignStage;
  stageStatus: StageStatus;
  userPrompt: string | null;
  brandKit: BrandKit | null;
  research: ResearchRow[];
  creatives: Creative[];
  budget: {
    amount: number;
    mode: BudgetMode;
    metaPct: number;
    googlePct: number;
  };
  connections: {
    meta: ConnectionState;
    google: ConnectionState;
    metaAccount: string | null;
    googleAccount: string | null;
  };
  errors: Record<string, string>;
  liveSummary: string | null;
  spendCapped: boolean;
}

export interface CampaignAction {
  type:
    | "START"
    | "RESEARCH_ROW_START"
    | "RESEARCH_ROW_DONE"
    | "RESEARCH_ROW_ERROR"
    | "RESEARCH_COMPLETE"
    | "BRAND_KIT_SET"
    | "GENERATING_START"
    | "CREATIVE_IMAGE_READY"
    | "CREATIVE_IMAGE_ERROR"
    | "GENERATING_COMPLETE"
    | "TOGGLE_CREATIVE"
    | "SET_BUDGET"
    | "SET_BUDGET_MODE"
    | "SET_SPLIT"
    | "SET_TARGETING"
    | "CONNECT_START"
    | "CONNECTED"
    | "CONNECT_ERROR"
    | "LAUNCH_START"
    | "LAUNCH_STEP_DONE"
    | "LAUNCH_COMPLETE"
    | "RETRY"
    | "RESET";
  payload?: any;
}

const LEGAL: Record<CampaignStage, CampaignStage[]> = {
  idle: ["researching"],
  researching: ["designing"],
  designing: ["generating"],
  generating: ["reviewing"],
  reviewing: ["budgeting"],
  budgeting: ["connecting"],
  connecting: ["launching"],
  launching: ["live"],
  live: [],
};

const ERROR_RETRY: Record<CampaignStage, CampaignStage> = {
  idle: "idle",
  researching: "researching",
  designing: "designing",
  generating: "generating",
  reviewing: "reviewing",
  budgeting: "budgeting",
  connecting: "connecting",
  launching: "launching",
  live: "live",
};

export const INITIAL_STATE: CampaignState = {
  stage: "idle",
  stageStatus: "idle",
  userPrompt: null,
  brandKit: null,
  research: [
    { id: "r1", label: "Reading your website", detail: null, status: "pending", resultChips: [] },
    { id: "r2", label: "Researching your industry and local competitors", detail: null, status: "pending", resultChips: [] },
    { id: "r3", label: "Finding diners near you", detail: null, status: "pending", resultChips: [] },
    { id: "r4", label: "Identifying brand patterns (colors, fonts, tone, photo style)", detail: null, status: "pending", resultChips: [] },
  ],
  creatives: [
    { id: "c1", platform: "meta", name: "Meta Feed — hero burger", aspect: "feed", imageUrl: null, imageLoading: false, imageError: null, headline: "", cta: "", selected: true, why: "" },
    { id: "c2", platform: "meta", name: "Meta Feed — pasta dish", aspect: "feed", imageUrl: null, imageLoading: false, imageError: null, headline: "", cta: "", selected: true, why: "" },
    { id: "c3", platform: "meta", name: "Meta Story — offer-led", aspect: "story", imageUrl: null, imageLoading: false, imageError: null, headline: "", cta: "", selected: true, why: "" },
    { id: "c4", platform: "google", name: "Google Display — dish + name", aspect: "display", imageUrl: null, imageLoading: false, imageError: null, headline: "", cta: "", selected: true, why: "" },
  ],
  budget: { amount: 100, mode: "day", metaPct: 60, googlePct: 40 },
  connections: { meta: "disconnected", google: "disconnected", metaAccount: null, googleAccount: null },
  errors: {},
  liveSummary: null,
  spendCapped: false,
};

function canTransition(from: CampaignStage, to: CampaignStage): boolean {
  return LEGAL[from]?.includes(to) ?? false;
}

export function campaignReducer(state: CampaignState, action: CampaignAction): CampaignState {
  switch (action.type) {
    case "START": {
      if (!canTransition(state.stage, "researching")) return state;
      return {
        ...state,
        stage: "researching",
        stageStatus: "active",
        userPrompt: action.payload.prompt ?? state.userPrompt,
        errors: {},
      };
    }

    case "RESEARCH_ROW_START": {
      return {
        ...state,
        research: state.research.map((row) =>
          row.id === action.payload.id ? { ...row, status: "active" } : row
        ),
      };
    }

    case "RESEARCH_ROW_DONE": {
      return {
        ...state,
        research: state.research.map((row) =>
          row.id === action.payload.id
            ? { ...row, status: "done", detail: action.payload.detail ?? row.detail, resultChips: action.payload.chips ?? row.resultChips }
            : row
        ),
      };
    }

    case "RESEARCH_ROW_ERROR": {
      return {
        ...state,
        research: state.research.map((row) =>
          row.id === action.payload.id ? { ...row, status: "error" } : row
        ),
        errors: { ...state.errors, [action.payload.id]: action.payload.message },
      };
    }

    case "RESEARCH_COMPLETE": {
      if (!canTransition(state.stage, "designing")) return state;
      return {
        ...state,
        stage: "designing",
        stageStatus: "active",
        research: state.research.map((row) => ({ ...row, status: "done" })),
      };
    }

    case "BRAND_KIT_SET": {
      return { ...state, brandKit: action.payload, stageStatus: "active" };
    }

    case "GENERATING_START": {
      if (!canTransition(state.stage, "generating")) return state;
      return {
        ...state,
        stage: "generating",
        stageStatus: "active",
        creatives: state.creatives.map((c) => ({ ...c, imageLoading: true, imageError: null, imageUrl: null })),
      };
    }

    case "CREATIVE_IMAGE_READY": {
      return {
        ...state,
        creatives: state.creatives.map((c) =>
          c.id === action.payload.id
            ? { ...c, imageUrl: action.payload.url, imageLoading: false, imageError: null }
            : c
        ),
      };
    }

    case "CREATIVE_IMAGE_ERROR": {
      return {
        ...state,
        creatives: state.creatives.map((c) =>
          c.id === action.payload.id
            ? { ...c, imageLoading: false, imageError: action.payload.message }
            : c
        ),
        errors: { ...state.errors, [action.payload.id]: action.payload.message },
      };
    }

    case "GENERATING_COMPLETE": {
      if (!canTransition(state.stage, "reviewing")) return state;
      return { ...state, stage: "reviewing", stageStatus: "active" };
    }

    case "TOGGLE_CREATIVE": {
      return {
        ...state,
        creatives: state.creatives.map((c) =>
          c.id === action.payload.id ? { ...c, selected: action.payload.selected ?? !c.selected } : c
        ),
      };
    }

    case "SET_BUDGET": {
      const next: CampaignState = {
        ...state,
        budget: { ...state.budget, amount: action.payload },
      };
      // Setting a budget from the review panel slides into the budgeting stage.
      if (state.stage === "reviewing" && canTransition(state.stage, "budgeting")) {
        next.stage = "budgeting";
        next.stageStatus = "active";
      }
      return next;
    }

    case "SET_BUDGET_MODE": {
      return { ...state, budget: { ...state.budget, mode: action.payload } };
    }

    case "SET_SPLIT": {
      const { platform, pct } = action.payload;
      return {
        ...state,
        budget: {
          ...state.budget,
          [platform === "meta" ? "metaPct" : "googlePct"]: pct,
        },
      };
    }

    case "SET_TARGETING": {
      // targeting chips live in budgeting UI; stored here for completeness
      return state;
    }

    case "CONNECT_START": {
      if (!canTransition(state.stage, "connecting")) return state;
      const platform = action.payload.platform as Platform;
      return {
        ...state,
        stage: "connecting",
        stageStatus: "active",
        connections: {
          ...state.connections,
          [platform]: "connecting",
        },
      };
    }

    case "CONNECTED": {
      const platform = action.payload.platform as Platform;
      return {
        ...state,
        connections: {
          ...state.connections,
          [platform]: "connected",
          [`${platform}Account` as keyof CampaignState["connections"]]: action.payload.account ?? null,
        },
      };
    }

    case "CONNECT_ERROR": {
      const platform = action.payload.platform as Platform;
      return {
        ...state,
        connections: { ...state.connections, [platform]: "disconnected" },
        errors: { ...state.errors, [`connect-${platform}`]: action.payload.message },
      };
    }

    case "LAUNCH_START": {
      if (!canTransition(state.stage, "launching")) return state;
      return { ...state, stage: "launching", stageStatus: "active", errors: {} };
    }

    case "LAUNCH_STEP_DONE": {
      return state;
    }

    case "LAUNCH_COMPLETE": {
      if (!canTransition(state.stage, "live")) return state;
      return {
        ...state,
        stage: "live",
        stageStatus: "done",
        liveSummary: action.payload.summary ?? null,
      };
    }

    case "RETRY": {
      const stage = ERROR_RETRY[state.stage];
      return {
        ...state,
        stage,
        stageStatus: stage === "live" ? "done" : "active",
        errors: {},
      };
    }

    case "RESET": {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
}

export const LEGAL_TRANSITIONS = LEGAL;
export const stageLabel: Record<CampaignStage, string> = {
  idle: "Idle",
  researching: "Researching",
  designing: "Designing",
  generating: "Generating",
  reviewing: "Ready for review",
  budgeting: "Awaiting connection",
  connecting: "Connecting",
  launching: "Launching",
  live: "Live",
};

export const statusLabel: Record<StageStatus, string> = {
  idle: "Idle",
  pending: "Pending",
  active: "Active",
  done: "Done",
  error: "Error",
};
