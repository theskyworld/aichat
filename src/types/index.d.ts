export type Role = "user" | "assistant" | "system";

export declare interface Message {
  role: string;
  content: string;
}

export declare interface StreamParams {
  prompt: string;
  history?: Message[];
  options?: {
    temperature?: number;
    max_tokens?: number;
  };
}

export declare type MessageList = Message[];
export declare interface ChatLogsStorage {
  [key: string]: MessageList;
}

export declare interface StreamPayload {
  model: string;
  message: MessageList;
  temperature?: number;
  stream: boolean;
  max_tokens?: number;
}

export declare interface Actions {
  onCompleting: (sug: stirng) => void;
  onCompleted?: (sug: string) => void;
}

export declare interface Session {
  name: string;
  id: string;
  assistant?: string;
}
export declare type SessionInfo = Omit<Session, "assistant"> & {
  assistant: Assistant;
};

export declare type SessionList = Session[];

// AI助手
export declare interface Assistant {
  id: string;
  name: string;
  description?: string;
  prompt: string;
  temperature?: number;
  max_log: number;
  max_tokens: number;
}

export declare type AssistantList = Assistant[];

export type EditAssistant = Omit<Assistant, "id"> &
  Partial<Pick<Assistant>, "id">;
