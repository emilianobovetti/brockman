import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

type LockMode =
  | 'LOCK_TASK_MODE_NONE'
  | 'LOCK_TASK_MODE_LOCKED'
  | 'LOCK_TASK_MODE_PINNED'
  | 'LOCK_TASK_MODE_UNKNOWN';

export interface Spec extends TurboModule {
  getLockTaskModeState(): LockMode;
  isDeviceOwnerApp(): boolean;
  startLockTask(): void;
  stopLockTask(): void;
}

const defaults: Spec = {
  getLockTaskModeState: () => 'LOCK_TASK_MODE_UNKNOWN',
  isDeviceOwnerApp: () => false,
  startLockTask: () => {},
  stopLockTask: () => {},
};

export default TurboModuleRegistry.get<Spec>('TaskLockerModule') ?? defaults;
