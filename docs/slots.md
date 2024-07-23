# 内联插槽

内联插槽通常只会被用于，指定 `key` 或者 `json` 表单中

写法上需要向字段组件传递 `slots` 插槽对象

对于 `PlainField` 字段组件来说，它本身的插槽内容，会在指定 `key` 时被动态的放到 `slots` 对象中

```vue
<script lang="ts" setup>
import { h } from "vue"
import { createForm, FormItem, PlainField, exportFormStructJson } from "@usaform/element-plus"
import { ElButton, ElCard, ElOption, ElSelect, ElSpace } from "element-plus"
import Append from "./Append.vue"

const [Form, form] = createForm({ config: { plainFieldController: FormItem } })
const onSubmit = () => console.log(form.value?.getFormData())
const printJson = () => console.log(exportFormStructJson(form.value!.field))

const PrependComp = () => [h("div", "prepend")]
</script>

<template>
  <ElCard style="min-width: 600px">
    <Form>
      <!-- 外部插槽需要显示指定，内部插槽会自动传递 -->
      <PlainField name="input" element="ElInput" :props="{ style: 'width:100%' }" :layoutProps="{ label: '传递插槽' }" :slots="{ suffix: 'InputSuffix', prepend: PrependComp, append: Append }">
        <template #prefix>prefix-slot</template>
      </PlainField>
      <template #InputSuffix>
        <span>suffix-slot</span>
      </template>
    </Form>

    <ElSpace>
      <ElButton type="primary" @click="onSubmit">submit</ElButton>
      <ElButton type="primary" @click="printJson">json</ElButton>
    </ElSpace>
  </ElCard>
</template>

```





## 内联插槽

```vue
<template>
...
<Form>
  <PlainField element="ElInput">
    <template #prefix>prefix-slot</template>
  </PlainField>
</Form>
...
</template>
```

在 `PlainField` 中的所有插槽，会被自动传递给引用的组件



## 传递字符串引用

```vue
<template>

...
<Form>
  <PlainField element="ElInput" :slots="{ suffix: 'InputSuffix' }"></PlainField>
  
  <template #InputSuffix>
		<span>suffix-slot</span>
  </template>
</Form>
...

</template>
```

通过指定字符串

`key` 是要传递给内部组件的插槽名称，这里是 `suffix`

`value` 是要引用的插槽或组件名称，这里是 `InputSuffix`

引用范围包括，全局和局部配置的 `Elements` 选项，以及 `Form` 组件顶层的所有插槽



## 传递组件

```vue
<template>
...
<Form>
  <PlainField element="ElInput" :slots="{ append: Append }"></PlainField>
</Form>
...
</template>

<script setup>
  import Append from "./Append.vue"
</script>
```

可以直接传递组件



## 传递内联的函数组件

```vue
<template>
...
<Form>
  <PlainField element="ElInput" :slots="{ prepend: PrependComp }"></PlainField>
</Form>
...
</template>

<script setup>
const PrependComp = () => [h("div", "prepend")]
</script>
```

传递函数组件时，请确保函数返回一个包含了若干个组件的数组
