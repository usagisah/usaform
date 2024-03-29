export type { Field, FieldName, FormConfig } from "./form.helper"

export { useForm } from "./form"
export type { FormActions } from "./form"

export { useFormPlainField } from "./plainField"
export type { PlainField, PlainFieldActions, PlainFieldConfig, PlainFieldInitInfo } from "./plainField"

export { useFormObjectField } from "./objectField"
export type { ObjectField, ObjectFieldActions, ObjectFieldConfig, ObjectFieldInitInfo } from "./objectField"

export { useFormArrayField } from "./arrayField"
export type { ArrayField, ArrayFieldActions, ArrayFieldConfig, ArrayFieldInitInfo } from "./arrayField"

export type { FormActionCallConfig, FormActionCallInfo, FormActionGetConfig } from "./actions/hooks"

export { createGlobalFormProvide } from "./context"

import { getCurrentInstance, nextTick, onBeforeUnmount } from "vue"
export function onNextTick(fn: () => any) {
  const ins = getCurrentInstance()
  nextTick(() => {
    const f = fn()
    if (typeof f === "function") {
      onBeforeUnmount(f, ins)
    }
  })
}
