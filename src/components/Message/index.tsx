// Chat主聊天页面组件
import { Textarea, Button, ActionIcon } from "@mantine/core";
import { useState, KeyboardEvent } from "react";
import chatservice from "@/utils/chatService";
import { MessageList } from "@/types";
import clsx from "clsx";
import * as chatStorage from "@/utils/chatStorage";
// import { clearMessage, getMessage, updateMessage } from "@/utils/chatStorage";
import { useEffect } from "react";
import { IconEraser, IconSend, IconSendOff } from "@tabler/icons-react";
import chatService from "@/utils/chatService";

interface Props {
  sessionId: string;
}
export const Message = ({ sessionId }: Props) => {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState<string>("");
  // 使用loading设置输入框、发送消息的图标等是否进入loading状态
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageList>([]);

  const updateMessage = (msg: MessageList) => {
    setMessage(msg);
    chatStorage.updateMessage(sessionId, msg);
  };

  chatservice.actions = {
    onCompleting(sug) {
      setSuggestion(sug);
    },
    onCompleted() {
      setLoading(false);
    },
  };

  useEffect(() => {
    const msg = chatStorage.getMessage(sessionId);
    setMessage(msg);
    if (loading) {
      chatService.cancel();
    }
  }, [sessionId]);

  // 清除当前聊天中的所有聊天内容
  const onClear = () => {
    // chatStorage.clearMessage(sessionId);
    // setMessage([]);
    updateMessage([]);
  };

  const setSuggestion = (suggestion: string) => {
    if (suggestion === "") return;
    const len = message.length;
    const lastMessage = len ? message[len - 1] : null;
    let newList: MessageList = [];
    if (lastMessage?.role === "assistant") {
      newList = [
        ...message.slice(0, len - 1),
        {
          ...lastMessage,
          content: suggestion,
        },
      ];
    } else {
      newList = [
        ...message,
        {
          role: "assistant",
          content: suggestion,
        },
      ];
    }
    setMessages(newList);
  };

  const setMessages = (msg: MessageList) => {
    setMessage(msg);
    chatStorage.updateMessage(sessionId, msg);
  };

  const onSubmit = () => {
    if (loading) {
      return chatService.cancel();
    }
    if (!prompt.trim()) return;
    let list: MessageList = [
      ...message,
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
      history: message.slice(-6),
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
  //     ...message,
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
  //     history: message.slice(-4),
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
    <div className="h-screen flex flex-col items-center w-full">
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
        {message.map((item, index) => (
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
