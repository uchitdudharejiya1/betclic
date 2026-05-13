import type {
  RawBasketballOdds,
  RawBasketballOddsBookmaker,
} from '../../types/api/basketball';
import type {
  RawFootballOdds,
  RawFootballOddsBookmaker,
} from '../../types/api/football';
import type {OddsBook, OddsMarket, OddsSelection} from '../../types/domain/odds';

const parsePrice = (raw: string): number => {
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
};

const mapBookmaker = (
  bm: RawFootballOddsBookmaker | RawBasketballOddsBookmaker,
): OddsMarket[] =>
  bm.bets.map(bet => ({
    id: `${bm.id}:${bet.id}`,
    name: bet.name,
    selections: bet.values.map(
      (v): OddsSelection => ({label: v.value, price: parsePrice(v.odd)}),
    ),
  }));

const firstBookmaker = (
  list: Array<RawFootballOddsBookmaker | RawBasketballOddsBookmaker>,
) => list[0];

export const mapFootballOddsToBook = (raw: RawFootballOdds): OddsBook => {
  const bm = firstBookmaker(raw.bookmakers);
  return {
    matchId: String(raw.fixture.id),
    bookmaker: bm?.name,
    markets: bm ? mapBookmaker(bm) : [],
    updatedAtMs: raw.fixture.timestamp * 1000,
  };
};

export const mapBasketballOddsToBook = (raw: RawBasketballOdds): OddsBook => {
  const bm = firstBookmaker(raw.bookmakers);
  return {
    matchId: String(raw.game.id),
    bookmaker: bm?.name,
    markets: bm ? mapBookmaker(bm) : [],
    updatedAtMs: raw.game.timestamp * 1000,
  };
};
