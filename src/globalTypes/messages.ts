import type { LoopContextKeyType, LoopContextStrategy, StepAction, StepCollect, StepCondition, StepWait } from "./parser_сonfig";

type ElementContextFrame = {
  selector: string;
  index: number;
  id?: string;
  strategy?: LoopContextStrategy;
  key?: string;
  keyType?: LoopContextKeyType;
  keyAttribute?: string;
};

type ElementContext = ElementContextFrame[];

type ContentPayload =
  | { type: "action"; step: StepAction; context?: ElementContext }
  | { type: "collect"; step: StepCollect; context?: ElementContext }
  | { type: "condition"; step: StepCondition; context?: ElementContext }
  | { type: "wait"; step: StepWait; context?: ElementContext }
  | {
    type: "loop-items";
    selector: string;
    source?: "document" | "element";
    context?: ElementContext;
    contextStrategy?: LoopContextStrategy;
    keyType?: LoopContextKeyType;
    keyAttribute?: string;
  }
  | { type: "release-context"; context: ElementContext };

interface ContentSuccess<T = unknown> {
  status: "success";
  data?: T;
}

interface ContentError {
  status: "error";
  message: string;
}

type ContentResponse<T = unknown> = ContentSuccess<T> | ContentError;

type BackgroundToContentPayload = ContentPayload;

export type {
  BackgroundToContentPayload,
  ContentPayload,
  ContentResponse,
  ElementContext,
  ElementContextFrame,
}