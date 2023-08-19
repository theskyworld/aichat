// Chat主聊天页面组件
import { Textarea, Button } from "@mantine/core";
import { useState } from "react";
import { getCompletion } from "@/utils/getCompletion";
import { ChatLogs } from "@/types";
export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState<string>("");

  const [chatList, setChatList] = useState<ChatLogs>([]);

  const getAIResp = async () => {
    const list = [
      ...chatList,
      {
        role: "user",
        content: prompt,
      },
    ];
    setChatList(list);
    const resp = await getCompletion({
      prompt: prompt,
    });
    setCompletion(resp.content);
    setChatList([
      ...list,
      {
        role: "assistant",
        content: resp.content,
      },
    ]);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {/* 展示AI返回的聊天内容 */}
      <div>
        {chatList.map((item, index) => (
          <div key={`${item.role}-${index}`}>
            <div>{item.role}</div>
            <div>{item.content}</div>
          </div>
        ))}
      </div>
      {/* 使用mantine中的Textarea组件来展示一个输入框，用于用于输入prompt内容 */}
      <Textarea
        placeholder="Enter your prompt"
        className="w-3/5"
        value={prompt}
        onChange={(evt) => setPrompt(evt.target.value)}
      ></Textarea>
      <Button onClick={() => getAIResp()}>Send</Button>
    </div>
  );
};
