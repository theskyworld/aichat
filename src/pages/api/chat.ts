// chat聊天页面
import type { NextApiRequest, NextApiResponse } from "next";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 从用户发出的请求体中获取prompt提示词、携带的历史记录内容(用于在当前对话中能访问之前的聊天上下文内容)，配置信息
  const { prompt, history = [], options = {} } = req.body;

  // 模拟用户user向AI发出的对话信息
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      // role分为user、assistant和system，分别对应对话过程中的用户、AI和中间处理系统的角色
      // 不同角色之间，对content有着不同的处理
      // 配置系统角色
      {
        role: "system",
        content: "you are a AI assistant",
      },
      ...history,
      {
        role: "user",
        content: prompt,
      },
    ],
    ...options,
  };

  // 向openai接口发起POST请求
  // https://api.openai.com/v1/chat/completions
  const resp = await fetch("", {
    headers: {
      // process.env.OPENAI_API_KEY 从根目录下的.env文件中获取OPENAI_API_KEY的值
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  const json = await resp.json();
  res.status(200).json({ ...json.choices[0].message });
}
