import { defineComponent, markRaw } from "vue"

export const VueLabelComponent = markRaw(
  defineComponent({
    setup() {
      return () => <label>Vue组件标题</label>
    }
  })
)

export const FunLabelComponent = markRaw(function () {
  return <label>函数组件标题</label>
})
