import { Actions, StreamParams } from "@/types/index.d";
// 调用chat.ts中的handler方法，进行数据的请求

// export const getCompletion = async (params: Props) => {
//   const resp = await fetch("/api/chat", {
//     headers: {
//       "Content-Type": "application/json",
//     },
//     method: "POST",
//     body: JSON.stringify(params),
//   });

//   if (!resp.ok) {
//     throw new Error(resp.statusText);
//   }

//   const data = resp.json();
//   return data;
// };

class ChatService {
  // 单例模式
  private static instance: ChatService;
  // 增加正在进行中和进行完成的回调函数
  public actions?: Actions;
  // 增加在响应过程中随时终止响应的controller
  private controller: AbortController;

  private constructor() {
    // 实例化contoller
    this.controller = new AbortController();
  }

  // 生成一个获取单例模式中实例的方法
  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    // 将实例返回
    return ChatService.instance;
  }

  // 添加一个异步的getStream方法，包含一个params参数

  public async getStream(params: StreamParams) {
    // 从params中解析出prompt和history以及options，后两个分别赋默认值
    const { prompt, history = [], options = {} } = params;
    // 存储最终解析后的展示在页面中的响应消息内容
    let suggestion = "";
    try {
      const resp = await fetch("/v1", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ prompt, history, options }),
        signal: this.controller.signal,
      });
      const data = resp.body;
      if (!data) {
        return;
      }

      // 循环读取数据
      const reader = data.getReader();
      const decoder = new TextDecoder("utf-8");
      let done = false;
      while (!done) {
        const { value, done: doneReadingStream } = await reader.read();
        done = doneReadingStream;
        const chunkValue = decoder.decode(value);
        suggestion += chunkValue;

        // 执行外部指定的正在进行中的回调函数
        this.actions?.onCompleting(suggestion);
        // 让while循环间隔执行，每次隔0.1s
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    } catch (err) {
      console.log(err);
    } finally {
      // 执行外部指定的完成的回调函数
      this.actions?.onCompleted?.(suggestion);
      this.controller = new AbortController();
    }
  }

  // 外部通过调用cancel方法来停止当前响应
  public cancel() {
    this.controller.abort();
  }
}

// 获取ChatService的实例并默认导出
const chatService = ChatService.getInstance();
export default chatService;
