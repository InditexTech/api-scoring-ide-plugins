// SPDX-FileCopyrightText: 2023 Industria de Diseño Textil S.A. INDITEX
//
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useEffect, useRef } from "react";
import EventBus from "../utils/event-bus";
import type { MessageHandler } from "../types";

type VSCodeMessage<P> = { command: string; payload: P };

export default function useEventHandler<P, M extends VSCodeMessage<P> = VSCodeMessage<P>>(
  command: string,
  handler: MessageHandler<P>,
) {
  const eventBusRef = useRef<EventBus | null>(null);

  function getEventBus() {
    if (eventBusRef.current !== null) {
      return eventBusRef.current;
    }
    const eventBus = new EventBus();
    eventBusRef.current = eventBus;
    return eventBus;
  }

  useEffect(() => {
    getEventBus().register(command, handler);
  }, [command, handler]);

  const onMessageReceived = useCallback(({ origin, data }: MessageEvent<M>) => {
    const { command: receivedCommand, payload } = data;

    if (origin.startsWith("vscode-webview://")) {
      getEventBus().dispatch(receivedCommand, payload);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("message", onMessageReceived);

    return () => {
      window.removeEventListener("message", onMessageReceived);
    };
  }, [onMessageReceived]);
}
