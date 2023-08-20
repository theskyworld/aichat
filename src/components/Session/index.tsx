// 主聊天页面左侧创建多次聊天会话的组件
import { SessionList } from "@/types";
import React, { useEffect, useState } from "react";
import * as chatStorage from "@/utils/chatStorage";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import clsx from "clsx";
import { IconMessagePlus, IconTrash } from "@tabler/icons-react";
import { EditableText } from "../EditableText";

interface SessionProps {
  sessionId: string;
  onChange: (arg: string) => void;
}

export const Session = ({ sessionId, onChange }: SessionProps) => {
  const [sessionList, setSessionList] = useState<SessionList>([]);

  // 用于切换页面的颜色主题
  const { colorScheme } = useMantineColorScheme();

  //添加左侧聊天会话列表中每一项选中(hover)和没选中时的样式
  const itemBaseClasses =
    "flex cursor-poninter h-[2.4rem] items-center justify-around group px-4 rounded-md";
  const generateItemClasses = (
    id: string,
    sessionId: string,
    colorScheme: string
  ) => {
    return clsx(itemBaseClasses, {
      "hover:bg-gray-300/60": colorScheme === "light",
      "bg-gray-200/60": id !== sessionId && colorScheme === "light",
      "bg-gray-300": id === sessionId && colorScheme === "light",
      "hover:bg-zinc-800/50": colorScheme === "dark",
      "bg-zinc-800/20": id !== sessionId && colorScheme === "dark",
      "bg-zinc-800/90": id === sessionId && colorScheme === "dark",
    });
  };

  useEffect(() => {
    const list = chatStorage.getSessionStore();
    setSessionList(list);
  }, []);

  // 创建新的聊天会话
  const createSession = () => {
    const newSession = {
      name: `session-${sessionList.length + 1}`,
      id: Date.now().toString(),
    };
    onChange(newSession.id);
    const newList = chatStorage.addSession(newSession);
    setSessionList(newList);
  };

  const updateSession = (name : string) => {
    let sessionList = chatStorage.updateSession(sessionId, { name });
    setSessionList(sessionList);
  }

  // 删除聊天会话
  const removeSession = (id: string) => {
    let list = chatStorage.removeSession(id);
    if (sessionId === id) {
      onChange(list[0].id);
    }
    setSessionList(list);
  };
  return (
    <div
      className={clsx(
        {
          "bg-black/10": colorScheme === "dark",
          "bg-gray-100": colorScheme === "light",
        },
        "h-screen",
        "w-64",
        "flex",
        "flex-col",
        "px-2"
      )}
    >
      <div className="flex justify-between py-2 w-full">
        <ActionIcon onClick={() => createSession()} color="green" size="sm">
          <IconMessagePlus size="1rem"></IconMessagePlus>
        </ActionIcon>
      </div>
      <div
        className={clsx(
          "pb-4",
          "overflow-y-auto",
          "scrollbar-none",
          "flex",
          "flex-col",
          "gap-y-2"
        )}
      >
        {sessionList.map(({ id, name }) => (
          <div
            key={id}
            onClick={() => onChange(id)}
            className={generateItemClasses(id, sessionId, colorScheme)}
          >
            {/* 让当前聊天会话的名字可被编辑修改 */}
            {/* <div>{name}</div> */}
            <EditableText text={name} onSave={(name) => updateSession(name)}></EditableText>
            {sessionList.length > 1 ? (
              <IconTrash
                size=".8rem"
                color="gray"
                onClick={(evt) => {
                  evt.stopPropagation();
                  removeSession(id);
                }}
                className="mx-1 invisible group-hover:visible"
              ></IconTrash>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
