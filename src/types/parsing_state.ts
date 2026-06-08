interface ParserState {
  availability: {
    isReady: boolean;
    message?: string;
  };
  parsing: {
    categories: number;
    products: number;
    groupsModifiers?: number;
    modifiers?: number;
  }
  logs?: string[];
};

export type {
  ParserState
}