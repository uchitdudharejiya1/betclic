export type OddsSelection = {
  label: string;
  price: number;
};

export type OddsMarket = {
  id: string;
  name: string;
  selections: OddsSelection[];
};

export type OddsBook = {
  matchId: string;
  bookmaker?: string;
  markets: OddsMarket[];
  updatedAtMs: number;
};
