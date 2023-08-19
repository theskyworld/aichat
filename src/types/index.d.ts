export declare interface ChatLogType {
  role: string;
  content: string;
}

export declare interface Props {
  prompt: string;
  history?: ChatLogType[];
  options?: {
    temperature?: number;
    max_tokens?: number;
  };
}

export declare type ChatLogs = ChatLogType[];
export declare interface ChatLogsStorage {
  [key: string]: ChatLogs;
}
