export const MESSAGE_STORE_KEY = "ai_assistant_message";
export const SESSION_STORE_KEY = "ai_assistant_session";
export const ASSISTANT_STORE_KEY = "ai_assistant_assistant";

// 默认的AI助手
export const DEFAULT_ASSISTANTS = [
  {
    name: "AI 助手",
    prompt: "你是一个AI助手，任务是详细地回答用户的每个问题",
    temperature: 0.7,
    max_log: 4,
    max_tokens: 800,
  },
];
