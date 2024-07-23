# json 表单



## 导出 `json`

```ts
import { createForm, FormItem, PlainField, exportFormStructJson } from "@usaform/element-plus"
const [Form, form] = createForm()
const printJson = () => console.log(exportFormStructJson(form.value.field))
```

导出一个表单 `json` 用于转存非常简单，只需要一个函数即可

但是要注意，只有通过指定 `key` 的写法，才能够被正确的导出



## 使用 `json`

```ts
const struct = exportFormStructJson(form.value.field)
const [Form, FormRef, forceRender] = createJsonForm({ struct })
```

`json` 属于是特殊的表单，需要使用相关的表单创造器，`createJsonForm` 来还原，参数和返回值继承 `createForm` ，`struct` 属性用于接收 `json`



## `json`表单和正常使用字段组件组成的表单的区别

`json` 表单的还原本质上是通过循环，内部会以函数式的方式创建出，字段组件拼接的组件树

可以认为 `json` 表单就是 `json` 对象嵌套下的写法，意味着它们的参数一模一样

因为内部会涉及到很多参数的传递和拷贝，有时很有可能会出现改了 `json` 表单不刷新的情况，此时可以尝试使用第三个返回值 `forceRender` 来强制让表单重新创建



## 怎么向 `json` 传递插槽 && 传递响应式参数

```ts
const struct = [{
    type: "plain",
    name: "slotsInput",
    layout: "FormItem",
    layoutProps: { label: "插槽" },
    element: "ElInput",
  	props: reactive({  }),
    slots: { suffix: "InputSuffix", prepend: () => [h("div", "prepend")], append: Append }
  },]
```

传递插槽只能是以 `slots` 对象的方式传递，参数内容同字段组件

传递响应式需要再需要的地方传递一个响应式对象即可

