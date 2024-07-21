# 字段组件

字段组件用于管理表单中的每个字段节点，它们大体可以分为

- 管理数据的，数据字段组件 `PlainField`
- 管理对象的，对象字段组件 `ObjectField`
- 管理数组的，数组字段组件 `ArrayField`
- 用于布局的，布局组件 `VoidField`

`PlainField/VoidField` 是最小单元，其他组件则可以任意嵌套



## 书写形式

字段组件可以分为两种写法

1. 基于插槽的写法。优点：方便
2. 基于 key 的写法。优点：性能好

详细用法请看[数据字段组件](#数据字段组件)



## 数据字段组件

### 两种写法

```vue
<template>
  <Form>
		<!-- 插槽 -->
    <PlainField name="a" :layoutProps="{ label: '' }">
      <template #default="{ bind }">
        <ElInput v-bind="bind" />
      </template>
    </PlainField>

		<!-- 指定key -->
    <PlainField name="b" element="ElInput" :layout-props="{ label: '' }"></PlainField>
  </Form>
</template>
```

该组件主要用于数据的填充输入控件来获取数据，通俗来说也就是 `UI` 库的表单组件

使用插槽写法时，内部会暴漏出一个 `bind` 属性，它包含了数据绑定等等的属性，使用 `v-bind` 可以一建绑定

指定 key 的写法相当于把 插槽部分，提取到了一个单独的组件，在通过 `element` 指定一个 key 进行引用

### Props

```ts
interface CPlainFieldProps {
  name: string | number

  initValue?: any

  modelValue?: string

  layout?: string | Record<any, any>
  layoutProps?: CFormItemProps

  element?: string | Record<any, any>
  props?: Record<any, any>

  slots?: Record<any, any>
}
```

`name` 属性必填，它决定了字段在表单中的属性名，以及该字段的唯一标识

`initValue` 表示默认值是什么，默认值是 `undefined`

`modelValue` 规定双向绑定的 `key`，对于 `element-plus` 几乎都是 `modelValue` 绑定，但 `ant-design-vue` 却有很多不同的绑定

`layout/element` 分别决定了布局和填充使用什么，可以传递组件，也可以是个引用字符串。`layout` 通常会被指定为 `FormItem`，它是内置的控制器和布局组件，详细内容请看 [控制器](./layout)

`layoutProps/props` 分别是传递给各自组件的参数，布局参数详细内容请看 [控制器](./layout)

`slots` 用于传递插槽，详细用法请看 [slots](./slots)

### 提取插槽到单个文件被引用

```vue
<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus"
const props = defineProps<{ actions: ... }>()
</script>

<template>
  <ElSelect>
    <ElOption label="1" value="1" />
    <ElOption label="2" value="2" />
    <ElOption label="3" value="3" />
  </ElSelect>
</template>
```

对于提取来说非常简单，只需要正常的写 `Vue` 文件即可

因为 `Vue` 的属性可以被自动继承，所以不需要显示的接收 `props` 就可以直接传递给例子中的 `ElSelect`，感兴趣有什么可以打印下 `attrs`  查看

`actions` 是与表单交互的操作对象，不同的字段组件会有不同的操作对象，详细用法看 [操作对象](./action)

定义完成后在表单配置里进行注册就可以正常使用了





## 对象字段组件

```ts
interface CObjectFieldProps {
  name: string | number

  initValue?: any

  layout?: string | Record<any, any>
  layoutProps?: CFormItemProps

  element?: string | Record<any, any>
  props?: Record<any, any>
}
```







## 数组字段组件

```ts
interface CArrayFieldProps {
  name: string | number

  initValue?: any[]

  layout?: string | Record<any, any>
  layoutProps?: CFormItemProps

  element?: string | Record<any, any>
  props?: Record<any, any>
}
```







## 布局字段组件

表单本身并不会限制内部的组件`ui`，即便是非内部字段组件一样可以正常生效

布局字段组件主要用于 `json` 化时，有一个无效字段用来存储只用于布局的一些组件信息

```ts
 interface CVoidFieldProps {
  name: string | number

  element: string | Record<any, any>
  props?: Record<any, any>
}
```

