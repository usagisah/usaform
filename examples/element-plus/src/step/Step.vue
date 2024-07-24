<script lang="ts" setup>
import { ref } from "vue"
import { ElButton, ElCard, ElDivider, ElInput, ElSpace, ElStep, ElSteps } from "element-plus"
import { createForm, PlainField } from "@usaform/element-plus"

const active = ref(1)
const next = () => active.value++

const [Form, form] = createForm()
const submit = () => console.log(form.value?.getFormData())
</script>

<template>
  <ElCard title="分步表单" style="width: 1000px">
    <el-steps :active="active" align-center>
      <el-step title="Step 1" />
      <el-step title="Step 2" />
      <el-step title="Step 3" />
    </el-steps>

    <Form ref="form">
      <PlainField name="step 1">
        <template #default="{ bind }">
          <ElInput v-bind="bind" v-show="active === 1"></ElInput>
        </template>
      </PlainField>
      <PlainField name="step 2">
        <template #default="{ bind }">
          <ElInput v-bind="bind" v-show="active === 2"></ElInput>
        </template>
      </PlainField>
      <PlainField name="step 3">
        <template #default="{ bind }">
          <ElInput v-bind="bind" v-show="active === 3"></ElInput>
        </template>
      </PlainField>
    </Form>

    <ElDivider />
    <ElSpace>
      <template v-if="active < 3">
        <ElButton @click="next">下一步</ElButton>
      </template>
      <template v-else>
        <ElButton @click="submit">submit</ElButton>
        <ElButton @click="active = 1">回到第一步</ElButton>
      </template>
    </ElSpace>
  </ElCard>
</template>

<style lang="scss" scoped></style>
