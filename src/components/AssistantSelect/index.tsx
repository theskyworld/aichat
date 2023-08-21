// 聊天主界面中用于选择AI助手的组件
import React, { useEffect, useState } from "react";
import { Select } from "@mantine/core";
import { AssistantList, Assistant } from "@/types";
import * as assistantStorage from "@/utils/assistantStorage";
interface AssistantSelectProps {
  value?: string;
  loading?: boolean;
  onChange: (value: Assistant) => void;
}

export const AssistantSelect = ({
  value,
  loading = false,
  onChange,
}: AssistantSelectProps) => {
  const [list, setList] = useState<AssistantList>([]);
  useEffect(() => {
    const list = assistantStorage.getAssistantList();
    setList(list);
  }, []);
  const onAssistantChange = (value: string) => {
    const assistant = list.find((item) => item.id === value);
    onChange(assistant!);
  };

  return (
    <Select
      size="sm"
      onChange={onAssistantChange}
      value={value}
      className="w-32 mx-2"
      disabled={loading}
      data={list.map((item) => ({
        value: item.id,
        label: item.name,
      }))}
    ></Select>
  );
};
