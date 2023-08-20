import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  // 切换页面的dark和light颜色主题
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };
  // 使用mantine样式
  // 页面颜色主题默认为dark
  return (
    <ColorSchemeProvider
      // colorScheme="dark"
      colorScheme= {colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      {/* 提供全局配置属性 */}
      <MantineProvider
        theme={{ colorScheme, primaryColor: "green" }}
        withNormalizeCSS
        withGlobalStyles
      >
        {/* 配置全局的Notification组件 */}
        <Notifications position="top-right" zIndex={2077}></Notifications>
        <Component {...pageProps} />
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
