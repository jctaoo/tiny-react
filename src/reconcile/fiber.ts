import { UpdateEffect } from "./effect";

export type FiberRef<NativeNode> = (node?: NativeNode) => void;
export type FiberLinkedList<NativeNode> = FiberNode<NativeNode>;
export type FiberEffectLinkedList<NativeNode> = FiberNode<NativeNode>;

// FiberNode 是一个自定义的 `可中断` 的调用栈节点，与 JavaScript 调用栈最大的不同
// 是 FiberNode 可以中断执行并恢复执行
//
// Fiber 是一个 `单链表` 的数据结构，这有助于实现上面提到的目标
// 每一个 FiberTree 都会有输出，由叶节点 (无后代的节点) 产生并一层一层传输到树上
//
// 实际上，在 tiny-react 运行中，会构造两个 Fiber 链条，其中一个称之为 current fiber，
// 另一个则为 work in progress fiber，从名字可以看出，前者代表已经在视图上锁表现出来的，
// 后者则是正处于工作状态中的
// 技术上，创建一个 work in progress fiber 通常采用 clone current fiber 来实现以避免
// 重复操作，每一个 FiberNode 的 alternate 属性用来连接另一个链条上的 最终表示同一个元素 (在
// 浏览器中它是 dom 元素) 的 FiberNode
// 同 React 一样，tiny-react 采用 `双缓冲` 机制来渲染视图结果，当 work in progress fiber
// 被标记为完成，我们会将 current 指向 work in progress fiber，并丢弃 曾今的 current fiber
export interface FiberNode<
  NativeNode,
  Props = Object,
  State = Object,
  Content = Object
> {
  key?: string;

  sibling?: FiberNode<NativeNode>;
  child?: FiberNode<NativeNode>;
  previous?: FiberNode<NativeNode>;

  // native node
  // for example: in dom, NativeNode is HTMLElementXXX
  node: NativeNode;

  // effect
  updateEffect?: UpdateEffect;
  nextEffectNode?: FiberNode<NativeNode>;

  // state & props & content
  currentProps?: Props;
  nextProps?: Props;
  currentState?: State;
  content?: Content;

  // work in progress
  alternate?: FiberNode<NativeNode, Props, State>;
}
