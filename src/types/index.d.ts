export interface ChatLogType {
  role: string;
  content: string;
}

export interface Props {
  prompt: string;
  history?: ChatLogType[];
  options?: {
    temperature?: number;
    max_tokens?: number;
  };
}
