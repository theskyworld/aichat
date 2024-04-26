// chat聊天页面
import { StreamPayload } from "@/types";
import type { NextRequest } from "next/server";
// 从eventsource-parser中导入
// 解析后端发送的流式数据,解析成文本格式
// https://www.npmjs.com/package/eventsource-parser
import {
  createParser,
  ParseEvent,
  ReconnectInterval,
} from "eventsource-parser";

export default async function handler(req: NextRequest) {
  // 从用户发出的请求体中获取prompt提示词、携带的历史记录内容(用于在当前对话中能访问之前的聊天上下文内容)，配置信息
  // 通过history开启多轮对话的功能，携带前几轮对话的能让发送给AI，实现在当前对话中能够记住之前对话的内容
  const { prompt, history = [], options = {} } = await req.json();
  const { max_tokens, temperature } = options;
  // 模拟用户user向AI发出的对话信息
  const data = {
    model: "gpt-4",
    messages: [
      // role分为user、assistant和system，分别对应对话过程中的用户、AI和中间处理系统的角色
      // 不同角色之间，对content有着不同的处理
      // 配置系统角色
      {
        role: "system",
        content: options.prompt,
      },
      ...history,
      {
        role: "user",
        content: prompt,
      },
    ],
    // 告诉openai API 开启流式响应
    stream: true,
    temperature: +temperature || 0.7,
    max_tokens: +max_tokens || 1000,
  };

  // 向openai接口发起POST请求
  // https://api.openai.com/v1/chat/completions
  // const resp = await fetch("", {
  //   headers: {
  //     // process.env.OPENAI_API_KEY 从根目录下的.env文件中获取OPENAI_API_KEY的值
  //     Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   method: "POST",
  //   body: JSON.stringify(data),
  // });

  // const json = await resp.json();
  // res.status(200).json({ ...json.choices[0].message });

  // 请求流式响应
  const requestStream = async (payload: StreamPayload) => {
    let counter = 0;
    const OPENAI_API_KEY =
      "sk-CMATnZ54mL97aLGHPBoNVGhlQi5BSQKCC630NygjAgKJZxRp";
    const resp = await fetch("https://chattsw.site/v1/chat/completions", {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (resp.status !== 200) {
      return resp.body;
    }

    return createStream(resp, counter);
  };

  // 根据接口返回的内容创建stream流，用于页面中进行流式响应展示
  const createStream = (respsonse: Response, counter: number) => {
    // 解析二进制流
    const decoder = new TextDecoder("utf-8");
    const encoder = new TextEncoder();
    return new ReadableStream({
      async start(controller) {
        const onParse = (event: ParseEvent | ReconnectInterval) => {
          if (event.type === "event") {
            const data = event.data;
            // 如果不需要进行解析
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            // 进行数据的解析
            try {
              const json = JSON.parse(data);
              const text = json.choices[0]?.delta?.content || "";

              // 不处理换行符
              if (counter < 2 && (text.match(/\n/) || []).length) {
                return;
              }
              const q = encoder.encode(text);
              controller.enqueue(q);
              counter++;
            } catch (error) {
              console.error(error);
            }
          }
        };
        const parser = createParser(onParse);
        for await (const chunk of respsonse.body as any) {
          // console.log(decoder.decode(chunk));
          parser.feed(decoder.decode(chunk));
        }
      },
    });
  };

  const stream = await requestStream(data);
  return new Response(stream);
}

export const config = {
  runtime: "edge",
};
