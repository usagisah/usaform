<script lang="ts" setup>
import { ArrayField, createForm, PlainField } from "@shoroi/form"
import { ElInput } from "element-plus"
import {} from "vue"

const [Form, actions] = createForm()
defineExpose({ actions })
</script>

<template>
  <Form>
    <ArrayField key="ary">
      <template #default="{ value, actions }">
        <div v-for="(item, i) in value" :key="item.id">
          <PlainField :key="i">
            <template #default="{ bind }">
              <ElInput v-bind="bind" />
            </template>
          </PlainField>
        </div>

        <div class="actions">
          <button class="push" @click="actions.push({ id: Math.random(), value: value.length })">尾部添加</button>
          <button class="pop" @click="actions.pop()">尾部删除</button>
          <button class="unshift" @click="actions.unshift({ id: Math.random(), value: value.length })">头部添加</button>
          <button class="shift" @click="actions.shift()">头部删除</button>
          <button class="swap" @click="actions.swap(0, value.length - 1)" v-if="value.length >= 2">首尾交换</button>
        </div>
      </template>
    </ArrayField>
  </Form>
</template>
