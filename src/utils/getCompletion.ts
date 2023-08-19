import { Props } from "@/types/index.d";
// 调用chat.ts中的handler方法，进行数据的请求

export const getCompletion = async (params: Props) => {
  const resp = await fetch("/api/chat", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(params),
  });

  if (!resp.ok) {
    throw new Error(resp.statusText);
  }

  const data = resp.json();
  return data;
};
