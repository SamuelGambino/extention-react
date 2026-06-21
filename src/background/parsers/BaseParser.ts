import type { ParserTabConfig } from "../../globalTypes/parser_сonfig";
import type { Log, ParserState } from "../../globalTypes/parsing_state";
import { setState, getState } from "../storage";
import type { Categories, ExportData, ModGroups, Mods, Product } from "../types/ExportTypes";

export type ParseMode = 'check' | 'parse' | 'steps';

export abstract class BaseParser {
  protected config: ParserTabConfig;
  protected mode: ParseMode;
  protected categories: Categories[] = [];
  protected modifiers_groups: ModGroups[] = [];
  protected modifiers: Mods[] = [];
  protected products: Product[] = [];
  private pausePromise: Promise<void> | null = null;
  private resumeResolve: (() => void) | null = null;
  private stopped = false;

  constructor(config: ParserTabConfig, mode: ParseMode) {
    this.config = config;
    this.mode = mode;
  }

  // Steps
  abstract checkAvailability(): Promise<void>; // 1 - elements count
  abstract parseRest(): Promise<void>; // 2+

  protected async exportData() {
    // логика экспорта одна для всех
  };

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

  public resume() {
    void this.setParsingState({ waitingForStep: false });
    this.resumeResolve?.();
  }

  public stop() {
    this.stopped = true;
    void this.setParsingState({ isRunning: false, waitingForStep: false });
    this.resumeResolve?.(); 
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

  protected async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Run steps
  async run(): Promise<ExportData | undefined> {
    try {
      await this.checkAvailability();
      if (this.mode === 'check') return;

      await this.waitForNextStep();
      if (this.stopped) return;

      await this.parseRest();
      await this.waitForNextStep();
      if (this.stopped) return;

      return {
        categories: this.categories,
        products: this.products,
        modifiers: this.modifiers,
        modifiers_groups: this.modifiers_groups,
      }
    } catch (e) {
      await this.setParsingState({ isRunning: false });
      await this.setLog({ status: "danger", title: "[BaseParser]", value: `${e}` });
    }
  }
}