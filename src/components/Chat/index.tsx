// Chat主聊天页面组件
import { Textarea, Button, ActionIcon } from "@mantine/core";
import { useState, KeyboardEvent } from "react";
import { getCompletion } from "@/utils/getCompletion";
import { ChatLogs } from "@/types";
import clsx from "clsx";
import {
  clearChatLogs,
  getChatLogs,
  updateChatLogs,
} from "@/utils/chatStorage";
import { useEffect } from "react";
import { IconEraser, IconSend } from "@tabler/icons-react";

const LOCAL_KEY = "ai-demo";
export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState<string>("");
  // 使用loading设置输入框、发送消息的图标等是否进入loading状态
  const [loading, setLoading] = useState(false);
  const [chatList, setChatList] = useState<ChatLogs>([]);

  useEffect(() => {
    const logs = getChatLogs(LOCAL_KEY);
    setChatList(logs);
  });

  // 清除当前聊天中的所有聊天内容
  const onClear = () => {
    clearChatLogs(LOCAL_KEY);
    setChatList([]);
  };

  const setChatLogs = (logs: ChatLogs) => {
    setChatList(logs);
    updateChatLogs(LOCAL_KEY, logs);
  };

  // 输入框内按回车键发送消息
  const onkeyDown = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.keyCode === 13 && !evt.shiftKey) {
      evt.preventDefault();
      getAIResp();
    }
  };

  // 根据输入的聊天内容（包含localStorage中存储的之前聊天中相关的聊天上下文），向接口发送请求
  const getAIResp = async () => {
    setLoading(true);
    const list = [
      ...chatList,
      {
        role: "user",
        content: prompt,
      },
    ];
    setChatLogs(list);
    const resp = await getCompletion({
      prompt: prompt,
      // 每次发送消息时，同时携带之前最近四条的消息记录发送给AI，实现多轮对话功能
      // 取之前最近几条，可根据具体业务进行确定
      history: chatList.slice(-4),
    });
    // 输入prompt后发送消息时，设置输入框内容为空
    setPrompt("");

    setCompletion(resp.content);
    setChatLogs([
      ...list,
      {
        role: "assistant",
        content: resp.content,
      },
    ]);
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col items-center">
      {/* 展示AI返回的聊天内容 */}
      <div
        className={clsx(
          "flex-col",
          "h-[calc(100vh-10rem)]",
          "w-full",
          "overflow-y-auto",
          "rounded-sm",
          "px-8"
        )}
      >
        {chatList.map((item, index) => (
          <div
            key={`${item.role}-${index}`}
            className={clsx(
              {
                flex: item.role === "user",
                "flex-col": item.role === "user",
                "items-end": item.role === "user",
              },
              "mt-4"
            )}
          >
            <div>{item.role}</div>
            <div
              className={clsx(
                "rounded-md",
                "shadow-md",
                "px-4",
                "py-2",
                "mt-1",
                "w-full",
                "max-w-4xl"
              )}
            >
              {item.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center w-3/5">
        {/* 使用图标组件,添加输入框前清除当前所有聊天记录的图标 */}
        <ActionIcon
          disabled={loading}
          className="mr-2"
          onClick={() => onClear()}
        >
          <IconEraser></IconEraser>
        </ActionIcon>
        {/* 使用mantine中的Textarea组件来展示一个输入框，用于用于输入prompt内容 */}
        <Textarea
          placeholder="Enter your prompt"
          className="w-full mr-5"
          value={prompt}
          onChange={(evt) => setPrompt(evt.target.value)}
          onKeyDown={(evt) => onkeyDown(evt)}
          disabled={loading}
        ></Textarea>
        {/* 将button该为一个发送消息的图标 */}
        <ActionIcon loading={loading} onClick={() => getAIResp()}>
          <IconSend></IconSend>
        </ActionIcon>
        {/* <Button>Send</Button> */}
      </div>
    </div>
  );
};
