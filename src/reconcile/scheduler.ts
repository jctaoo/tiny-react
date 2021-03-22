import { FiberLinkedList } from "./fiber";
import { Lanes } from "./lanes";
import { SchedulerWorkPriority } from "./schedulerWorkPriority";

export type TaskID = number;

export interface SchedulerWork {
  taskID: TaskID;
  
}

export abstract class AbstractScheduler<NativeNode> {
  abstract scheduleWorkOnFiber(
    work: SchedulerWork,
    fiber: FiberLinkedList<NativeNode>
  ): TaskID;
}
