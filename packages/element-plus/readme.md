# @usaform/element-plus



## 简介

一个用于构建高性能**类表单系统**的逻辑控制组件库，使用它可以可以收获到以下好处，它有着以下优点

1. 高性能，跨组件的互操作性

   在类表单系统的场景下，会出现很多逻辑上是高耦合，但内容又不得不拆的情况。该库提供了一套类似于的状态管理库的机制，使得被拆分到各处的，不同层级的组件，都可以在保持局部更新的前提下，进行互操作

2. 高度灵活

   该库是一个逻辑组织库，具体内容实现完全依赖于自定义，或者`ui`组件库

3. 相对简单

   市面上会有许多表单相关的库，相比较而言该库**体积更小，观念更少，操作简单**

什么情况下可以尝试使用

1. 多层次的嵌套表单 —— 主要提供便利
2. 比较复杂的动态表单 —— 主要提供性能，优雅的交互

因为本库核心逻辑是基于`@usaform/vue` 实现核心逻辑，并围绕表单场景做了些开箱即用的扩展，本身具备着一定程度的性能开销，所以对于非以上两种场景，请慎用



## 快速上手

下载依赖

```shell
pnpm add @usaform/element-plus element-plus
```

引入样式文件

```js
import "element-plus/dist/index.css"
import "@usaform/element-plus/style.scss"
```

写一些简单的 demo，点点按钮看看有没有打印内容，有没有报错

```html
<script setup>
import { ref } from "vue"
import { ElInput, ElInputNumber, ElCard } from "element-plus"
import { Form, FormItem, PlainField } from "@usaform/element-plus"
  
const formConfig = {
  Elements: { ElInput,FormItem, ElInputNumber }
}
const form = ref(null)

const submit = () => {
  console.log(form.value.getFormData())
}
const validate = async () => {
  console.log(await form.value.validate())
}
const reset = () => {
  form.value.reset()
}
</script>

<template>
<ElCard>
  <Form :config="formConfig" ref="form">
    <ElDivider content-position="center">(布局样式) 基本表单元素</ElDivider>
    <PlainField name="input" layout="FormItem" :layout-props="{ label: '名称', required: true }" element="ElInput" :props="{ placeholder: '请输入名称' }" />
    <PlainField name="number" layout="FormItem" :layout-props="{ label: '数量' }" element="ElInputNumber" :props="{ placeholder: '请输入数量' }" />

    <ElDivider content-position="center">(布局样式) 提交</ElDivider>
    <FormItem>
      <ElButton @click="submit">submit</ElButton>
      <ElButton @click="validate">validate</ElButton>
      <ElButton type="danger" @click="reset">reset</ElButton>
    </FormItem>
  </Form>
</ElCard>
</template>
```

如果文档看着比较难以理解，可以结合 demo 对照理解

强烈建议看看仓库中的 examples 中的几个使用例子



## 表单组件的类型 & 组织理念

使用组件分为 3 个部分

1. 创建表单

   通过 `<Form />` 表单即可创建，内部会属于该表单的上下文信息

2. 使用字段组件

   拿变量举例，创建表单相当于创建了一个对象变量 `const form = {}`

   要往里面填充内容就需要用到，内部提供的其他的字段组件，它们会检测当前的上下文环境，动态的注册到表单上下文中，相当于进行了赋值操作 `form.xxxField = xxx`

   字段组件分为

   	- `PlainField` 创建基本值字段，比如 `input/select` 这种无法继续细分的就是基本值，所以该组件无法嵌套
   	- `ObjectField` 创建对象字段，用于对不同的字段进行分组和嵌套
   	- `ArrayField` 创建数组字段，用于以数组的形式，对不同的字段进行分组和嵌套

3. 与表单交互

   交互操作比如

   - 获取所有表单内容
   - 对表单进行校验
   - 调用某个字段的自定义内容
   - 修改某个字段内容
   - 获取某个字段内容
   - 监听某个字段内容

   交互需要获取不同表单内部的操作实例，获取方式请往下看



## 表单组件 -- `Form`

用于创建表单的上下文容器

### **参数**

- `config` 表单的全局配置，ts 类型参数 `FormConfig` ，具体内容如下

|      属性       | 类型                     | 可选 | 描述                                                         |
| :-------------: | ------------------------ | :--: | ------------------------------------------------------------ |
|  defaultValue   | any                      |  是  | 当创建新的字段，全没有初始值时，作为默认值使用               |
| defaultFormData | Record<any, any>         |  是  | 整体表单的默认值，用于回显表单 \n                            |
|    Elements     | Record<string, any>      |  是  | 设置内部用到的组件，例如 { input: ElInput }                  |
|      Rules      | Record<string, RuleItem> |  是  | 设置全局校验项，规则和 element-plus 一致，更详细内容看npm包 async-validator |

补充

- 不知道 `defaultFormData` 设置成什么结构，可以先调用 `getFormData` 方法，按照同样结构写即可



### `ref 实例`

可以拿到内部的操作实例，ts 类型参数 `FormExpose`

| 属性        | 类型                                                         | 描述                                                   |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------ |
| reset       | () => void                                                   | 清空所有 `PlainField` 组件的值                         |
| validate    | () => Promise<FormValidateError[]>                           | 触发所有 `PlainField` 组件的校验，只返回校验失败的字段 |
| getFormData | Record<string, any>                                          | 不触发校验，返回表单内部所有的值                       |
| subscribe   | (*paths*: string, *handle*: import("./useFieldValue").FieldSubscribeHandle) => () => void | 订阅匹配字段的修改                                     |
| get         | (*path*: string) => any[]                                    | 获取匹配字段的值                                       |
| set         | (*path*: string, *value*: any) => void                       | 设置匹配字段的值                                       |

补充

- `get/set/subscribe` 方法的 `path` 都依赖于路径系统，详细规则往后看



### 默认插槽

如果是字段组件会自动注册，其他内容都会原封不动的显示，没有什么限制





## 路径系统

表单的任意字段中都可以访问其他任意位置的字段内容，一般情况可以直接获取所有表单内容自取即可，可是例外情况就不好用了

1. 监听其他字段的修改
2. 批量操作
3. 在数组中，不知道开始字段是从哪开始的，需要以自身出发，找到相对路径的其他属性

路径系统的写法类似于文件路径，写法上是一个字符串，以 `/` 分割，默认是从发起者字段为起点开始查找

为了易用性和支持批量，分割出来的每块都会转成正则和每个字段名称匹配，正则会进行缓存，性能可以得以保障

查找规则如下，找不到会直接退出

- 一般查找
  - `a/b/c` 找自己下边的 a，a下边的 b，b下边的c
- 正则查找
  - `a/.*/c`  找自己下边的 a，a 下边所有的字段，所有字段下边的 c
  - `a/[0-9]/c` 找自己下边的 a，a 下边 0-9 的字段（通常用于数组），所有字段下边的 c
- 根部查找
  - `~/a` 从最顶层找下边的 a
- 向上找
  - `../a` 找父节点下的 a
- 返回自己
  - `""` 空字符会返回自身
  - 因为直接修改暴露出来的响应式变量会存在很多未知的边界情况，建议始终使用内部提供的操作方式，来修改自身或者其他字段的值





## 字段组件 -- `PlainField`

用处创建基本值的字段，无法进行嵌套

该组件没有操作性实例使用，因为如果传递，没有使用的属性会自动传递到填充组件的 dom 属性上，如果使用请使用 `ObjectField` 嵌套后传递后使用

### 参数

```ts
export interface PlainFieldProps {
  name: string | number

  layout?: string
  layoutProps?: Record<any, any>

  element: string
  props?: Record<any, any>

  formSlots?: FormSlots
}
```

| 属性        | 类型                         | 是否必传 | 描述                                |
| ----------- | ---------------------------- | -------- | ----------------------------------- |
| name        | string\|number               | 是       | 在表单中的字段名                    |
| layout      | string                       | 否       | 使用 form.Elements 中的组件进行布局 |
| layoutProps | Record<any, any>             | 否       | 转发给 layout 组件的参数            |
| element     | string                       | 是       | 使用 form.Elements 中的组件进行填充 |
| props       | Record<any, any>             | 否       | 转发给 element 组件的参数           |
| formSlots   | Record<string, string>\|组件 | 否       | 转发给 element 组件的插槽           |

补充

- 为什么会有很多转发属性？

  通过传递字符串来动态选择使用的组件，对动态表单比较友好

  `vue` 中使用插槽时，当子组件更新时父组件**必定**更新，但如果通过参数就不会

- layoutProps 具体内容请查看布局组件

### demo

```html
<PlainField 
            name="input" 
            layout="FormItem" 
            :layout-props="{ label: '名称', required: true }" 
            element="ElInput" 
            :props="{ placeholder: '请输入名称' }" 
/>
```

### 自定义 element 元素

看参数列表会发现，又是转发属性，又是转发插槽的，对于像是 `Select` 这种必须传插槽的体验会非常的不方便

解决方式有两种

一种是直接用 `jsx` 语法写个插槽，然后直接传给 `formSlots` 里，对于喜欢`react` 的开发者会更好接受些

```vue
<script setup lang="jsx">
//... 一些其他代码
const SelectOptions = () => {
  return data.map(item => <ElOptions .../>)
}
</script>

<template>
<PlainField ... element="ElSelect"  :formSlots="{options: SelectOptions}" />
</template>
```

第二种是自定义一个组件使用

```vue
<script lang="ts" setup>
  //自定义的组件，假设名字叫 CustomSelect
import { ElOption, ElSelect } from "element-plus"
import { computed } from "vue"
const props = defineProps<{ modelValue: any, options: any[] }>()
const emit = defineEmits(["update:modelValue"])
const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit("update:modelValue", value)
  }
})
</script>

<template>
  <ElSelect v-model="value">
    <ElOption label="1" value="1" />
    <ElOption label="2" value="2" />
    <ElOption label="3" value="3" />
  </ElSelect>
</template>
```

```vue
<!-- 使用它（记得现在 form.Elements 中注册） -->
<PlainField ... element="CustomSelect" :props="{options: []}" />
```

推荐使用第二种，因为在 ts 下，在模版中写 `jsx/tsx` 会严重拖垮类型提示的速度







## 字段组件 -- `ObjectField`

用于分组的字段组件，可以嵌套



### 参数

```tsx
export interface ObjectFieldProps {
  name: string | number

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}
```

和 `PlainField` 基本一致



### 插槽

接受一个默认插槽，参数为入参时接收到的 `props`，以及互操作的 `actions`

`const _p = { ...props.props, actions }` 两个会被这种形式合并传递

```vue
<ObjectField name="object" layout="FormItem">
  <template #default="{ actions }">
		<PlainField name="aaa" element="MyInput" :props="{ actions }" />
		<PlainField name="xxx" element="MyInput" :props="{ actions }" />
  </template>
</ObjectField>
```

`actions` 参数有，`get/set/subscribe/getFormData`，效果同 `Form` 组件同名的内容

补充

- 该组件同时支持 element 参数和插槽，优先级前者大于后者
- 组件本身的开销很小，为了方便推荐使用插槽写法





## 高级字段组件 -- `ArrayField`

数组组件的作用同 `ObjectField` 一致都是分组用的，但是内部存储的形式不同，允许嵌套

主要用于动态表单的场景，使用起来相对会更复杂些



### 参数

参数同 `ObjectField`

```ts
export interface ArrayFieldProps {
  name: string

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}
```

传递给填充组件的参数

```ts
export type ArrayFieldAttrs = {
  fields: any[]
  actions: {
    push: (e: Record<any, any>) => void
    unshift: (e: Record<any, any>) => void
    pop: () => void
    shift: () => void
  } & ArrayFieldActions
} & Record<any, any>
```



### 使用

使用方式 1

```vue
<ArrayField name="array">
  <template #default="{ fields, actions }">
    <div v-for="(item, i) in fields" :key="item.id">
      <PlainField :name="i" layout="FormItem" :layout-props="{ label: '名称', required: true }" element="ElInput" :props="{ placeholder: '请输入名称' }" />
    </div>
    <ElSpace>
      <ElButton @click="actions.push({ id: Math.random(), value: '11111111' })">add</ElButton>
      <ElButton @click="actions.pop()">pop</ElButton>
      <ElButton @click="actions.unshift({ id: Math.random(), value: '2222' })">unshift</ElButton>
      <ElButton @click="actions.shift()">shift</ElButton>
      <ElButton @click="actions.swap(0, fields.length - 1)">swap</ElButton>
    </ElSpace>
  </template>
</ArrayField>
```

使用方式 2

```vue
<script lang="ts" setup>
  //假设名字是 MyArray
import { PlainField } from "@usaform/element-plus"
import { ElButton, ElSpace } from "element-plus"
import {} from "vue"

defineOptions({
  inheritAttrs: false
})
const props = defineProps<{ fields: any[]; actions: any }>()
</script>

<template>
  <div v-for="(item, i) in fields" :key="item.id">
    <!-- 如果有多个字字段，需要用到非 PlainField 进行分组，不然多个指向同个下标的会发生覆盖 -->
    <!-- 目前能嵌套的只有两个 ObjectField ArrayField -->
    <ObjectField :name="i">
      <PlainField name="aaa" element="ElInput" :props="{ placeholder: '请输入名称' }" />
      <PlainField name="bbb" element="ElInput" :props="{ placeholder: '请输入名称' }" />
  	</ObjectField>
  </div>
  <ElSpace>
    <ElButton @click="props.actions.push({ id: Math.random(), value: '11111111' })">add</ElButton>
    <ElButton @click="props.actions.pop()">pop</ElButton>
    <ElButton @click="props.actions.unshift({ id: Math.random(), value: '2222' })">unshift</ElButton>
    <ElButton @click="props.actions.shift()">shift</ElButton>
    <ElButton @click="props.actions.swap(0, fields.length - 1)">swap</ElButton>
  </ElSpace>
</template>
```

```vue
<ArrayField name="array" element="MyArray" />
```

写法上的区别

- 该组件同时支持 `element/slot` 两种写法，优先级前者大于后者，推荐使用`element`写法
- 因为既然会用到数组形式，说明会经常动态变化（插槽内容更新，父组件一定跟着更新），使用 `element` 把内容单独写到一个组件，更利于维护，也有着更好的性能



### 数组项

传递的 `fields` 是一个 `Ref<any[]>`数组，内部可以循环它创建更多子字段内容，但需要注意以下内容，写法参考 demo 的注释部分，放弃思考的可以 cv 照葫芦画瓢

- **name 属性此时必须是循环的下标，不然内部不知道当前创建的字段是数组哪一项的内容**
- **子字段有且仅有一个，如果有多个会发生覆盖，因为如果子字段指向一个下标会发生冲突，所以有多个时请用 ObjectField 嵌套**
- **请使用提供的 actions 对象里的方法来操作数组，如果直接修改响应式变量 fields 会发生许多意外情况**
- **请保证数组每一项都有一个唯一的 id，不然会发现数据错位的情况，没有 id可以直接 Math.random 整个随机 数字**



### 互操作 

actions 是数组组件内部的互操作对象

内部方法 `get/set/subscribe/getFormData`，效果同 `Form` 组件同名的内容

其他方法

```typescript
interfalce Methods {
  push: (e: Record<any, any>) => void         //尾部添加，等同于 setValue(fields.length,e)
  unshift: (e: Record<any, any>) => void       //头部添加，等同于 setValue(-1,e)
  pop: () => void  //尾部删除
  shift: () => void   //头部删除
  setValue: (index: number, e: any) => void // >数组长度是尾部添加，<0是头部添加，其他等同于替换下标处
  delValue: (index: number) => void;  //>数组长度是尾部删除，<0是头部删除，其他等同于删除指定下标
  swap: (i1: number, i2: number) => void; //交换两个下标的内容
}
```

整体替换替换使用 `actions.set('', 你的新数组)`





## 布局、逻辑 组件

布局组件只有一个 `FormItem`

字段组件本身并不提供校验和布局能力，这些都是由 `FormItem` 组件提供

该组件是仿照 `element-plus` 的 `FormItem` 组件的仿品，内部逻辑截然不同，在功能上会尽量做到还原



### 接收参数

```ts
export interface FormItemProps {
  label?: string      //标题
  labelWith?: string | number   //标题宽度，默认是 auto
  size?: "small" | "large" | "default"  //尺寸，默认 small
  required?: boolean       //是否必传
  rules?: (RuleItem | string)[] //如果是字符串，会从 form.config.Rules 中取，RuleItem规则同async-validator,element-plus的form-item
  Rules?: Record<string, RuleItem> 
  disabled?: boolean       //是否禁用
  inline?: boolean         //是否是行内，默认是 display:flex 行内变成 display:inline-flex
  position?: "left" | "right" | "top"  //效果同 element-plus formItem
  showError?: boolean        //是否在校验失败时展示错误信息
  children?: (p: any) => any[] //
}
```



### 传递给插槽的参数

```ts
export interface FormItemAttrs {
  id: string       //label 会使用 label 标签包裹，for 指向的 id，用于点击标签聚焦到表单组件
  disabled: boolean  //禁用状态
  size: "small" | "large" | "default" //尺寸
  onChange: (e: any) => void //当表单内容变化时，触发校验
}
```

表单字段的值是在字段组件中维护的，布局组件就需要通过单独的方式`onChange` 来拿到最新状态

所以它会覆盖用户的 `onChange`，如果需要观察值的变化请使用交互对象的 `subscribe` 方法



### 自定义布局组件

#### 参数

布局组件会在字段组件中渲染，类似于这样

```tsx
defineComponent({
  setup() {
    return () => (
    	<FieldLayout 
        {...props.layoutProps} 
        children={(p = {}) => [slots.default({ ...p, ...xxx })]} 
        ref={fieldLayoutRef} />
    )
  }
})
```

接受到来自字段组件的参数

- `Rules` 这是全局配置的校验项对象
- `children` 接收一个可选传对象的函数，返回实际内容的插槽执行结果
- 外部传递的 `layoutProps`



#### expose

内部可以渲染性暴露如下方式用于校验

```ts
export interface FormItemExpose {
  validate: (name: string, value: any) => Promise<any>
  setValidateState: (state: { error: boolean; message: string }) => void
}
```

字段组件会在用户调用，`form[validate/reset]` 时调用调用同名组件



#### 渲染实际内容

不考虑复杂的情况，渲染实际内容时只需要把 `children` 放进去即可

```tsx
defineComponent({
  setup() {
return () => {
      const children = (
        props.children ? 
					props.children({/*这里的内容会被间接的传递给实际组件的 props 中*/}) : 
					slots.default?.()
      ) ?? []
      return (
        <div class="form-item">
           <label class="label" style={labelStyle.value} for={id}>
              {props.label}
            </label>
          <div class="content">
						{children}
          </div>
        </div>
      )
    }
  }
})
```





## 表单校验

### 自定义校验

内部校验方式和市面上大多数  `ui` 库保持一致，都是用的 `async-validator`，校验的逻辑为，调用所有 `PlainField` 内的 `validate` 函数，然后在手动调用布局组件内部的检验方式

流程上会挺麻烦，如果觉得灵活度不够可以直接获取表单内容，自行校验，`async-validator` 被暴漏在 

`import {} from '@usaform/element-plus/validator'` 路径下



### 触发校验的异常

目前内部结构只支持当字段内容发生改变时触发，数据是否发生改变依赖 `onChange` 函数的调用

