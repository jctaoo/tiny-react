/**
 * Copyright (c) 2021 jctaoo
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { UpdateEffect } from "./effect";

export type FiberRef<NativeNode> = (node?: NativeNode) => void;
export type FiberEffectList<NativeNode> = FiberNode<NativeNode>;

export interface FiberNode<NativeNode, Props = {}, State = {}> {
  key?: string;

  sibling?: FiberNode<NativeNode>;
  child?: FiberNode<NativeNode>;
  return?: FiberNode<NativeNode>;

  // native node
  // for example: in dom, NativeNode is HTMLElementXXX
  node: NativeNode;
  ref?: FiberRef<NativeNode>;

  // effects
  updateEffect?: UpdateEffect;
  nextEffectNode?: FiberNode<NativeNode>;

  // state & props
  currentProps?: Props;
  nextProps?: Props;
  currentState?: State;

  // work in progress
  alternate?: FiberNode<NativeNode, Props, State>;
}