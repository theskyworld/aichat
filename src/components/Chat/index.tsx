import React, { useEffect, useState } from "react";
import { Message } from "../Message";
import { Session } from "../Session";
import * as chatStorage from "@/utils/chatStorage";
import { MediaQuery } from "@mantine/core";

export const Chat = () => {
  // 当前聊天会话的id
  const [sessionId, setSessionId] = useState<string>("");
  // 页面初始化时
  useEffect(() => {
    const init = () => {
      // 先取出所有的聊天会话展示在左侧会话栏中
      const list = chatStorage.getSessionStore();
      // 默认取第一个会话展示在当前聊天页面中
      const id = list[0].id;
      setSessionId(id);
      };
      init();
  }, []);

  return (
    <div className="h-screen flex w-screen">
      <MediaQuery
        smallerThan="md"
        styles={{ width: "0 !important", padding: "0 !important" , overflow : "hidden"}}
      >
        <Session sessionId={sessionId} onChange={setSessionId}></Session>
      </MediaQuery>
      <Message sessionId={sessionId}></Message>
    </div>
  );
};
