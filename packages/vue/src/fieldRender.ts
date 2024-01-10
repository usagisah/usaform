import { Ref } from "vue"

export function createFieldRender(fieldKey: Ref<number>, fieldValue: Ref<unknown>) {
  let key = fieldKey.value
  return function render(fn: () => any) {
    return function () {
      if (key !== fieldKey.value) {
        key = fieldKey.value
        return fieldValue.value, null
      }
      return fn()
    }
  }
}
