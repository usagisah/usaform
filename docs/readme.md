# `usaform` 使用引导



## 下载依赖

下载相关依赖，UI 库可以说 `ant-design-vue` 或 `element-plus` 任意一个

```shell
pnpm add @usaform/element-plus element-plus @vitejs/plugin-vue-jsx 
sass
```

配置 `vite`

```js
import vue from "@vitejs/plugin-vue"
import jsx from "@vitejs/plugin-vue-jsx"
export default defineConfig({
  plugins: [vue(), jsx()]
})
```

选择使用的 `ui` 库引入相关的样式文件

```js
import "@usaform/element-plus/style/ant-design.scss"
import "@usaform/element-plus/style/element-plus.scss"
```



## 上手导航

表单的使用可以分为以下流程

1. 是否需要配置全局通用配置
2. 选择自己需要的表单组织类型
3. 通过表单操作对象，实现与表单的交互

扩展功能

- 是否需要 `typescript`
- 是否需要自定义扩展
- 是否需要 `json` 做表单存储或低代码

配置清单



## 上手第一个 demo

通常为了省事，会推荐把可能会用到的组件先进行全局注册，方便进行全局引用，并做一些通用的配置

我们可以通过 `Vue` 插件的形式进行注册，

```js
import { CFormPlugin } from "@usaform/element-plus"
import { createApp } from "vue"
import { ElInput } from "element-plus"

const app = createApp(App)
app.use(CFormPlugin, {
  //注册
	Elements: { ElInput },
  //FormItem 为内置的控制器
  plainFieldController: "FormItem"
})
```

这里我们注册了常用的 `ElInput` 作为输入控件

并指定布局组件为 `FormItem`，因为布局组件通常还要负责根据字段的状态，来动态的进行样式调整，所以会被命名为控制器组件



然后我们就可以正常使用了，这种写法足以应付平常绝大多数场景了

```vue
<script setup>
import { createForm, PlainField } from "@usaform/element-plus"
  
const [Form, form] = createForm()
const submit = () => console.log(form.value?.getFormData())
</script>

<template>
	<Form>
    <PlainField name="username" element="ElInput" :props="{ placeholder: '请输入' }" :layoutProps="{ label: '用户名' }" />
    <PlainField name="pwd" element="ElInput" :layoutProps="{ label: '密码' }" />
  </Form>

	<ElSpace>
  	<ElButton @click="onSubmit">提交</ElButton>
  </ElSpace>
</template>
```

通过 `createForm` 创建出表单组件，第二个参数相当于一个内置的 `Form` 组件的 `ref` 实例

通过该操作实例即可与表单进行交互



## 文档

文档尚在完善中...
