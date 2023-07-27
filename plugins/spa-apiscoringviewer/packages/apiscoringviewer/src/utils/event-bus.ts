// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import type { MessageHandler } from "../types";

// Centralizes messages comming from VSCode side
export default class EventBus {
  handlers = new Map();

  register<P>(command: string, handler: MessageHandler<P>) {
    const nextHandlers = this.handlers.get(command) ?? [];
    nextHandlers.push(handler);
    this.handlers.set(command, nextHandlers);
  }

  dispatch<P>(command: string, payload: P) {
    const subscribers = this.handlers.get(command) ?? [];

    subscribers.forEach((handler: MessageHandler<P>) => handler(payload));
  }
}
