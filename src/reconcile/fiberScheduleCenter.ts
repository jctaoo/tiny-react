import { FiberEffectLinkedList, FiberLinkedList } from "./fiber";
import { FiberDelegate } from "./fiberDelegate";
import { Lanes } from "./lanes";

// Fiber 调度中心，除了 `FiberDelegate` 外，一切对外的 Reconcile 模块 Api 都在这里
// `FiberScheduleCenter` 只支持一个 Fiber 的任务与调度，简而言之，只能用 `FiberScheduleCenter`
// 来管理一个视图根，可以创建多个 `FiberScheduleCenter` 来突破这一限制
export class FiberScheduleCenter<NativeNode> {
  private currentFiber: FiberLinkedList<NativeNode> | undefined;
  private workInProgressFiber: FiberLinkedList<NativeNode> | undefined;
  private effectFiber: FiberEffectLinkedList<NativeNode> | undefined;

  private readonly delegate: FiberDelegate;


  constructor(delegate: FiberDelegate) {
    this.delegate = delegate;
  }

  refreshNativeNode(newNode: NativeNode) {

  }

  dispatchUpdate(fiber: FiberLinkedList<NativeNode>) {

  }
 }
