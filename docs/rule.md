# 表单校验





## 基本使用

校验功能依赖于 `async-validator`，它依赖于内部控制器 `FormItem` 使得功能生效

```vue
<template>
...
<PlainField :layoutProps="{ rules: [{ trigger: 'blur', required: true, message: '该字段是必填的' }] }" />
...
</template>
```

 

## 规则参数

校验规则选项沿用 `async-validator` 原有的选项，为了支持更好的扩展，内部改写了 `validator` 自定义校验函数的参数

常用参数如下

### `trigger`

触发校验方式

- `blur` 失焦
- `change` 值发生变化

### `required`

是否是必填的红色星星样式

### `message`

校验失败时的异常提示

### `validator`

自定义校验函数

```vue
<template>
...
<PlainField :layoutProps="{ 
  rules: [{ trigger: 'blur', message: '该字段是必填的', validator(value, options) {
   return value > 1           
	}}] 
}" />
...
</template>
```

参数有 2 个

- `value` 要校验的值
- `options` 为当前校验规则选项对象，并且包含，外部传递的 `value` 自定义参数，和 `actions` 表单操作对象

### `value`

自定义参数



## 封装自定义校验选项

对于外部的自定义参数 `value`，如果写内联的行内规则基本用不到

但是日常开发会有许多通用的校验规则，此时我们可以尝试把它封装到表单的[全局参数](./config.md)中

```ts
import {createApp} from "vue"
import {CFormPlugin} from "@usaform/element-plus"
createApp().use(CFormPlugin, {
  Rules: {
    phone: (value) => {
      return {
        validator(v, { value, action }) {
          //根据自由参 value 来动态校验不同国家的手机号
          if (value === "zh") ...
          if (value === "th") ...
          if (value === "en") ...
        },
        message: "xxx"
      }
    }
  }
})
```

在使用时，我们可以给规则数组中传递一个自由参，自由参可以是任意类型

```vue
<template>
...
<PlainField :layoutProps="{ 
  rules: [['phone', 'en']]
" />
...
</template>
```

