import { LanesSnapshot } from "./lanes";

export enum SchedulerWorkPriority {
  SyncPriority = 1 << 0,
  InputDiscretePriority = 1 << 1,
  InputContinuousPriority = 1 << 2,
  ContinuousPriority = 1 << 3,
  DefaultPriority = 1 << 4,
  TransitionPriority = 1 << 5,
  RetryPriority = 1 << 6,
  IdlePriority = 1 << 7,
  OffscreenPriority = 1 << 8,
}

export function schedulerWorkPriorityToLanesSnapshot(priority: SchedulerWorkPriority): LanesSnapshot {
  switch (priority) {
    case SchedulerWorkPriority.SyncPriority:
      return LanesSnapshot.SyncLanes;
    case SchedulerWorkPriority.InputDiscretePriority:
      return LanesSnapshot.InputDiscreteLanes;
    case SchedulerWorkPriority.InputContinuousPriority:
      return LanesSnapshot.InputContinuousLanes;
    case SchedulerWorkPriority.ContinuousPriority:
      return LanesSnapshot.ContinuousLanes;
    case SchedulerWorkPriority.DefaultPriority:
      return LanesSnapshot.DefaultLanes;
    case SchedulerWorkPriority.TransitionPriority:
      return LanesSnapshot.TransitionLanes;
    case SchedulerWorkPriority.RetryPriority:
      return LanesSnapshot.RetryLanes;
    case SchedulerWorkPriority.IdlePriority:
      return LanesSnapshot.IdleLanes;
    case SchedulerWorkPriority.OffscreenPriority:
      return LanesSnapshot.OffscreenLanes;
    default:
      return LanesSnapshot.NoLanes;
  }
}
