# 与表单的互操作对象

互操作对象是指，可以通过该对象，在表单的任意位置，对表单其他任意位置进行操作的方法对象集合

它通常包含了以下方法集

```ts
interface CFormExpose {
  //获取表单数据
  getFormData: () => Record<string, any>;
  //订阅路径下字段的更改
  subscribe: (path: string, handle: FieldSubscribeHandle, config?: FieldSubscribeConfig) => () => void;
  //获取指定路径下的值
  get: (path: string, config?: FormActionGetConfig) => Record<string, any>[];
  //设置路径下字段的值
  set: (path: string, value: any, method?: string) => void;
  //调用匹配路径下暴漏的方法
  call: (path: string, key: string, config?: FormActionCallConfig) => Record<string, any>;
  validate: () => Promise<CFormValidateError[]>
  //重置所有字段的值
  reset: () => void
  //调用指定路径下布局组件的方法
  callLayout: (path: string, key: string, ...params: any[]) => Record<string, any>
  //调用指定路径下字段组件的方法
  callElement: (path: string, key: string, ...params: any[]) => Record<string, any>
}
```

数组字段组件是特殊的，它会多包含了一些操作数组的方法

```ts
interface ArrayFieldActions extends FormBaseActions {
    setValue: SetValue;
    delValue: DelValue;
    swap: Swap;
    pop: () => void;
    shift: () => void;
    push: (e: any) => void;
    unshift: (e: any) => void;
    clear: () => void;
}
```

所有方法，只要重名，效果就是一样的

互操作对象依赖内置的[路径系统](./path.md)，查找要操作的对象字段



