// AI助手存储

import { AssistantList, Assistant } from "@/types";
import { ASSISTANT_STORE_KEY, DEFAULT_ASSISTANTS } from "./constants";
import { getLocal, setLocal } from "./storage";

const getAssistantList = (): AssistantList => {
  let list = getLocal(ASSISTANT_STORE_KEY) as AssistantList;
  if (!list) {
    list = DEFAULT_ASSISTANTS.map((assistant, index) => {
      return {
        ...assistant,
        id: index + Date.now().toString(),
      };
    });
    updateAssistantList(list);
  }
  return list;
};

const updateAssistantList = (list: AssistantList) => {
  setLocal(ASSISTANT_STORE_KEY, list);
};

const addAssistant = (newAssistant: Assistant): AssistantList => {
  const list = getAssistantList();
  list.push(newAssistant);
  updateAssistantList(list);
  return list;
};

const updateAssistant = (
  id: string,
  data: Partial<Omit<Assistant, "id">>
): AssistantList => {
  const list = getAssistantList();
  const index = list.findIndex((item) => item.id === id);
  if (index > -1) {
    list[index] = { ...list[index], ...data };
    updateAssistantList(list);
  }
  return list;
};

const removeAssistant = (id: string): AssistantList => {
  const list = getAssistantList();
  const newList = list.filter((item) => item.id !== id);
  updateAssistantList(newList);
  return newList;
};

const getAssistant = (id: string): Assistant | null => {
  const list = getAssistantList();
  return list.find((item) => item.id === id) || null;
};

export default {
  getAssistantList,
  updateAssistantList,
  addAssistant,
  updateAssistant,
  removeAssistant,
  getAssistant,
};
