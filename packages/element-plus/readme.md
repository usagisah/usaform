# @usaform/element-plus

文档请以[仓库](https://github.com/usagisah/usaform/tree/main/packages/element-plus)最新的内容为准



## 简介

一个用于构建高性能**类表单系统**的逻辑控制组件库，使用它可以可以收获到以下好处

1. 高性能，跨组件的互操作性

   在类表单系统的场景下，会出现很多逻辑上是高耦合，但内容又不得不拆的情况。该库提供了一套类似于的状态管理库的机制，使得被拆分到各处的，不同层级的组件，都可以在保持局部更新的前提下，进行互操作

2. 高度灵活

   该库是一个逻辑组织库，具体内容实现完全依赖于自定义，或者`ui`组件库

3. 相对简单

   市面上会有许多表单相关的库，相比较而言该库**体积更小，观念更少，操作简单**

ps: 当前是用的 tsc 打包，所以 npm 上的同级会很大，实际上并不大

什么情况下可以尝试使用

1. 多层次的嵌套表单 —— 主要提供便利
2. 比较复杂的动态表单 —— 主要提供性能，优雅的交互

因为本库核心逻辑是基于`@usaform/vue` 实现核心逻辑，并围绕表单场景做了些开箱即用的扩展，本身具备着一定程度的性能开销，所以对于非以上两种场景，请慎用



## 必看内容

- 项目配置（会 cv）

- 组织概念（了解）

如果文档看着比较难以理解，强烈建议看看仓库中的 examples 中的几个使用[例子](https://github.com/usagisah/usaform/tree/main/packages/examples/element-plus)





## 项目配置

下载依赖

```shell
pnpm add @usaform/element-plus element-plus @vitejs/plugin-vue-jsx sass
```

配置 vite

```js
export default defineConfig({
  plugins: [vue(), jsx()]
})
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





## 组织理念

### 结构

通过上边的 `demo`，可以看到使用上大致分为 3 部分组成，其他内容均围绕这三个内容展开

1. 创建表单

   通过 `<Form />` 表单即可创建，内部会属于该表单的上下文信息

2. 使用字段组件

   字段组件用于创建表单项，使用时内部会自动注册到表单的上下文中

   提供的字段组件总共有3个

   - `PlainField` 创建基本值字段，比如 `input/select` 这种无法继续细分的就是基本值，所以该组件无法嵌套
   - `ObjectField` 创建对象字段，用于嵌套
   - （难）`ArrayField` 创建数组字段，用于嵌套和动态表单
   
3. 与表单交互

   交互操作需要用到互操作实例方法

   - 获取所有表单内容
   - 对表单进行校验
   - 调用某个字段的自定义内容
   - 修改某个字段内容
   - 获取某个字段内容
   - 监听某个字段内容

   交互需要获取不同表单内部的操作实例，获取方式请往后看

### 写法

为了保证使用的灵活性，框架只提供逻辑上的粘合能力，关于表单的实际的内容，布局全部自行填充

写法上会有两种风格

- 全部用插槽，写起来方便
- 使用指定 key，写起来啰嗦，但性能最好

建议，对于简单的场景可以直接 cv 组件库的组件填充。一般用插槽写即可，除非出现性能问题可以选择指定 key 的方式

### 数据

表单的数据由框架内部的一套机制进行管理，暴露出来的通常是一个`vue 的 shallowRef()`，不同字段（即使是上下级）的数据是互相独立的，只有在创建时会进行一次交互

如果要对当前字段，或者其他字段进行增删改查，为了避免意外 bug 请全部使用 **通用的互操作实例方法** 进行操作



## 表单组件 -- `Form`

用于创建表单的上下文容器

```vue
<script setup lang="ts">
import { Form, FormConfig, CFormExpose } from "@usaform/element-plus"
const form = ref<CFormExpose | null>(null)
const config: FormConfig = {}
</script>

<template>
<Form ref="formKey" :config="config">
  </Form>
</template>
```

`ref` 获取到的是[互操作实例](#通用的互操作实例方法)

`config` 配置选项同 [表单配置](#表单配置)

`Form` 组件内，如果是字段组件会自动注册，其他组件和样式都会原封不动的显示





## 字段组件 -- `PlainField`

**用处创建基本值的字段，无法进行嵌套**

该组件没有操作性实例使用，因为如果传递，在直接 cv 组件库代码时，没有使用的属性会自动传递到填充组件的 dom 属性上导致不美观，如果需要使用请使用 `ObjectField` 嵌套后传递后使用

### 参数

```ts
export interface PlainFieldProps {
  name: string | number  //字段名称

  initValue?: any   //字段的初始值，优先级大于配置的默认值，不传或传递undefined数据会自动透传

  layout?: string    //布局组件 key，如果传就用
  layoutProps?: Record<any, any> //转发给布局组件的参数

  element?: string   //填充组件的 key
  props?: Record<any, any> //填充组件的参数
}
```

ps：key 值就是表单配置或者 `form` 组件配置中的 `Elements` 对象中的 key

### 插槽写法

```html
<PlainField name="input" layout="FormItem" :layout-props="{ label: '名称', required: true }">
  <template #default="{ bind }">
    <ElInput v-bind="bind" placeholder="请输入名称" />
  </template>
</PlainField>
```

`bind` 参数是一个包装好的对象，里边包含了数据绑定相关的方法，插槽写法则必须绑定

### 指定 key 写法

```html
<PlainField 
            name="input" 
            layout="FormItem" 
            :layout-props="{ label: '名称', required: true }" 
            element="ElInput" 
            :props="{ placeholder: '请输入名称' }" 
/>
```

区别在于把放在插槽的内容放到了别处（通常是一个新的组件文件），通过配置表单的 `Elements`，再用 `element` 属性进行引用

尽量让其保持高优先级，不然可能会导致意外的 bug

### 封装 element 指向的组件文件

```vue
<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus"
import { watch } from "vue";
const props = defineProps<{ onChange: any }>()
const value = defineModel<string>()
watch(value, v => props.onChange?.(v))
</script>

<template>
  <ElSelect v-model="value">
    <ElOption label="1" value="1" />
    <ElOption label="2" value="2" />
    <ElOption label="3" value="3" />
  </ElSelect>
</template>
```

以上写法是一个参考，该文件接收的参数来源于 2 个地方

- [布局组件](#布局组件)
- 框架内部的数据绑定，如果

参数可能会比较多，不想控制台警告可以做如下设置

```vue
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>
```





## 字段组件 -- `ObjectField`

用来做分组嵌套的组件，本身不产生样式和显示逻辑

### 参数

```tsx
export interface PlainFieldProps {
  name: string | number  //字段名称

  initValue?: any   //字段的初始值，优先级大于配置的默认值，不传或传递undefined数据会自动透传

  layout?: string    //布局组件 key，如果传就用
  layoutProps?: Record<any, any> //转发给布局组件的参数

  element?: string   //填充组件的 key
  props?: Record<any, any> //填充组件的参数
}
```

和 `PlainField` 基本一致

### 插槽写法

```vue
<ObjectField name="object" layout="FormItem">
  <template #default="{ actions, fieldValue, ...other }">
		<PlainField name="aaa" element="MyInput" :props="{ actions }" />
		<PlainField name="xxx" element="MyInput" :props="{ actions }" />
  </template>
</ObjectField>
```

`actions` 是[通用的互操作实例方法](#通用的互操作实例方法)

`fieldValue` 是来自表单配置中的初始值

`other` 来自布局组件

### 指定 key 写法

```html
<ObjectField name="object" layout="FormItem" element="myInput"></ObjectField>
```

`ObjectField` 组件开销很小，为了方便可以多使用插槽写法

### 自定义文件

参数和插槽一样，写法上没有任何要求，当正常组件写即可

```vue
<script setup>
const props = defineProps<{ actions: any, fieldValue: any }>()
</script>
<template>
		<PlainField name="aaa" element="MyInput" :props="{ actions }" />
		<PlainField name="xxx" element="MyInput" :props="{ actions }" />
</template>
```







## 高级字段组件 -- `ArrayField`

用来做分组嵌套的组件

主要用于动态表单的场景，使用起来相对会更复杂些

### 参数

```tsx
export interface PlainFieldProps {
  name: string | number  //字段名称

  initValue?: any   //字段的初始值，优先级大于配置的默认值，不传或传递undefined数据会自动透传

  layout?: string    //布局组件 key，如果传就用
  layoutProps?: Record<any, any> //转发给布局组件的参数

  element?: string   //填充组件的 key
  props?: Record<any, any> //填充组件的参数
}
```

和 `PlainField` 基本一致

### 插槽写法

```vue
<ArrayField name="array">
  <template #default="{ fieldValue, actions }">
    <div v-for="(item, i) in fieldValue" :key="item.id">
      <PlainField :name="i" layout="FormItem" :layout-props="{ label: '名称', required: true }">
        <template #default="{ bind }">
          <ElInput v-bind="bind" placeholder="请输入名称" />
      </template>
      </PlainField>
    </div>
</template>
</ArrayField>
```

### 指定 key 写法

```vue
<ArrayField name="array" element="MyArrayComponent" />
```

### 接受参数

插槽和自定义组件的参数一致

```ts
export type CArrayFieldAttrs = {
  fieldValue: any[]
  actions: {
    push: (e: Record<any, any>) => void
    unshift: (e: Record<any, any>) => void
    pop: () => void
    shift: () => void
    setValue: (index: number, e: any) => void
    delValue: (index: number) => void;
    swap: (i1: number, i2: number) => void;
  }
} & Record<any, any>
```

- `fieldValue` 数组组件内的数组，可以循环它创建视图
- `actions` 经过二次封装后互操作方法（效果类似数组），除了公共的还有
  - `push`  尾部添加 1 个
  - `pop` 尾部删除 1 个
  - `unshift` 头部添加 1 个
  - `shift` 头部删除 1 个
  - `delValue` 删除指定下标元素，当`< 0` 删除头，`>=` 数组长度删除尾
  - `setValue` 修改指定下标元素，当`< 0` 头部添加，`>=` 数组长度尾部添加
  - `swap` 交换指定下标位置
- 其他参数为布局组件传递

如果要修改整个数组的内容，可以使用公共方法中的 set

```ts
actions.set("", newArray)
```

### 唯一性的要求

1. **在 `ArrayField` 组件下的，最顶层的字段组件，name 属性此时必须是循环的下标**

   因为需要根据下标挂载到数组的指定位置上

2. **最顶层的子字段有且仅有一个**

   如果有多个会发生覆盖，所以有多个时请用支持嵌套的组件，例如 `ObjectField/ArrayField` 进行分组嵌套

3. **请保证数组每一项都有一个唯一的 id**

   没有 id可以直接 Math.random 整个随机 数字





## 初始表单数据

表单数据通过配置 `defaultFormData` 实现

```ts
const formConfig: FormConfig = {
  defaultFormData: {
    field1: 1,
    field2: 2,
    object: {
      field3: 3,
      field4: 4
    },
    array1: [
      { id: 5, value: 5 },
      { id: 6, value: 6 }
    ],
    array2: [
      {
        groupId: 1,
        children: [
          {
            itemId: 11,
            children: {
              type: 1,
              operate: "*",
              value: ""
            }
          }
        ]
      }
    ]
  }
}
```

内部会根据给的数据结构自动匹配，如果匹配不到，或者值是 `undefined/null` 会自动跳过

**对于数组来说比较特别，框架需要数组项必须有唯一标识**，而数组中的字段用的是具体的值（不一定就是标识字段），所以当遇到数组时会进行解构处理

比如例子中的 `array1/array2`，它们的标识用的是 `id`，值用的是 `value/children`，当循环到数组时会判断是否存在指定的字段，有就用，没有就使用原始的数据。查找规则是按照配置顺序找，默认优先级为 `value > children` ，可通过配置改变顺序 [`config.arrayUnwrapKey`](#表单配置)





## 表单配置 

使用配置 hook `useFormConfigProvide()`

```ts
interface {
  Elements?: Record<any, any>         //全局组件，属性名会被当做 key 使用
  Rules?: Record<any, RuleItem>       //一个符合 async-validator 校验的对象（同element-plus）
  layoutProps?: Record<any, RuleItem> //批量传给布局组件的参数
  defaultValue?: any                  //字段的默认值
  defaultFormData?: Record<any, any>  //表单的初始值
  arrayUnwrapKey?: string | string[]  //数组组件的解构路径
  [x: string]: any
}
```

配置可以同时存在多个，下层的会默认继承上层，越是下层优先级越高

```ts
// 全局使用，这里需要传 app 实例
import { FormItem, useFormConfigProvide } from "@usaform/element-plus"
const app = createApp(AppVue)
useFormConfigProvide(
  {
    Elements: {
      ElInput,
      ElSelect,
      FormItem,
      ElInputNumber
    }
  },
  app
)
app.mount("#app")


// 局部使用时，直接传配置即可
defineComponent({
  setup() {
    useFormConfigProvide(
      {
        Elements: {
          ElInput,
          ElSelect,
          FormItem,
          ElInputNumber
        }
      }
		)
  }
})
```





## 通用的互操作实例方法

| 属性        | 类型                                                                                      | 描述                                                       |
| ----------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| reset       | () => void                                                                                | 清空所有组件的值                                           |
| validate    | () => Promise<FormValidateError[]>                                                        | 触发所有 `PlainField` 组件的校验，只返回校验失败的字段信息 |
| getFormData | Record<string, any>                                                                       | 不触发校验，返回表单内部所有的值                           |
| subscribe   | (*paths*: string, *handle*: import("./useFieldValue").FieldSubscribeHandle) => () => void | 订阅匹配字段的修改，返回取消订阅的函数                     |
| get         | (*path*: string) => any[]                                                                 | 获取匹配字段的值                                           |
| set         | (*path*: string, *value*: any) => void                                                    | 设置匹配字段的值                                           |

- `get/set/subscribe` 方法的 `path` 都依赖于路径系统，详细规则往后看



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













## 布局组件

内部提供的布局组件只有一个 `FormItem`

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

- `Rules` 这是表单配置的校验项对象
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

