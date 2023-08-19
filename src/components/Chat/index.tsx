// Chat主聊天页面组件
import { Textarea, Button, ActionIcon } from "@mantine/core";
import { useState, KeyboardEvent } from "react";
import chatservice from "@/utils/chatService";
import { MessageList } from "@/types";
import clsx from "clsx";
import {
  clearChatLogs,
  getChatLogs,
  updateChatLogs,
} from "@/utils/chatStorage";
import { useEffect } from "react";
import { IconEraser, IconSend, IconSendOff } from "@tabler/icons-react";
import chatService from "@/utils/chatService";

const LOCAL_KEY = "ai-demo";
export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState<string>("");
  // 使用loading设置输入框、发送消息的图标等是否进入loading状态
  const [loading, setLoading] = useState(false);
  const [chatList, setChatList] = useState<MessageList>([]);

  chatservice.actions = {
    onCompleting(sug) {
      setSuggestion(sug);
    },
    onCompleted() {
      setLoading(false);
    },
  };

  useEffect(() => {
    const logs = getChatLogs(LOCAL_KEY);
    setChatList(logs);
  },[]);

  // 清除当前聊天中的所有聊天内容
  const onClear = () => {
    clearChatLogs(LOCAL_KEY);
    setChatList([]);
  };

  const setSuggestion = (suggestion: string) => {
    if (suggestion === "") return;
    const len = chatList.length;
    const lastMessage = len ? chatList[len - 1] : null;
    let newList: MessageList = [];
    if (lastMessage?.role === "assistant") {
      newList = [
        ...chatList.slice(0, len - 1),
        {
          ...lastMessage,
          content: suggestion,
        },
      ];
    } else {
      newList = [
        ...chatList,
        {
          role: "assistant",
          content: suggestion,
        },
      ];
    }
    setMessages(newList);
  };

  const setMessages = (msg: MessageList) => {
    setChatList(msg);
    updateChatLogs(LOCAL_KEY, msg);
  };

  const onSubmit = () => {
    if (loading) {
      return chatService.cancel();
    }
    if (!prompt.trim()) return;
    let list: MessageList = [
      ...chatList,
      {
        role: "user",
        content: prompt,
      },
    ];
    setMessages(list);
    setLoading(true);
    // 使用getStream向后端请求流式数据
    chatService.getStream({
      prompt,
      history: chatList.slice(-6),
    });
    setPrompt("");
  };

  // 输入框内按回车键发送消息
  const onkeyDown = (evt: KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.keyCode === 13 && !evt.shiftKey) {
      evt.preventDefault();
      onSubmit();
    }
  };

  // 根据输入的聊天内容（包含localStorage中存储的之前聊天中相关的聊天上下文），向接口发送请求
  // const getAIResp = async () => {
  //   setLoading(true);
  //   const list = [
  //     ...chatList,
  //     {
  //       role: "user",
  //       content: prompt,
  //     },
  //   ];
  //   setMessages(list);
  //   const resp = await getCompletion({
  //     prompt: prompt,
  //     // 每次发送消息时，同时携带之前最近四条的消息记录发送给AI，实现多轮对话功能
  //     // 取之前最近几条，可根据具体业务进行确定
  //     history: chatList.slice(-4),
  //   });
  //   // 输入prompt后发送消息时，设置输入框内容为空
  //   setPrompt("");

  //   // setCompletion(resp.content);
  //   setMessages([
  //     ...list,
  //     {
  //       role: "assistant",
  //       content: resp.content,
  //     },
  //   ]);
  //   setLoading(false);
  // };

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
        <ActionIcon onClick={() => onSubmit()}>
          {loading ? <IconSendOff /> : <IconSend />}
        </ActionIcon>
        {/* <Button>Send</Button> */}
      </div>
    </div>
  );
};
