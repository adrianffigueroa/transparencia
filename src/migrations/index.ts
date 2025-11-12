import * as migration_20251105_231910 from './20251105_231910';
import * as migration_20251111_190332 from './20251111_190332';

export const migrations = [
  {
    up: migration_20251105_231910.up,
    down: migration_20251105_231910.down,
    name: '20251105_231910',
  },
  {
    up: migration_20251111_190332.up,
    down: migration_20251111_190332.down,
    name: '20251111_190332'
  },
];
