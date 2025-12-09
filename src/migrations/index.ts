import * as migration_20251209_193401 from './20251209_193401';

export const migrations = [
  {
    up: migration_20251209_193401.up,
    down: migration_20251209_193401.down,
    name: '20251209_193401'
  },
];
