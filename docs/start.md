# `@shoroi/form` 使用引导


## 为什么要使用

对前端应用来说，表单本身属于是一种，*逻辑上高度耦合，为了性能和维护又不得不拆*的东西，为了能够更好的组织和管理，不同表单字段的交互，就有了该库

本质上来说`@shoroi/form`只是一个表单的粘合层工具，设计之初的目的就是为了拆分和扩展日益变大的表单。

如果你有以下的需求，或许你可以尝试使用它
- 字段很多，对管理有要求，比如批量的操作，*监听，修改，获取，传参*
- 表单有层级关系，比如存在嵌套行为，再比如嵌套的对象字段结构
- 动态表单，表单结构允许被动态的批量改变
- json 表单，这对低代码和表单存储，快速创建，都很有帮助




## 下载依赖

下载相关依赖，UI 库可以选择 `ant-design-vue` 或 `element-plus` 任意一个

```shell
pnpm add @usaform/element-plus element-plus @vitejs/plugin-vue-jsx sass
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
import "@usaform/element-plus/style/ant-design"
import "@usaform/element-plus/style/element-plus"
```



## 上手建议

为了更好的管理表单，所以不得不引入诸多琐碎的概念

想要详细的了解可以看看最下方的理念导航

想要快速开始使用，可以选择直接粘贴想要的 DEMO，然后按需看需要的部分



## 上手第一个 demo

通常为了省事，会推荐把可能会用到的UI组件，**先进行全局注册**，方便进行全局引用，并做一些通用的配置

我们可以通过 `Vue` 插件的形式进行注册，

```js
import { CFormPlugin } from "@shoroi/form"
import "@shoroi/form/style/element-plus"

import { createApp } from "vue"

import { ElCheckbox, ElDatePicker, ElInput, ElInputNumber, ElRadioGroup, ElSelect } from "element-plus"

const app = createApp(App)
app.use(CFormPlugin, {
  //注册要使用到的字段组件
	Elements: {
    ElInput,
    ElSelect,
    ElInputNumber,
    ElRadioGroup,
    ElCheckbox,
    ElDatePicker
  }
})
```

在页面中使用时

通过 `createForm` 创建出表单组件，第二个参数相当于一个内置的 `Form` 组件的 `ref` 实例，通过该操作实例即可与表单进行交互

这里，`<Form/>`是最外层的表单包裹器，主要用于做一些，布局样式，或者是传参

`<PlainField/>` 为字段组件，它会向表单内部的控制器注册字段进行统一管理，`name` 是注册的名字，通过 `formActions.value.getFormData()`，点击按钮后会打印出，以`name`串起来的一个表单的对象


```vue
<script setup>
import { createForm, PlainField } from "@shoroi/form"
  
const [Form, formActions] = createForm()
const submit = () => console.log(formActions.value.getFormData())
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



## 理念导航

为了更好的管理表单，所以不得不创建了一些琐碎的概念，下边会列出一个完整的表单概念流程

表单的使用可以分为以下流程

- 配置全局通用配置

  这里主要用于注册一些全局的属性，比如不同字段用什么控制器，自定义的校验规则，各种经常用到的输入控件等

- 创建自己需要的表单类型

  目前有普通表单和`json`表单的区别

- 在表单的构造函数中，进行局部表单配置

  一般会进行局部覆盖全局的配置，或者进行是进行局部的输入控件等的注入

- 创建后

  - 通过表单操作对象，实现与表单的交互

    互操作对象分别可以在，自定义组件，表单构造器的返回值中拿到

    不同的字段都是一个方法包，它们都可以通过路径系统进行访问，而互操作对象则是提供一个，*基于路径系统调用的方法集，和个别针对于表单整体的方法级*，两者的集合

  - 选择合适的字段组件

    字段组件控制着不同的表单控件的值，是以怎样的层级结构进行组织的

    字段组件可以分为两者的结合：控制器 + 输入控件。输入控件则是一般的表单UI组件。控制器是用来控制校验和样式等，它是控制表单和输入控件间，除了值改变以外所有行为的包裹组件

