<script lang="ts" setup>
import { useFormPlainField } from "@usaform/element-plus"
import { ElMessage, ElTable, ElTableColumn } from "element-plus"
import { onMounted } from "vue"
import { faker } from "@faker-js/faker"

const mockData = () => {
  data.value = new Array(10).fill(0).map(() => {
    return {
      id: faker.number.hex({ min: 5000000, max: 90000000 }),
      name: faker.music.songName(),
      date: faker.date.anytime(),
      address: faker.location.country() + "-" + faker.location.city()
    }
  })
  ElMessage.success({ message: "请求数据(mock)" })
}

const { fieldValue: data, actions } = useFormPlainField("table", () => {
  return { initValue: [] as any[] }
})
onMounted(() => {
  mockData()

  actions.subscribe("../search", value => {
    console.log("research", value)
    mockData()
  })
  actions.subscribe("../footer", value => {
    console.log("research", value)
    mockData()
  })
})
</script>

<template>
  <ElTable :data="data">
    <el-table-column prop="id" label="ID" width="180" />
    <el-table-column prop="name" label="Name" align="center" />
    <el-table-column prop="date" label="Date" align="center" />
    <el-table-column prop="address" label="Address" align="center" />
  </ElTable>
</template>

<style lang="scss" scoped></style>
