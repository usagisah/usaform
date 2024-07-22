# 表单组件



## `createForm`

表单组件通过 `createForm()` 函数创建，它是表单最外层的控制器

完整的类型如下

```ts
function createForm(props?: CFormProps): [Form,actions,forceRender]

type CFormProps = {
  //针对于表单和表单字段的配置
  config?: CFormConfig
  //自定义最外层的布局组件
  layout?: any
  //默认传递给 layout 组件的参数，优先级比模版中传递的 低
  layoutProps?: Record<any, any>
  //是否允许被强制销毁，默认 true
  dynamic?: boolean
}

interface FormConfig {
    defaultValue?: any;
    defaultFormData?: Record<any, any>;
    arrayUnwrapKey?: string | string[];
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
  Rules?: MaybeRef<Record<any, (value: any) => CFormRuleItem>>
}
```





## 返回值

返回值是一个有着三个元素组成的元组数组

1. 是一个 `Vue` 组件
2. 表单操作对象
3. 强制刷新函数

强制刷新函数通常并不会使用到它，所以请不要过度依赖

但是当一个表单需要根据不同的参数，动态改变内部结构时，某些情况可能并不会按照预期的方式工作。使用强制刷新函数可以使得表单整体，被强制销毁并重新创建





## 参数

`CFormProps` 为表单的参数

其中`config: CFormConfig` 为公共参数，详细解释请看 [表单公共配置](./config.md)



### `layout`

该选项用于指定，是否要在表单组件最外层嵌套一层，用于布局的组件

它接收一个组件，或者是一个被注册的组件 `key`

使用该选项可以很好的满足，内置选项不支持的布局等



### `layoutProps`

该选项只有在 `layout` 存在时生效

它和在模版中直接传递选项给表单组件效果一致

存在的主要目的在于自定义封装时，可以内置一些公共的参数进去，优先级低于模版



### `dynamic`

动态选项用于规定表单组件能否被强制销毁在重建，默认为 `true`

只有当开启时，`forceRender` 函数还能生效

当关闭时可以减少内部组件的嵌套，提高一点性能



## 为什么是函数创建

表单的内部实现通常是一个，复杂的、各种功能高度耦合的状态

所以会对外提供很多的选项，对内会通过上下文对象进行解耦

如果只是通过组件的形式创建会导致

1. 由于要监听的参数过多，相关的判断会非常的复杂不稳定
2. 依赖于 `vue` 的组件上下文很难彻底的销毁重建
3. 为了和表单交互一定会有一个 `ref` 来获取

通过函数创建则可以轻松规避很多没有必要的 `BUG` 和判断

