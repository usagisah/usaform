<script lang="ts" setup>
import { createForm, ObjectField, PlainField } from "@shoroi/form"
import { ElInput } from "element-plus"

const props = defineProps<{
  f1InitValue?: string
  f2InitValue?: string
}>()

const [SlotForm, SlotFormActions] = createForm()
defineExpose({ actions: SlotFormActions })
</script>

<template>
  <SlotForm>
    <ObjectField key="o1">
      <div class="ObjectFieldSlot">
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
      </div>
    </ObjectField>

    <ObjectField key="o2">
      <div class="ObjectFieldSlot">
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
      </div>
    </ObjectField>

    <ObjectField key="o3">
      <div class="ObjectFieldSlot">
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
      </div>
    </ObjectField>
  </SlotForm>
</template>
