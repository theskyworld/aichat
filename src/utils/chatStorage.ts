import { ChatLogsStorage, MessageList } from "@/types";
import { getLocal, setLocal } from "./storage";

const CHAT_LOGS_KEY = "ai_chat_logs";

export function getChatLogsContainer() {
  let list = getLocal<ChatLogsStorage>(CHAT_LOGS_KEY);

  if (!list) {
    list = {};
    setLocal(CHAT_LOGS_KEY, list);
  }

  return list;
}

export function getChatLogs(id: string) {
  const logs = getChatLogsContainer();
  return logs[id] || [];
}

export function updateChatLogs(id: string, newLog: MessageList) {
  const logs = getChatLogsContainer();
  logs[id] = newLog;
  setLocal(CHAT_LOGS_KEY, logs);
}

export function clearChatLogs(id: string) {
  const logs = getChatLogsContainer();
  if (logs[id]) {
    logs[id] = [];
  }
  setLocal(CHAT_LOGS_KEY, logs);
}
