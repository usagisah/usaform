# 与表单的互操作对象

互操作对象是指，可以通过该对象，在表单的任意位置，对表单其他任意位置进行操作的方法对象集合

```ts
export interface CFormExpose extends Omit<FormActions, "provide"> {
  validate: () => Promise<CFormValidateError[]>
  reset: () => void
  callLayout: (path: string, key: string, ptr?: any, ...params: any[]) => Record<string, any>
  callElement: (path: string, key: string, ptr?: any, ...params: any[]) => Record<string, any>
  setProps: (path: string, setter: (props: { props: Obj; layoutProps: Obj }) => void | { props?: Obj; layoutProps?: Obj }) => Record<string, any>
  onForceRenderForm: OnForceRenderForm
  field: RootField
}

export type FormActions = FormBaseActions & {
  provide: () => void
}

export interface FormBaseActions {
  getFormData: () => Record<string, any>
  subscribe: (path: string, handle: FieldSubscribeHandle, config?: FieldSubscribeConfig) => () => void
  get: (path: string, config?: FormActionGetConfig) => Record<string, any>[]
  set: (path: string, value: any, method?: string) => void
  call: (path: string, key: string, config?: FormActionCallConfig) => Record<string, any>
}
```



数组字段组件是特殊的，它会多包含了一些操作数组的方法

```ts
export type ArrayFieldActions = FormBaseActions & {
  //设置指定下标的元素
  //下标为负数，表示头部新增
  //下标超出长度，表示尾部新增
  setValue: ArrayActionSetValue
  //删除指定下标的元素
  delValue: ArrayActionDelValue
  //交换2个下标的元素
  //swap(1, 2)
  swap: ArrayActionSwap
  //尾部删除1个
  pop: ArrayActionPop
  //头部删除1个
  shift: ArrayActionShift
  //尾部新增1个
  push: ArrayActionPush
  //头部新增1个
  unshift: ArrayActionUnshift
  //清空数组，和其他删除比，只会触发一次更新
  clear: ArrayActionClear
}
```



所有方法，只要重名，效果就是一样的

互操作对象依赖内置的[路径系统](./path.md)，查找要操作的对象字段





## 表单实例方法 && 通用组件内的实例方法集

表单的实例即通过表单构造器返回的 `actions`

如果是自定义组件，或是在插槽中，获取的方法集会有所不同



### `validate`

内部预设，对 `call` 的二次封装

触发内部所有 `PlainField` 字段组件的校验，返回一个包含所有异常字段，报错的数组信息的 `Promise`

```ts
export interface CFormValidateError {
  //字段路径
  path: string
  //字段 name
  field: string
  //报错信息
  message: string
}
```





### `reset`

内部预设，对 `call` 的二次封装

触发所有 `PlainField / ArrayField` 的清空操作，前者还原成 `initValue`，后者直接清空数组

如果有报错，也会全部清空



### `callLayout`

内部预设，对 `call` 的二次封装

调用所有匹配的 `PlainField` 字段的，控制器中的方法，并返回匹配字段方法调用后的返回值

参数

- `path` 字段组件
- `key ` 方法名
- `point` this 指向
- `...params` 传递过去的参数



### `callElement`

内部预设，对 `call` 的二次封装

调用所有匹配的 `PlainField` 字段的，输入控件中的方法，并返回匹配字段方法调用后的返回值

参数

- `path` 字段组件
- `key ` 方法名
- `point` this 指向
- `...params` 传递过去的参数



### `setProps`

内部预设，对 `call` 的二次封装

会调用所有匹配的 `PlainField` 字段的 `setProps` 方法

用于对数组字段，以 `api` 的形式设置传递给字段，控制器和输入控件的参数，它的优先级会高于所有其他形式的传递

参数 1 是指向要更改字段的路径

参数 2 是一个函数，返回值接收可选的两个对象 `props / layoutProps`。内部会有对象来缓存所有的更改设置，如果想要请求，传递相应的空对象即可

```ts
form.value.setProps("ElInput", () => {
  return { props: { placeholder: "请输入" }, layoutProps: {} }
})
```



### `onForceRenderForm`

当表单被 `forceFormRender` 强制刷新后，调用的回调，首次创建表单不会调用



### `getFormData`

获取表单所有字段，值组成的对象



### `subscribe`

订阅指定路径字段的更新操作，参数类似于 `vue.watch()`，返回一个取消订阅的方法

```ts
formRef.value.subscribe("xxx/.*", console.log)
```

同时也提供了立即执行的功能

```ts
formRef.value.subscribe("xxx/.*", console.log, { immediate: true })
```



### `get`

批量获取指定路径字段的值，还可以通过配置设置获取的行为

```ts
export interface FormActionGetConfig {
  //找到一个就停止
  first?: boolean
  //是否是 浅层获取
  //比如有个 3 层结构的表单，我们只匹配到了第二层，浅层时会忽略第三层的获取，否则会递归获取下边所有层级的值
  shallow?: boolean
}

formRef.value.get("xxx/.*")
```



### `set`

批量设置指定路径字段的值

```ts
//一般修改
//修改 input 字段的值为 ”1“
formRef.value.set("xxx/input", "1")

//修改数组字段值
//数组字段的修改需要通过内部方法，参数3表示要调用哪个数组方法，参数会变成传递过去的参数
formRef.value.set("xxx/ary", "1", "push")
```





### `call`

调用匹配路径字段的方法，也可以进行更多的配置，修改调用的行为

```ts
export interface FormActionCallConfig {
  //this 指向
  point?: any
  //参数列表
  params?: any[]
  //是否只调用第一个就停止
  first?: boolean
  //匹配哪些类型的字段
  fieldTypes?: ("plain" | "object" | "ary" | "ary-item")[]
}

//调用 input1 字段的 reset 方法
//配置：只调用第一个，筛选出 plain 类型的字段
form.value?.call("input1", "reset", {
  fieldTypes: ["plain"],
  first: true
})
```

