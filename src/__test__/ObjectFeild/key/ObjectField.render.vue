<script lang="ts" setup>
import { createForm, ObjectField, PlainField } from "@shoroi/form"
import { ElInput } from "element-plus"
import ObjectFieldComponent from "./components/ObjectFieldComponent.vue"

const props = defineProps<{
  f1InitValue?: string
  f2InitValue?: string
}>()

const [KeyForm, KeyFormActions] = createForm({ config: { Elements: { ObjectFieldComponent } } })
defineExpose({ actions: KeyFormActions })
</script>

<template>
  <KeyForm>
    <ObjectField key="o1" element="ObjectFieldComponent">
      <PlainField key="f1" :initValue="props.f1InitValue">
        <template #default="{ bind }">
          <ElInput v-bind="bind" class="f1" />
        </template>
      </PlainField>

      <PlainField key="f2" :initValue="props.f2InitValue">
        <template #default="{ bind }">
          <ElInput v-bind="bind" class="f2" />
        </template>
      </PlainField>
    </ObjectField>

    <ObjectField key="o2" element="ObjectFieldComponent">
      <PlainField key="f1" :initValue="props.f1InitValue">
        <template #default="{ bind }">
          <ElInput v-bind="bind" class="f1" />
        </template>
      </PlainField>

      <PlainField key="f2" :initValue="props.f2InitValue">
        <template #default="{ bind }">
          <ElInput v-bind="bind" class="f2" />
        </template>
      </PlainField>
    </ObjectField>

    <ObjectField key="o3" element="ObjectFieldComponent">
      <PlainField key="f1" :initValue="props.f1InitValue">
        <template #default="{ bind }">
          <ElInput v-bind="bind" class="f1" />
        </template>
      </PlainField>

      <PlainField key="f2" :initValue="props.f2InitValue">
        <template #default="{ bind }">
          <ElInput v-bind="bind" class="f2" />
        </template>
      </PlainField>
    </ObjectField>
  </KeyForm>
</template>
