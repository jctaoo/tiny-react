import { SchedulerWork } from "./scheduler";
import { SchedulerWorkPriority, schedulerWorkPriorityToLanesSnapshot } from "./schedulerWorkPriority";

/* 与二进制数特别的，我们将二进制的低位称 Lanes 的高位，反之亦然 */

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

export function pickHighestLanes(lanes: Lanes): Lanes {
  // -lanes + lanes = 0; 直观的，-lanes 就是 ～lanes + 1
  // 因此 (~ lanes + 1) & lanes 为 lanes 的最高位
  return lanes & -lanes;
}

export function pickLowestLane(lanes: Lanes): Lanes {
  // mdn https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/clz32
  const index = Math.clz32(lanes);
  return index < 0 ? LanesSnapshot.NoLanes : 1 << index;
}

export function pickArbitraryLane(lanes: Lanes): Lanes {
  // 如同 LanesCenter 的文档注释中所说，一旦可用的 lane 计算出出来后，从可用 lane 选哪一条并不重要，
  // 不会影响 lane 算法，选择 highest 是因为需要的计算相对 lowest 较少
  return pickHighestLanes(lanes);
}

/**
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
 * 对 Lanes 对操作说明: (仅以 16 位整数作为示例子)
 * work in progress lanes: 0000 0000 0000 0000
 * 开始处理一个调度任务，由用户点击按钮引起，因此优先级为 `InputDiscretePriority` (1 << 1) (0010);
 * 寻找是否被占用: ~wipLanes & priorityLanes  ====> 输出所有为想要有恰好为空的跑道
 *                      ====> NoLanes: 该优先级全部被占用
 *                      ====> Otherwise: 返回该结果，随意在结果里选择以为作为该调度任务的优先级 (只要是该结果内的，无论选取哪一位都
 *                                        不影响 lanes 算法)
 *
 *
 * TODO 注明使用位操作的好处
 */
export class LanesCenter {
  // lanes
  private workInProgressLanes: Lanes = LanesSnapshot.NoLanes;
  private suspenseLanes: Lanes = LanesSnapshot.NoLanes;
  private waitingZone: WaitingLanes = [];

  constructor() {
  }


  /**
   * 根据 权重 获取相应的 Lanes
   * @param priority 调度任务的优先级
   * @returns 当返回值为 undefined 时意味着现有 lanes 无法容纳新的任务
   * TODO
   */
  protected requestLanesOfPriority(
    priority: SchedulerWorkPriority
  ): Lanes | undefined {
    const priorityLanes = schedulerWorkPriorityToLanesSnapshot(priority);

    switch (priority) {
      case SchedulerWorkPriority.SyncPriority:
      case SchedulerWorkPriority.InputDiscretePriority: {
        const availableLane = pickArbitraryLane(~this.workInProgressLanes & priorityLanes);
        if (availableLane === LanesSnapshot.NoLanes) {
          return this.requestLanesOfPriority(SchedulerWorkPriority.InputContinuousPriority);
        }
        return availableLane;
      }
      case SchedulerWorkPriority.InputContinuousPriority: {
        const availableLane = pickArbitraryLane(~this.workInProgressLanes & priorityLanes);
        if (availableLane === LanesSnapshot.NoLanes) {
          return this.requestLanesOfPriority(SchedulerWorkPriority.ContinuousPriority);
        }
        return availableLane;
      }
      case SchedulerWorkPriority.ContinuousPriority:
        break;
      case SchedulerWorkPriority.DefaultPriority:
        break;
      case SchedulerWorkPriority.TransitionPriority:
        break;
      case SchedulerWorkPriority.RetryPriority:
        break;
      case SchedulerWorkPriority.IdlePriority:
        break;
      case SchedulerWorkPriority.OffscreenPriority:
        break;
      default:
        return undefined;
    }
  }

  public pushWork(work: SchedulerWork, priority: SchedulerWorkPriority) {
  }
}
