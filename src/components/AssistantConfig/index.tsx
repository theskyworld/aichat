// 新建或修改一个AI助手时编辑信息的表单组件

import { EditAssistant } from "@/types";
import { useState, FormEvent, ChangeEvent } from "react";
import { Button, Input, Textarea, NumberInput } from "@mantine/core";
import { IconDeviceFloppy, IconTrash } from "@tabler/icons-react";
const { Wrapper } = Input;

interface AssistantConfigProps {
  assistant: EditAssistant;
  save: (data: EditAssistant) => void;
  remove: (id: string) => void;
}

export const AssistantConfig = ({
  assistant,
  save,
  remove,
}: AssistantConfigProps) => {
  const [data, setData] = useState<EditAssistant>(assistant);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save(data);
  };

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const onNumberChange = (val: number | "", name: string) => {
    if (val === "") return;
    setData({
      ...data,
      [name]: val,
    });
  };
  return (
    <div className="w-full flex justify-center">
      <form
        onSubmit={(evt) => onSubmit(evt)}
        className="w-full flex flex-col gap-4"
      >
        <Wrapper label="名称" description="助理名称">
          <Input
            type="text"
            variant="filled"
            value={data.name}
            name="name"
            onChange={onChange}
          ></Input>
        </Wrapper>
        <Wrapper label="指令" description="为角色分配的系统指令">
          <Textarea
            variant="filled"
            className="w-full"
            value={data.prompt}
            name="prompt"
            onChange={onChange}
            autosize
          ></Textarea>
        </Wrapper>
        <Wrapper
          label="创意度"
          variant="filled"
          description="回复的创意度，数值越大，创意度越高"
        >
          <NumberInput
            type="number"
            variant="filled"
            precision={1}
            max={2}
            min={0}
            step={0.1}
            value={data.temperature}
            name="temperature"
            onChange={(val) => onNumberChange(val, "temperature")}
          ></NumberInput>
        </Wrapper>
        <Wrapper label="上下文数" description="每次对话时能够记忆的历史对话1数">
          <NumberInput
            type="number"
            variant="filled"
            max={8}
            min={0}
            step={1}
            value={data.max_log}
            name="max_log"
            onChange={(val) => onNumberChange(val, "max_log")}
          ></NumberInput>
        </Wrapper>
        <Wrapper label="回复长度" description="回复的内容的最大长度">
          <NumberInput
            type="number"
            variant="filled"
            max={2000}
            min={50}
            step={50}
            value={data.max_tokens}
            name="max_tokens"
            onChange={(val) => onNumberChange(val, "max_tokens")}
          ></NumberInput>
        </Wrapper>
        <div className="flex jusify-around mt-4">
          <Button
            type="submit"
            leftIcon={<IconDeviceFloppy size="1.2rem"></IconDeviceFloppy>}
          >
            Save
          </Button>

          {/* 对已有的assistant的信息，才支持删除 */}
          {data.id ? (
            <Button
              color="red"
              variant="light"
              leftIcon={<IconTrash size="1.2rem"></IconTrash>}
              onClick={() => remove(data.id as string)}
            >
              Remove
            </Button>
          ) : null}
        </div>
      </form>
    </div>
  );
};
