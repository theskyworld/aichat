// Chat主聊天页面组件
import { Textarea, Button, ActionIcon, Popover } from "@mantine/core";
import Link from "next/link";
import { useState, KeyboardEvent } from "react";
import chatservice from "@/utils/chatService";
import { Assistant, MessageList } from "@/types";
import clsx from "clsx";
import * as chatStorage from "@/utils/chatStorage";
// import { clearMessage, getMessage, updateMessage } from "@/utils/chatStorage";
import { useEffect } from "react";
import {
  IconDotsVertical,
  IconEraser,
  IconSend,
  IconSendOff,
} from "@tabler/icons-react";
import chatService from "@/utils/chatService";
import { AssistantSelect } from "../AssistantSelect";

interface Props {
  sessionId: string;
}
export const Message = ({ sessionId }: Props) => {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState<string>("");
  // 使用loading设置输入框、发送消息的图标等是否进入loading状态
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageList>([]);
  const [assistant, setAssistant] = useState<Assistant>();

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
    const session = chatStorage.getSession(sessionId);
    console.log("🚀 ~ file: index.tsx:47 ~ useEffect ~ session:", session);
    setAssistant(session?.assistant);
    console.log("🚀 ~ file: index.tsx:48 ~ useEffect ~ assistant:", assistant);

    const msg = chatStorage.getMessage(sessionId);
    setMessage(msg);
    if (loading) {
      chatService.cancel();
    }
  }, [sessionId]);

  const onAssistantChange = (assistant: Assistant) => {
    setAssistant(assistant);
    chatStorage.updateSession(sessionId, {
      assistant: assistant.id,
    });
  };

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
      options: assistant,
      history: list.slice(-assistant?.max_log!),
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
    <div className="h-screen flex flex-col w-full">
      {/* 聊天页面中访问AI助手的入口 */}
      <div
        className={clsx(
          "flex",
          "justify-between",
          "items-center",
          "p-4",
          "shoadow-sm",
          "h-[6rem]"
        )}
      >
        <Popover width={100} position="bottom" withArrow shadow="sm">
          <Popover.Target>
            <Button
              size="sm"
              variant="subtle"
              className="px-1"
              rightIcon={<IconDotsVertical size="1rem" />}
            >
              AI 助手
            </Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Link href="/assistant">AI助手管理</Link>
          </Popover.Dropdown>
        </Popover>
        {/* 助手选择器 */}
        <AssistantSelect
          value={assistant?.id}
          onChange={onAssistantChange}
        ></AssistantSelect>
      </div>
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
      <div
        className={clsx(
          "flex",
          "justify-center",
          "my-4",
          "self-center",
          "items-center",
          "w-4/5",
          "mt-10",
          "mb-5"
        )}
      >
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
