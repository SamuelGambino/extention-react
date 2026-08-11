import type { StepType } from "./parser_сonfig";

interface BackgroundToContentPayload {
  source: {
    selector: string;
    index?: number;
    isArray: boolean;
  }
  data: {
    step: StepType
  };
}

export type {
  BackgroundToContentPayload
}