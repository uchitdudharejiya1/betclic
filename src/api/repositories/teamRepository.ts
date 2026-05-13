import type {Team} from '../../types/domain/team';

export const teamRepository = {
  // Reserved for /teams endpoint integration when needed.
  none: async (): Promise<Team[]> => [],
};
