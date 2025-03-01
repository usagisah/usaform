<script lang="ts" setup>
import { createForm, ObjectField, PlainField } from "@shoroi/form"
import { ElInput } from "element-plus"
import { nextTick, ref } from "vue"
import ObjectFieldComponent from "./components/ObjectFieldComponent.vue"

const [SlotForm, SlotFormActions] = createForm({ config: { Elements: { ObjectFieldComponent } } })
const conditionKeys = ref(["o1", "o2", "o3"])
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
    <ObjectField key="o1" element="ObjectFieldComponent" v-if="conditionKeys.includes('o1')">
      <PlainField key="f1">
        <template #default="{ bind }">
          <ElInput v-bind="bind" class="o1" />
        </template>
      </PlainField>
    </ObjectField>

    <ObjectField key="o2" element="ObjectFieldComponent" v-if="conditionKeys.includes('o2')">
      <PlainField key="f2">
        <template #default="{ bind }">
          <ElInput v-bind="bind" class="o1" />
        </template>
      </PlainField>
    </ObjectField>

    <ObjectField key="o3" element="ObjectFieldComponent" v-if="conditionKeys.includes('o3')">
      <PlainField key="f3">
        <template #default="{ bind }">
          <ElInput v-bind="bind" class="o3" />
        </template>
      </PlainField>
    </ObjectField>
  </SlotForm>
</template>
