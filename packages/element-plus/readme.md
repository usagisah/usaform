# @usaform/element-plus

**文档请以[仓库](https://github.com/usagisah/usaform/tree/main/packages/element-plus)最新的内容为准**

**不懂英文，写文档水平有限，文档站点计划再搞，先将就着看吧，如有 bug 或者好的意见请反馈给我，或者一起维护它**



## 简介

用于构建高性能**类表单系统**的，通用逻辑控制组件库。因为内部设计会更偏向于 `element-plus` 所以名字叫做 `element-plus`

只要是基于 `vue3` 的应用都可以使用，使用它可以可以收获到以下好处

1. 高性能，跨组件的互操作性

   在类表单系统的场景下，会出现很多逻辑上是高耦合，但内容又不得不拆的情况。该库提供了一套类似于的状态管理库的机制，使得被拆分到各处的，不同层级的组件，都可以在保持局部更新的前提下，进行互操作

2. 高度灵活

   该库是一个逻辑组织库，具体内容实现完全依赖于自定义，或者`ui`组件库

3. 相对简单

   市面上会有许多表单相关的库，相比较而言该库**体积更小，观念更少，操作简单**

**当前是用的 tsc 打包，文档内联进了发布的包里，所以 npm 上显示包体积会很大，实际上并不大**



## 适用场景

- 嵌套表单 —— 主要提供便利
- 动态表单 —— 主要提供性能，优雅的交互
- 作为元框架使用，用来封装自己业务的表单系统 —— 主要提供逻辑粘合能力（有 2 种程度上的封装选择，多种用户侧使用选择），只需要使用指定的方式，自定义填充，布局，具体表单项即可
- **表单系**功能 —— 比如一般的后台管理系统的页面，筛选列表和表格和其他等等为了封装可以拆分成不同组件，但这些组件之间存在着联动逻辑

不适用

- 用组件库 cv 就能快速搭出来的表单
- 简单表单 —— 比如单层的、简单的封装下组件库组件就够用了的

因为框架本身具备着一定程度的性能开销，组件库本身能力能覆盖的前提下，使用起来收益会非常有限



## 内容导航

- [必看内容](#必看内容)
- [内容导航](#内容导航)
- [项目配置](#项目配置)
- [组件理念](#组织理念)
- [表单组件----form](#表单组件----form)
- [字段组件----plainfield](#字段组件----plainfield)
- [字段组件----objectfield](#字段组件----objectfield)
- [高级字段组件----arrayfield](#高级字段组件----arrayfield)
- [初始表单数据](#初始表单数据)
- [表单配置](#表单配置)
- [通用的互操作实例方法](#通用的互操作实例方法)
- [路径系统](#路径系统)
- [布局组件](#布局组件)
- [自定义校验](#自定义校验)
- [typescript-支持](#typescript-支持)
- [元 hooks](#元 hooks)
- [反馈 & Q & A](#反馈 & Q & A)



## 必看内容

- 项目配置（会 cv）

- 组织概念（了解）

如果文档看着比较难以理解，强烈建议看看仓库中的 examples 中的几个使用[例子](https://github.com/usagisah/usaform/tree/main/packages/examples/element-plus)，例子为一些常用写法提供参考

1. 基础用法
2. 嵌套用法
3. 数组用法
4. 3者混合用法
5. 完全自定义封装
6. 分步表单 —— 如何做出类似表单功能其他东西
7. 后台页面

```shell
# 在项目根目录下载依赖
pnpm i
# 启动 demo
pnpm --filter example-element-plus dev
# 访问页面即可浏览
```





## 项目配置

下载依赖

```shell
pnpm add @usaform/element-plus element-plus @vitejs/plugin-vue-jsx sass
```

配置 vite

```js
import vue from "@vitejs/plugin-vue"
import jsx from "@vitejs/plugin-vue-jsx"
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

2. 使用字段组件（共 3 个）

   字段组件用于创建表单项，使用时内部会自动注册到表单的上下文中

   字段组件项

   - `PlainField` 创建基本值字段，比如 `input/select` 这种无法继续细分的就是基本值，所以该组件无法嵌套
   - `ObjectField` 创建对象字段，用于嵌套
   - （难）`ArrayField` 创建数组字段，用于嵌套和动态表单
   
3. 与表单交互（默认提供 1 个）

   交互是指，通过表单内部提供的**互操作实例**方法进行一些跨字段的增删改查操作，例如以下内容

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
- 使用指定 key，写起来啰嗦，但性能最好 —— 提前配置好用到的所有组件，然后通过属性指定用哪个

建议，对于简单的场景可以直接 cv 组件库的组件填充。一般用插槽写即可，除非出现性能问题可以选择指定 key 的方式

### 数据

表单的数据由框架内部的一套机制进行管理，暴露出来的通常是一个`vue 的 shallowRef()`，不同字段（即使是上下级关系）的数据是互相独立的，只有在创建时会进行 1 次交互，后续只有当修改上级数据才会重新发生 1 次交互

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

### 参数

```ts
export interface PlainFieldProps {
  name: string | number  //字段名称

  initValue?: any   //字段的初始值，优先级大于配置的默认值，不传或传递undefined数据会自动透传

  layout?: string | Record<any, any>    //布局组件 key，字符串时使用配置中的组件，对象则直接当做组件使用
  layoutProps?: Record<any, any> //转发给布局组件的参数

  element?: string | Record<any, any>   //填充组件的 key，字符串时使用配置中的组件，对象则直接当做组件使用
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

如果传的是一个对象（比如一个 vue 文件，一段 tsx 代码，被 vue 插件编译后就是一个对象），则会当做组件使用

### 自定义 element 指向的组件文件

```vue
<script lang="ts" setup>
import { ElOption, ElSelect } from "element-plus"
const props = defineProps<{actions: any}>()
const api: CArrayFieldActions = props.actions
const value = defineModel<string>()
</script>

<template>
  <ElSelect v-model="value">
    <ElOption label="1" value="1" />
    <ElOption label="2" value="2" />
    <ElOption label="3" value="3" />
  </ElSelect>
</template>
```

参数来源于 2 个地方

- [布局组件](#布局组件)，主要是些是否禁用之类的，具体内容查看该章节
- `PlainField`
  -  `v-model` 所需的参数，使用 `defineModel` 绑定即可
  - `actions` 表单的互操作对象，只有非插槽写法下才会传递


建议布局组件的参数自动继承，其他的正常接收，如果不想自动继承，可以使用以下设置，禁止自动继承

```vue
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>
```

### 修改值

有 2 种方式

1. `actions.set('', 新的值)`

2. `value.value = 新值` 

对于 `PlainField` 推荐使用第二种，`actions.set` 会干掉所有内容在重新创建，第二种则不会

接收到的（`defineModel`使用的）值是一个 `shallowRef`，所以只有修改 `.value` 该能触发更新



## 字段组件 -- `ObjectField`

用来做分组嵌套的组件，本身不产生样式和显示逻辑

### 参数

```tsx
export interface PlainFieldProps {
  name: string | number  //字段名称

  initValue?: any   //字段的初始值，优先级大于配置的默认值，不传或传递undefined数据会自动透传

  layout?: string | Record<any, any>    //布局组件 key，字符串时使用配置中的组件，对象则直接当做组件使用
  layoutProps?: Record<any, any> //转发给布局组件的参数

  element?: string | Record<any, any>   //填充组件的 key，字符串时使用配置中的组件，对象则直接当做组件使用
  props?: Record<any, any> //填充组件的参数
}
```

### 插槽写法

```vue
<ObjectField name="object" layout="FormItem">
  <template #default="{ actions, fieldValue, ...other }">
		<PlainField name="aaa" element="MyInput" />
		<PlainField name="xxx" element="MyInput" />
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

### 自定义 element 指向的文件

```vue
<script setup>
const props = defineProps<{ actions: any, fieldValue: any }>()
</script>
<template>
		<PlainField name="aaa" element="MyInput" :props="{ actions }" />
		<PlainField name="xxx" element="MyInput" :props="{ actions }" />
</template>
```

对于所有参数，接收的参数来源于 2 个地方

- [布局组件](#布局组件)，主要是些是否禁用之类的，具体内容查看该章节
- `ObjectField`
  - `fieldValue`  初始化时的值转成 `Ref`，一般不会用到
  - `actions` 表单交互对象，方法同[通用的互操作实例方法](#通用的互操作实例方法)

如果不想自动继承，可以使用以下设置，只接收需要的参数

```vue
<script setup lang="ts">
defineOptions({
  inheritAttrs: false
})
</script>
```

### 修改值

请不要直接修改 `fieldValue`，这会导致内部数据混乱出现 bug

请使用 `set` 方法修改， `action.set("", 新值)`





## 高级字段组件 -- `ArrayField`

用来做分组嵌套的组件

主要用于动态表单的场景，使用起来相对会更复杂些

### 参数

```tsx
export interface PlainFieldProps {
  name: string | number  //字段名称

  initValue?: any   //字段的初始值，优先级大于配置的默认值，不传或传递undefined数据会自动透传

  layout?: string | Record<any, any>    //布局组件 key，字符串时使用配置中的组件，对象则直接当做组件使用
  layoutProps?: Record<any, any> //转发给布局组件的参数

  element?: string | Record<any, any>   //填充组件的 key，字符串时使用配置中的组件，对象则直接当做组件使用
  props?: Record<any, any> //填充组件的参数
}
```

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

### 参数

插槽和自定义组件的参数一致

```ts
export type CArrayFieldAttrs = {
  fieldValue: any[]
  actions: CArrayFieldActions
} & Record<any, any>
  
export interface CArrayFieldActions {
  push: (e: Record<any, any>) => void
  unshift: (e: Record<any, any>) => void
  pop: () => void
  shift: () => void
  setValue: (index: number, e: any) => void
  delValue: (index: number) => void;
  swap: (i1: number, i2: number) => void;
}
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

### 修改值

请不要直接修改 `fieldValue`，这会导致内部数据混乱出现 bug

修改整个数组的内容，可以使用公共方法中的 set， `actions.set("", 新数组)`

其他修改可以使用 `actions` 提供的方法

### 唯一性的要求

1. **在 `ArrayField` 组件下的，最顶层的字段组件，name 属性此时必须是循环的下标**

   因为需要根据下标挂载到数组的指定位置上

2. **最顶层的子字段有且仅有一个**

   如果有多个会发生覆盖，所以有多个时请用支持嵌套的组件，例如 `ObjectField/ArrayField` 进行分组嵌套

3. **请保证数组每一项都有一个唯一的 id**

   没有 id可以直接 Math.random 整个随机 数字

```html
<ArrayField name="">
  <!-- 嵌套的深度无所谓 -->
	<div>
    <div>
      <!-- 内部会根据 name（此时一定是下标）进行赋值，所以后者会覆盖前者 -->
      <!-- key 一定要唯一，不然使用 actions.unshift 头部添加，会导致错位匹配 -->
      <ObjectField :name="0" :key="Math.random()"></ObjectField>
      <ArrayField :name="0" :key="Math.random()""></ArrayField>
    </div>
  </div>
</ArrayField>
```



## 初始表单数据

表单数据通过配置 `defaultFormData` 实现

```vue
<script>
const formConfig: CFormConfig = {
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
</script>
<template>
	<Form :config="formConfig"></Form>
</template>
```

内部会根据给的数据结构自动匹配，如果匹配不到，或者值是 `undefined/null` 会自动跳过

### 特殊情况--数组项

**对于数组来说比较特别，框架需要数组项必须有唯一标识，不然数组在更新时会发生错位匹配**，所以数组项中就必须要有两个值，一个是唯一标识符（id），另一个才是具体的数组的值

```vue
<template>
<Form>
  <ArrayField name="arr">
  	<PlainField :name="0" element="ElInput" />
  </ArrayField>
 </Form>
</template>
```

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
```

`arrayUnwrapKey` 是一个字符串数组，框架内部会循环数组，逐个尝试，找到就用，找不到会使用原始的数据项，默认值是`[value, children]`

对于这个例子来说

- 因为有 `value` 所以会用 `value` 传递给 `PlainField` 作为初始值使用
- 如果没有 `value`，那么此时会使用 `{id: 0}` 这个对象本身

**巩固：`ArrayField` 的 `fieldValue` 此时是 `[{id:0, value:xxx}]`。解构赋值只作用于，数组中每一项向下传递的组件，例如这里的 `PlainField`**



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

操作时用到的路径属于[路径系统内容](#路径系统)

空路径字符串等于操作自身

### `reset`

类型 

 `() => void`

描述

清空所有组件的值，`ArrayField` 统一清空成空数组，`PlainField` 清空成 `config.defaultValue`

### `validate`

类型

`() => Promise<FormValidateError[]>`

```ts
type validate: () => Promise<{
  path: string  //根字段到异常字段的路径
  field: string //字段 name
  message: string //异常信息
}[]>
```

描述

框架提供的一个开箱即用的批量校验方法

方法只会存在校验失败的字段，空数组表示全部成功

方法只会触发 `PlainField` 组件中，布局组件中存在 `validate` 方法的字段，`FormItem` 字段中就有，自定义方式看[布局组件内容](#布局组件)

### `getFormData`

类型 `() => Record<string, any>`

描述

返回表单中的数据对象

### `subscribe`

类型

```ts
type S = (
	path: string  //路径字符串
	handle: (newValue, oldValue) => any //订阅函数，接收一个最新值和上一次的值
	config?: {immediate?: boolean} //是否立即执行一次
)
=> unSubscribe //解除所有的订阅的函数
```

描述

订阅匹配字段的修改，返回取消订阅的函数

当订阅失败，或者找不到订阅的字段时，相当于无任何效果，不报错，如果订阅失败可能有 2 种可能

1. 路径不对
2. 订阅的字段尚未挂载，可以尝试在 `nextTick/onMounted` 中调用

如果操作正确大概率是第二种方式引起的，可以尝试使用内部的帮助函数

`onNextTick` 封装了`nextTick && onBeforeUnMount` ，确保在组件全部挂载后立即执行，并判断如果返回值是一个函数，则会在当前组件卸载后调用，防止内存泄漏

```ts
import {onNextTick} from "@usaform/element-plus"
onNextTick(() => {
  return subscribe(
    "../type",
    v => {
      const o = (operates.value = _data.operates[v])
      value.value = o[0]
    },
    { immediate: true }
  )
})
```



### `get`

类型

```ts
type Get = (
	path: string //路径
	config?: FormActionGetConfig
) => Record<string, any>[] //获取到的所有值的数组

export interface FormActionGetConfig {
  //默认 false, 是否在找到第一个匹配的结果后立即返回
  first?: boolean  
  //默认 false, 是否将找到的字段展开获取
  //内部数据不同层级都是互相独立的，下级字段修改不同同步给上级。是否展开的区别在于，是否把下级的内容给拼到最终结果里
  shallow?: boolean 
}
```

描述

获取匹配字段的值，空字符串表示获取当前字段

### `set`

类型 

`(path: string, value: any) => void`

描述

设置匹配字段的值，空字符串表示修改当前字段

### `callLayout`

类型

```ts
type CallElement = (
	path: string,  //路径
	key: string,   //方法名
	point?: any    //this 指向
	...params: any[] //参数
) => Record<string, any> //返回所有匹配路径下的，方法的返回值
```

描述

调用路径字段组件中的布局组件中，指定的的方法，如果不是函数会自动跳过

### `callElement`

类型

```ts
type CallElement = (
	path: string,  //路径
	key: string,   //方法名
	point?: any    //this 指向
	...params: any[] //参数
) => Record<string, any> //返回所有匹配路径下的，方法的返回值
```

描述

调用路径字段组件中的填充组件中，指定的的方法，如果不是函数会自动跳过

### `call`

类型

```ts
type Call = (
	path: string, //路径
	key: string,  //方法名
	config?: FormActionCallConfig) 
=> Record<string, any> //返回所有匹配路径下的，方法的返回值
export interface FormActionCallConfig {
  point?: any            // this 指向，默认是 globalThis
  params?: any[]    //参数，内部会通过 apply 展开传递给方法
  first?: boolean     //是否在找到第一个后结束
  fieldTypes?: ("plain" | "object" | "array" | "array-item")[] //字段类型数组，用于筛选是否想要指定哪些字段类型中的方法
}
```

描述

调用路径字段中的指定方法，如果不是函数会自动跳过，其他所有调用某某方法都是基于它的封装



## 路径系统

表单的任意字段中都可以访问其他任意位置的字段内容，一般情况可以直接获取所有表单内容自取即可，可是例外情况就不好用了

1. 监听其他字段的修改
2. 批量操作
3. 在数组中，不知道开始字段是从哪开始的，需要以自身出发，找到相对路径的其他属性

路径系统的写法类似于文件路径，写法上是一个字符串，以 `/` 分割，默认是从发起者字段为起点开始查找

为了易用性和支持批量，内部会将路径字符串分割`split`，分出来的每块都会转成正则和每个字段名称匹配，正则会进行缓存，性能可以得以保障

查找规则如下，找不到会直接退出

- 一般查找
  - `a/b/c` 找自己下边的 a，a下边的 b，b下边的c
- 正则查找 && 批量查找
  - `a/.*/c`  找自己下边的 a，a 下边所有的字段，所有字段下边的 c
  - `a/[0-9]/c` 找自己下边的 a，a 下边 0-9 的字段（通常用于数组），所有字段下边的 c
- 根部查找
  - `~/a` 从最顶层找下边的 a
- 向上找
  - `../a` 找父节点下的 a
- 搜索全部
  - `xx/xx/all` 
    - 必须是以 `all` 结尾才会找全部，否则会视为一般查找被转成正则
    - 通常用于方法调用中`call/callLayout/callElement`，它可以无视表单的深度查找所有
  
- 返回自己
  - `""` 空字符会返回自身
  - 因为直接修改暴露出来的响应式变量会存在很多未知的边界情况，建议除了 `PlainField` 始终使用内部提供的操作方式，来修改自身或者其他字段的值





## 布局组件

内部提供的布局组件只有一个 `FormItem`

字段组件本身并不提供校验和布局能力，这些都是由布局组件提供

该组件是仿照 `element-plus` 的 `FormItem` 组件的仿品，内部逻辑截然不同，在功能上会尽量做到还原



### 接收参数

```ts
export interface FormItemProps {
  label?: string      //标题
  labelWith?: string | number   //标题宽度，默认是 auto
  size?: "small" | "large" | "default"  //尺寸，默认 small
  required?: boolean       //是否必传
  rules?: (RuleItem | string)[] //如果是字符串，会从 form.config.Rules 中取，RuleItem规则同async-validator,element-plus的form-item
  disabled?: boolean       //是否禁用
  inline?: boolean         //是否是行内，默认是 display:flex 行内变成 display:inline-flex
  position?: "left" | "right" | "top"  //效果同 element-plus formItem
  showError?: boolean        //是否在校验失败时展示错误信息
  __fieldInfo?: CPlainFieldLayoutInfo | CObjectFieldLayoutInfo | CArrayFieldLayoutInfo //字段组件一定会传递的，操作字段相关的一些内容
}

//内容基本都一致
type CPlainFieldLayoutInfo = {
  type: "plain" //什么类型的字段进来的
  fieldValue: Ref<any> //通过 shallowRef 创建的字段内的变量
  actions: PlainFieldActions  //不同类型字段组件的互操作方法
  Rules: Record<any, CFormRuleItem>  //全局配置中的对象
  children: (p: Record<any, any>) => any //对填充组件包装后的函数，可以在调用时动态混进去一些参数
}
```

### 传递给插槽的参数

```ts
export interface FormItemAttrs {
  id: string       //label 会使用 label 标签包裹，for 指向的 id，用于点击标签聚焦到表单组件
  disabled: boolean  //禁用状态
  size: "small" | "large" | "default" //尺寸
  onBlur: () => void //当表单内容变化时，触发校验
}
```

建议不需要显示的接收，让它们自动继承给填充组件即可

### 校验

如果配置了 `required || rules` 两个参数则会进入校验判断

#### 触发方法

校验提供了两种触发方法（同 `element-plus`）

- `blur` 失去焦点时触发 （默认）

  给填充组件提供一个 `onBlur` 函数，调用时触发，否则则不会触发

- `change` 输入内容变化触发

  直接监听 `PlainField` 的 `fieldValue` 变化触发

#### 编写自定义规则

规则的写法参考 `async-validator`，想省事直接看 `element-plus 的 rule` 写法也行

如果开启 `required` 相当于自动添加了一个默认规则，代码如下，自定义规则时可以参考这个写法

```ts
const requiredRule: CFormRuleItem = {
  message: "", //异常信息
  trigger: "blur", //触发校验的方式
  validator: (_, v) => {  //自定义校验函数，返回 true 是通过，false 失败
    if (Array.isArray(v) || typeof v === "string") return v.length !== 0
    if (v === undefined || v === null || v === false) return false
    return true
  }
}
```

#### 触发指定路径的校验方法

在公共的互操作方法中可以选用 `callLayout`，用来执行指定字段中的方法

### 自定义布局组件

自定义布局组件的意义在于，在提供布局的同时，会提供一些额外的逻辑，否则可以直接自定义填充组件即可

布局组件会比填充组件多接收一个 `__fieldInfo` 参数，使用它可以做些逻辑上的操作

渲染 `ui` 推荐使用 `tsx` 语法，因为渲染实际填充内容需要指定 `children` 函数，它的作用可以看成是一个插槽函数

- 模版中使用标签写法，和 `<slot />` 用法一致
- 完全的 `tsx` 写法中可以直接函数调用 `<div>{children()}</div>`

也可以暴漏一些方法出去，供用户使用 `callLayout` 方法调用，这样可以做些更高级的操作

```vue
<script lang="tsx" setup>
import { ref } from "vue"
import { CFieldLayoutInfo } from "@usaform/element-plus"
import { ElCard, ElDivider } from "element-plus"

const props = defineProps<{ __fieldInfo: any }>()
const { children }: CFieldLayoutInfo = props.__fieldInfo
const count = ref(0)
defineExpose({
  increase: () => count.value++
})
</script>

<template>
  <ElCard style="width: 800px">
    <template #header>
      <h1>自定义布局</h1>
    </template>
    <ElDivider content-position="center">布局自定义事件调用次数：{{ count }}</ElDivider>
    <div><children /></div>
  </ElCard>
</template>
```

### 特殊的暴露方法

```ts
export interface CFormItemExpose {
  validate: (name: string, value: any) => Promise<any> //校验
  setValidateState: (state: { error: boolean; message: string }) => void //重置异常
}
```

当用户调用 `actions[validate/reset]`时，需要做校验和情况操作，前者调用 `validate` 进行校验，后者调用 `setValidateState` 清空异常，如果布局组件不提供在对应的功能将会自动失效

当校验和重试时，只有在  `PlainField`  内部的布局组件才会被调用



## 自定义校验

内部校验方式和市面上大多数  `ui` 库保持一致，都是用的 `async-validator`，校验的逻辑为，调用所有 `PlainField` 内的 `validate` 函数，然后在手动调用布局组件内部的检验方式

如果觉得灵活度不够，或者是麻烦，可以直接获取表单内容`getFormData` 后自行校验，`async-validator` 被暴漏在 

`import { Schema } from '@usaform/element-plus/validator'` 路径下



## typescript 支持

文档中的类型都是演示用的假类型

内部源码是有 `@usaform/element-plus` 和 `@usaform/vue` 组成，前者提供组件，后者提供逻辑，用户使用的都是用前者经过二次封装后的类型

在类型上，`@usaform/element-plus` 的类型都是以 `C` 开头的，需要手动编写类型时，可以写个相关的组件看看 ide 提示，然后复制粘贴出来用。类型很多，就不一一列举了



## 元 hooks

对外提供的所有组件和方法，底层逻辑都是由内部包 `@usaform/vue` 提供的一些列自定义 `hook` 做到的，大多数情况都不太推荐单独用这个 `npm` 包，因为单独用起来繁琐，很麻烦

暴露出来的目的是，给予不满足现状的开发者，有能力自定义属于自己的表单框架。`@usaform/vue` 这个包提供了比较精简的组织逻辑，并做了大量的单元测试。可以从 `@usaform/element-plus` 中引用，也可以直接下载它（这是一个独立的包，其文档暂时只在这里提供）



### `useForm`

创建表单上下文

```ts
//接收一个配置，返回 操作实例actions 渲染组件FieldRender
type form = (config: FormConfig) => { actions, FieldRender }

type FormConfig ={
  defaultValue?: any   //字段中的默认值
  defaultFormData?: Record<any, any>  //初始化的表单数据
  arrayUnwrapKey?: string | string[] //数组项中的结构赋值数组
  [x: string]: any  //自定义配置项
}

type actions = {
    getFormData: () => Record<string, any>
  subscribe: (paths: string, handle: FieldSubscribeHandle, config?: FieldSubscribeConfig) => () => void
  get: (path: string, config?: FormActionGetConfig) => any[]
  set: (path: string, value: any) => void
  call: (key: string, point: any, ...params: any[]) => Record<string, any>
}
```

tsx 中使用

```tsx
defineComponent({
  setup() {
    const {FieldRender} = useForm({})
    return () => {
      const render = () => {
        return <div class="u-form">{slots.default?.()}</div>
      }
      return <FieldRender render={render}></FieldRender>
    }
  }
})
```

模版中

```vue
<script>
const {FieldRender} = useForm({})
</script>
<template>
	<FieldRender>
  	<slot />
 	</FieldRender>
</template>
```



### `useFormPlainField`

`plainField` 用于创建基础值字段，例如 `input/select` ，它只负责生产值，而不提供嵌套

```ts
export interface actions {
  getFormData: () => Record<string, any>
  subscribe: (paths: string, handle: FieldSubscribeHandle, config?: FieldSubscribeConfig) => () => void
  get: (path: string, config?: FormActionGetConfig) => any[]
  set: (path: string, value: any) => void
  call: (key: string, point: any, ...params: any[]) => Record<string, any>
  provide: () => void //注入上下文
}

export interface PlainFieldInitInfo {
  initValue: any      //从 form.defaultFormData 解出来当前字段的匹配值
  formConfig: FormConfig //创建时的配置
}

export interface PlainFieldConfig<T = any> {
  initValue?: T    //最终采用的初始值，不返回默认采用上边的 initValue
  [x: string]: any
}

type useFormPlainField = (
	name: FieldName,    // 字段名
	init: (info: PlainFieldInitInfo) => PlainFieldConfig //初始函数
): {
  fieldValue: Ref<T> //一个用 init 中的初始值创建的 shallowRef
  actions:  actions  //操作实例，与前文中通用操作实例同名的，效果一致
  FieldRender: null
}
```

```tsx
setup(props) {
  const { fieldValue, actions } = useFormPlainField("input", ({ formConfig, initValue }) => {
  	return { initValue: props.initValue ?? initValue ?? 1 }
	})
  actions.provide() //一定要记得调用
  return () => {
      const render = () => {
        return <div>...</div>
      }
      return <FieldRender render={render}></FieldRender>
  }
}
```





### `useFormObjectField`

用来做对象嵌套

```ts
export interface ObjectFieldInitInfo {
  initValue: any      //从 form.defaultFormData 解出来当前字段的匹配值
  formConfig: FormConfig //创建时的配置
}

export interface ObjectFieldConfig<T = any> {
  initValue?: T    //最终采用的初始值，不返回默认采用上边的 initValue
  [x: string]: any
}

type useFormObjectField(
	name: FieldName, 
	init: ObjectFieldInit<T>
): {
  fieldValue: Ref<T> //一个用 init 中的初始值创建的 shallowRef
  actions    //操作实例，同 form.actions
  FieldRender: //vue 组件
}
```

```tsx
setup(props) {
  const { fieldValue, actions, FieldRender } = useFormObjectField("object", ({ formConfig, initValue }) => {
  	return { initValue: props.initValue ?? initValue ?? 1 }
	})
  return () => {
      const render = () => {
        return <div>...</div>
      }
      return <FieldRender render={render}></FieldRender>
  }
}
```





### `useFormArrayField`

用来做数组嵌套

```ts
export interface ArrayFieldInitInfo {
  initValue: any      //从 form.defaultFormData 解出来当前字段的匹配值
  formConfig: FormConfig //创建时的配置
}

export interface ArrayFieldConfig<T = any> {
  initValue?: T[]    //最终采用的初始值，不返回默认采用上边的 initValue
  [x: string]: any
}

type useFormArrayField(
	name: FieldName, 
	init: ObjectFieldInit<T>
): {
  fieldValue: Ref<T[]> //一个用 init 中的初始值创建的 shallowRef
  actions: ArrayFieldActions   //操作实例，同 form.actions，多的三个和前文中同名的效果一致
  FieldRender: //vue 组件
}

export interface ArrayFieldActions extends FormBaseActions {
  setValue
  delValue
  swap
}
```



```tsx
setup(props) {
  const { fieldValue, actions, FieldRender } = useFormArrayField("array", ({ formConfig, initValue }) => {
  	return { initValue: props.initValue ?? initValue ?? 1 }
	})
  return () => {
      const render = () => {
        return <div>...</div>
      }
      return <FieldRender render={render}></FieldRender>
  }
}
```





### `createGlobalFormProvide`

创建全局表单配置，参数和 `useForm` 一样，提供的内容会被 `useForm` 自动合并

```ts
type createGlobalFormProvide = (config: FormConfig) => void
```





## 反馈 & Q & A

反馈 `bug` 或者优化意见可以通过以下3个方式联系到我

1. [掘金](https://juejin.cn/user/1143138325132862/posts)
2. [github](https://github.com/usagisah/usaform/tree/main)
3. 邮箱 `1286791152@qq.com`



- 后续计划
  - 暂时会以稳定和改 bug 为主
  - 后续 `2.0` 的计划主要是做到 `ui <-> json` 的双向互转，主要是能通过自定义的 `json` 结构做到
    - 在保持当前体积的前提下，做到和当前组件开发一样的效果，这对低代码，表单持久化
    - 让 `json` 和 `组件 ui` 的协同工作，这对于从接口中拿到 `json`，还原回组件形态之后的继续开发，会非常有帮助，纯粹的 `json` 是死的，规则多了维护就会产生巨大的压力
  - 再考虑的事情（如果你有好的建议，可以联系我共同考虑）
    - 是否需要提供一些辅助用的 `hooks` 和 组件，比如
      - 递归组件
      - 异步表单
      - 超大表单（1w+ 的表单项）
- 可以放心使用吗
  - 这个东西我自己在用，朋友在用，属于个人项目，主要用于解决后台管理系统中的表单场景。它可以帮我解决很多相关问题，所以有着天然的驱动力支持我去维护好它
  - 没有任何 `kpi` 成分，也不会归并到任何公司的产物里

