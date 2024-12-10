# 表单构造器



## `createForm`

表单组件通过 `createForm()` 函数创建，它是表单最外层的控制器

完整的类型如下

```ts
function createForm(props?: CFormProps): [Form, actions, forceFormRender]

interface CFormProps {
  //针对于表单和表单字段的配置
  config?: FormConfig
  //自定义最外层的布局组件
  layout?: string | Component
  //默认传递给 layout 组件的参数，优先级比模版中传递的 低
  layoutProps?: Record<any, any>
  //是否允许被强制销毁，默认 true
  dynamic?: boolean
}
```



## 返回值-1 `<Form />` 

表单最外层的 `Vue` 包裹器组件，使用 `ref` 获取到的实例同 `actions` 

```vue
<script>
const [Form] = createForm()
</script>

<template>
<Form>
	<PlainField key="..." />  
</Form>
</template>
```



## 返回值-2 `Actions`

这是表单互操作对象，具体行为看相关文档



## 返回值-3 `forceFormRender`

强制刷新表单的函数

使用时内部会把表单的所有状态全部清空，包括所有的订阅等等，和字段产生的副作用，并且强制重新创建新的表单

例如我们在重新请求接口，想要用新的数据结构刷新表单时

我们可以，可以动态更改传递给 `createForm` 等表单构造器的配置选项`FormConfig.defaultFormData`，然后强制刷新表单，就可以全部回填数据进表单中



## 参数

`config` 参数同公共表单参数

`dynamic` 决定了表单能否被，返回值 `forceFormRender` 给强制干掉在刷一遍

`layout` 是针对于最外层表单的自定义包裹元素，如果需要自定义样式会使用到它

`layoutProps` 是传递给最外层 `<Form/>` 组件的参数，它的优先级小于组件的直接传参







## 为什么是函数创建

表单的内部实现通常是一个，复杂的、各种功能高度耦合的状态

所以会对外提供很多的选项，对内会通过上下文对象进行解耦

如果只是通过组件的形式创建会导致

1. 由于要监听的参数过多，相关的判断会非常的复杂不稳定
2. 依赖于 `vue` 的组件上下文很难彻底的销毁重建
3. 为了和表单交互一定会有一个 `ref` 来获取，使用函数创建就可以提前把 `ref` 实例暴露出来
3. 利于二次封装
3. 通过函数创建则可以轻松规避很多没有必要的 `BUG` 和判断

