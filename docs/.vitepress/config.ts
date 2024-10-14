import { defineConfig } from "vitepress"

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "@shoroi/form",
  description: "表单",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    // nav: [
    //   { text: 'Home', link: '/' },
    //   { text: 'Examples', link: '/markdown-examples' }
    // ],

    sidebar: [
      { text: "快速开始", link: "/start" },
      { text: "公共配置", link: "/config" },
      { text: "表单构造器", link: "/form" },
      { text: "与表单的互操作对象", link: "/action" },
      { text: "路径系统", link: "/path" },
      { text: "字段组件", link: "/field" },
      { text: "控制器", link: "/layout" },
      { text: "校验", link: "/rule" },
      { text: "插槽", link: "/slots" },
      { text: "JSON配置表单", link: "/json" }
    ],

    socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }]
  }
})
