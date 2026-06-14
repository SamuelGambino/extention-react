import type { ParserTabConfig } from "../../types/parser_сonfig";
import type { Log, ParserState } from "../../types/parsing_state";
import { setState, getState } from "../storage";

export type ParseMode = 'check' | 'parse' | 'steps';

export abstract class BaseParser {
  protected config: ParserTabConfig;
  protected mode: ParseMode;
  private pausePromise: Promise<void> | null = null;
  private resumeResolve: (() => void) | null = null;
  private stopped = false;

  constructor(config: ParserTabConfig, mode: ParseMode) {
    this.config = config;
    this.mode = mode;
  }

  // Steps
  abstract checkAvailability(): Promise<void>; // 1 - elements count
  abstract parseFirst(): Promise<void>; // 2 - first prod
  abstract parseRest(): Promise<void>; // 3+ - other cats
  abstract exportData(): Promise<void>; // last step - export

  // Pause in step mode
  protected async waitForNextStep() {
    if (this.mode !== 'steps') return;

    await this.setParsingState({ waitingForStep: true });

    this.pausePromise = new Promise((resolve) => {
      this.resumeResolve = resolve;
    });

    await this.pausePromise;
    this.pausePromise = null;
  }

  // start when message "next_step"
  public resume() {
    this.resumeResolve?.();
  }

  public stop() {
    this.stopped = true;
    this.resumeResolve?.(); // unlock
  }

  protected async setDataState(patch: Partial<ParserState['data']>) {
    const state = await getState();
    await setState({
      ...state,
      data: { ...state.data, ...patch }
    });
  }

  protected async setParsingState(patch: Partial<ParserState['parsing']>) {
    const state = await getState();
    await setState({
      ...state,
      parsing: { ...state.parsing, ...patch }
    });
  }

  protected async setLog(log: Log) {
    const state = await getState();
    const logs = state.logs ?? [];
    await setState({
      ...state,
      logs: [...logs, log]
    });
  }

  // Run steps
  async run() {
    try {
      // step 1
      await this.checkAvailability();
      if (this.mode === 'check') return;

      await this.waitForNextStep();
      if (this.stopped) return;

      // step 2
      await this.parseFirst();
      await this.waitForNextStep();
      if (this.stopped) return;

      // step 3+
      await this.parseRest();
      await this.waitForNextStep();
      if (this.stopped) return;

      // last step
      await this.exportData();

      await this.setParsingState({ isRunning: false });
    } catch (e) {
      await this.setParsingState({ isRunning: false });
      await this.setLog({ status: "danger", title: "[BaseParser]", value: `${e}` });
    }
  }
}