// AI助手页面组件
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { AssistantList, EditAssistant } from "@/types";
import { useDisclosure } from "@mantine/hooks";
import assistantStorage from "@/utils/assistantStorage";
import { notifications } from "@mantine/notifications";
import { DEFAULT_ASSISTANTS } from "@/utils/constants";
import Link from "next/link";
import { ActionIcon, Card, Text, Group, Drawer, Badge } from "@mantine/core";
import { IconChevronLeft, IconUserPlus, IconPencil } from "@tabler/icons-react";
import { AssistantConfig } from "@/components/AssistantConfig";

const Assistant: NextPage = () => {
  const [assistantList, setAssistantList] = useState<AssistantList>([]);
  const [opened, drawerHandler] = useDisclosure(false);
  const [editAssistant, setEditAssistant] = useState<EditAssistant>();

  // 初始显式的assistant
  useEffect(() => {
    const list = assistantStorage.getAssistantList();
    setAssistantList(list);
  }, []);

  // 操作成功的通知
  function showNotification(message: string) {
    notifications.show({
      id: "Success",
      title: "Success",
      message,
      color: "green",
      autoClose: 3000,
    });
  }
  function saveAssistant(data: EditAssistant) {
    if (data.id) {
      let newAssistantList = assistantStorage.updateAssistant(data.id, data);
      setAssistantList(newAssistantList);
    } else {
      const newAssistant = {
        ...data,
        id: Date.now().toString(),
      };
      let newAssistantList = assistantStorage.addAssistant(newAssistant);
      setAssistantList(newAssistantList);
    }
    showNotification("保存成功!");
    drawerHandler.close();
  }

  // 删除assistant
  function removeAssistant(id: string) {
    let newAssistantList = assistantStorage.removeAssistant(id);
    setAssistantList(newAssistantList);
    showNotification("删除成功!");
    drawerHandler.close();
  }

  function onEditAssistant(data: EditAssistant) {
    setEditAssistant(data);
    drawerHandler.open();
  }

  function onAddAssistant() {
    const newAssistant = {
      ...DEFAULT_ASSISTANTS[0],
      name: `AI助理_${assistantList.length + 1}`,
    };
    setEditAssistant(newAssistant);
    drawerHandler.open();
  }

  return (
    <div className="h-screen flex flex-col">
      {/* AI助手页面header */}
      <div className="flex justify-between p-4 shadow-sm">
        {/* 返回按钮左箭头 */}
        <Link href="/">
          <ActionIcon>
            <IconChevronLeft />
          </ActionIcon>
        </Link>
        {/* header中的中间标题 */}
        <Text weight={500} size="lg">
          AI助手
        </Text>
        {/* header中右边新增助手的图标 */}
        <ActionIcon onClick={() => onAddAssistant()}>
          <IconUserPlus />
        </ActionIcon>
      </div>

      {/* AI助手页面content */}

      <div className="flex gap-8 flex-wrap p-4 overflow-y-auto">
        {assistantList.map((item) => (
          // 展示每个助手信息的卡片
          <Card
            key={item.id}
            shadow="sm"
            padding="lg"
            radius="md"
            className="w-full max-x-sm group transition-all duration-300"
          >
            <Text weight={500} className="line-clamp-1">
              {item.name}
            </Text>
            <Text size="sm" color="dimmed" className="line-clamp-3 mt-2">
              {item.prompt}
            </Text>
            <Group className="mt-4 flex items-center">
              <Badge size="md" color="green" radius="sm">
                TOKEN : {item.max_tokens}
              </Badge>
              <Badge size="md" color="blue" radius="sm">
                TEMP : {item.temperature}
              </Badge>
              <Badge size="md" color="cyan" radius="sm">
                LOGS : {item.max_log}
              </Badge>
            </Group>
            {/* 编辑当前AI助手信息 */}
            <Group className="w-full flex justify-end items-center opacity-0 transition-all duration-300 group-hover:opacity-100">
              <ActionIcon size="sm" onClick={() => onEditAssistant(item)}>
                <IconPencil />
              </ActionIcon>
            </Group>
          </Card>
        ))}
      </div>
      {/* 编辑当前AI助手信息时，右侧展开的用于编辑的信息表单 */}
      <Drawer
        opened={opened}
        onClose={drawerHandler.close}
        size="sm"
        position="right"
      >
        <AssistantConfig assistant={editAssistant} save={saveAssistant} remove={removeAssistant}></AssistantConfig>
      </Drawer>
    </div>
  );
};

export default Assistant;
