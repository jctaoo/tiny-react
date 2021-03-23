import { SchedulerWork } from "./scheduler";
import { SchedulerWorkPriority } from "./schedulerWorkPriority";

export type Lanes = number;
export type WaitingLanes = number[];

export enum LanesSnapshot {
  NoLanes = /*              */ 0b0000000000000000000000000000000,
  SyncLanes = /*            */ 0b0000000000000000000000000000011,
  InputDiscreteLanes = /*   */ 0b0000000000000000000000000001100,
  InputContinuousLanes = /* */ 0b0000000000000000000000000110000,
  ContinuousLanes = /*      */ 0b0000000000000000000000011000000,
  DefaultLanes = /*         */ 0b0000000000000000000001100000000,
  TransitionLanes = /*      */ 0b0000000011111111111110000000000,
  RetryLanes = /*           */ 0b0011111100000000000000000000000,
  IdleLanes = /*            */ 0b0100000000000000000000000000000,
  OffscreenLanes = /*       */ 0b1000000000000000000000000000000,
}

/*
 * 对于优先级行为的描述:
 * - 高优先级事件打断低优先级事件
 * - 相等优先级的多个事件会被收敛为一次调度，否则为多次调度
 * - 对于因 IO 任务而等待的任务，即使该任务优先级高，我们仍将调度 CPU 任务
 * - 低优先级任务在被忽略多次后会转为高优先级任务
 *
 * 对于 Lanes 模型的描述:
 * - 可以把 Lanes 模型想成 操场的跑道，内圈的优先级高，若干个跑道组成一个优先级组。
 * 且 tiny-react 总是尝试处理高优先级组的任务。
 * - 每一个调度任务只能占用一条跑道, 如果有更高优先级的任务到来，即使当前由任务正在处理，
 * tiny-react 也会停下来转而处理该高优先级任务。如果由两个任务同时出现在同一类跑道，
 * 即相同优先级，tiny-react 会尝试将两次任务收敛为一次来处理。
 * - 对于需要等待 IO 操作来完成的任务，往往会被移动到外圈跑道，为更多 CPU 任务 “让道”，
 * 此时 IO 操作在外圈 “默默地跑”，一旦 IO 任务完成，会被移动到内部跑道以做处理。
 * 对于在外圈跑道待了很久的任务，tiny-react 会把它们移动到内圈以被处理。
 * - 技术上，Lanes 模型使用32位二进制来表示，并用位操作来实现判断与操作，假如突破32位
 * 会有一个等待区域，在该区域任务不会按照优先级排列，因为仅仅是等待区，等到时机成熟会一
 * 一依据上述优先级规则移动到跑道上。
 *
 * TODO 注明使用位操作的好处
 */
export class LanesCenter {
  // lanes
  private workInProgressLanes: Lanes = LanesSnapshot.NoLanes;
  private suspenseLanes: Lanes = LanesSnapshot.NoLanes;
  private waitingZone: WaitingLanes = [];

  constructor() {}

  public pushWork(work: SchedulerWork, priority: SchedulerWorkPriority) {}
}
