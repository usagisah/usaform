# 表单公共配置

## 完整的配置

```ts
interface FormConfig {
    defaultValue?: any;
    defaultFormData?: Record<any, any>;
    arrayUnwrapKey?: string[];
    toJson?: FieldToJson;
    [x: string]: any;
}

interface CFormConfig extends FormConfig {
  // 默认使用的控制器
  plainFieldController?: string | Record<any, any>
  objectFieldController?: string | Record<any, any>
  arrayFieldController?: string | Record<any, any>
  // 全局布局参数
  layoutProps?: MaybeRef<CFormItemProps>
  // 双向绑定的 key
  modelValue?: string
  // 用于指定 key 的元素
  Elements?: MaybeRef<Record<string, any>>
  // 默认的校验选项
  defaultValidateOption?: ValidateOption
  // 用于指定 key 的规则
  Rules?: MaybeRef<Record<any, CFormRuleItem>>
}
```

### `defaultValue`

用于数据组件`PlainField.initValue` 的默认值

### `defaultFormData`

用于创建表单时的初始默认值，如果字段能够匹配就使用，否则会被跳过

### `arrayUnwrapKey`

字符串数组，在数组字段进行嵌套时，会尝试对数组的子项进行结构，能找到就用，找不到会使用原始的数据项，默认值是`[value, children]`

举个自理

使用数组时可以很轻松的写出这种代码，因为必须存在值和唯一标识，我们可以根据组件结构写出以下数据结构

```ts
const initFormData = {
  arr: [//对应 name=arr
    { //数组的每一项，对应 :name=0
      id: 0, //数组项唯一标识 id
      value: "xxx" //数组项实际的值
    }
  ]
}
```

此时会发现，使用 `ElInput` 填充的 `PlainField` 组件对应的数据成了对象，而真正应该对应的应该是 `value` 字段才对，所以**数组项为了支持初始化数据的开箱即用，必须要解构赋值，把对象中的 value 字段提取出来**

可框架内部并不知道要提取哪个，所以需要进行配置

```ts
const config: CFormConfig = {
  arrayUnwrapKey: ['value', 'children']
}
arrayUnwrapKey` 是一个字符串数组，框架内部会循环数组，逐个尝试，找到就用，找不到会使用原始的数据项，默认值是`[value, children]
```

对于这个例子来说

- 因为有 `value` 所以会用 `value` 传递给 `PlainField` 作为初始值使用
- 如果没有 `value`，那么此时会使用 `{id: 0}` 这个对象本身

**巩固：`ArrayField` 的 `fieldValue` 此时是 `[{id:0, value:xxx}]`。解构赋值只作用于，数组中每一项向下传递的组件，例如这里的 `PlainField`**

### `xxxFieldController`

全局配置不同的字段组件，默认使用什么控制器

### `modelValue`

全局配置 `PlainField.modelValue` 的 `key`

### `Elements/Rules`

全局配置组件和校验规则对象





## 通过插件配置

```ts
createApp().use(CFormPlugin, 配置)
```



## 通过上下文配置

```vue
<template>
	<CFormProvider :config=配置>
  	<App />
  </CFormProvider>
</template>
```

上下文允许存在多个，多个上下文配置会自动合并



## 局部配置

例如在表单创建函数里使用 `createForm({  config: 配置 })`

局部配置会自动合并上下文中的配置

