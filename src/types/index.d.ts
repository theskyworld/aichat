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