import { ChatLogsStorage, MessageList, Session, SessionList } from "@/types";
import { getLocal, setLocal } from "./storage";
import { SESSION_STORE_KEY, MESSAGE_STORE_KEY } from "./constants";

/** message */
export function getMessageStore() {
  let list = getLocal<ChatLogsStorage>(MESSAGE_STORE_KEY);

  if (!list) {
    list = {};
    setLocal(MESSAGE_STORE_KEY, list);
  }

  return list;
}

export function getMessage(id: string) {
  const logs = getMessageStore();
  return logs[id] || [];
}

export function updateMessage(id: string, newLog: MessageList) {
  const logs = getMessageStore();
  logs[id] = newLog;
  setLocal(MESSAGE_STORE_KEY, logs);
}

export function clearMessage(id: string) {
  const logs = getMessageStore();
  if (logs[id]) {
    logs[id] = [];
  }
  setLocal(MESSAGE_STORE_KEY, logs);
}

/** session */
export const getSessionStore = (): SessionList => {
  let list: SessionList = getLocal(SESSION_STORE_KEY) as SessionList;
  if (!list) {
    const session = {
      name: "chat",
      id: Date.now().toString(),
    };
    list = [session];
    updateMessage(session.id, []);
    setLocal(SESSION_STORE_KEY, list);
  }
  return list;
};

export const updateSessionStore = (list: SessionList) => {
  setLocal(SESSION_STORE_KEY, list);
};

export const addSession = (session: Session) => {
  const list = getSessionStore();
  list.push(session);
  updateSessionStore(list);
  return list;
};

export const getSession = (id: string) => {
  const list = getSessionStore();
  return list.find((item) => item.id === id) || {};
};

export const updateSession = (
  id: string,
  data: Partial<Omit<Session, "id">>
) => {
  const list = getSessionStore();
  const index = list.findIndex((item) => item.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...data };
    updateSessionStore(list);
  }
  return list;
};

export const removeSession = (id: string) => {
  const list = getSessionStore();
  const newList = list.filter((item) => item.id !== id);
  updateSessionStore(newList);
  return newList;
};
