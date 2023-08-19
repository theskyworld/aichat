// Chat主聊天页面组件
import { Textarea, Button } from "@mantine/core";
import { useState } from "react";
import { getCompletion } from "@/utils/getCompletion";
export const Chat = () => {
  const [prompt, setPrompt] = useState("");
  const [completion, setCompletion] = useState<string>("");

  const getAIResp = async () => {
    const resp = await getCompletion({
      prompt: prompt,
    });
    setCompletion(resp.content);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {/* 展示AI返回的聊天内容 */}
      <div>{completion}</div>
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
