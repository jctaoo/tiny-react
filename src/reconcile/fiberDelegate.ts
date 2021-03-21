/**
 * Copyright (c) 2021 jctaoo
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// 用于平台相关的数据转换至 Fiber 结构以及与 Fiber 相关的操作
// 对于平台相关操作，需要实现 FiberDelegate, 并交由 reconcile 模块进行管理，
// FiberDelegate 是 reconcile 模块与其它平台相关模块的通信方式。
//
// Notes:
// - 平台相关模块: 如 dom，native，web canvas
export abstract class FiberDelegate {}
