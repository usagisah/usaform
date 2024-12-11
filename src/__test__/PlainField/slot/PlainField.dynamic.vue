<script lang="ts" setup>
import { createForm, PlainField } from "@shoroi/form"
import { ElInput } from "element-plus"
import { nextTick, ref } from "vue"

const [SlotForm, SlotFormActions] = createForm()
const conditionKeys = ref(["f1", "f2", "f3"])
defineExpose({
  actions: SlotFormActions,
  setConditionKeys(keys: string[]) {
    conditionKeys.value = keys
    return nextTick().then(() => SlotFormActions.value.getFormData())
  }
})
</script>

<template>
  <SlotForm>
    <PlainField key="f1" v-if="conditionKeys.includes('f1')">
      <template #default="{ bind }">
        <ElInput v-bind="bind" class="f1" />
      </template>
    </PlainField>

    <PlainField key="f2" v-if="conditionKeys.includes('f2')">
      <template #default="{ bind }">
        <ElInput v-bind="bind" class="f2" />
      </template>
    </PlainField>

    <PlainField key="f3" v-if="conditionKeys.includes('f3')">
      <template #default="{ bind }">
        <ElInput v-bind="bind" class="f3" />
      </template>
    </PlainField>
  </SlotForm>
</template>
