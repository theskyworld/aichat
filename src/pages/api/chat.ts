// chat聊天页面
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // 模拟用户user向AI发出的对话信息
  const data = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        // role分为user、assistant和system，分别对应对话过程中的用户、AI和中间处理系统的角色
        // 不同角色之间，对content有着不同的处理
        role: "user",
        content: "hello",
      },
    ],
  };

  // 向openai接口发起POST请求
  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      // process.env.OPENAI_API_KEY 从根目录下的.env文件中获取OPENAI_API_KEY的值
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });

  const json = await resp.json();
  res.status(200).json(json);
}
