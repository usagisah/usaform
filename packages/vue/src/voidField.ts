import { inject, onBeforeUnmount, provide } from "vue"
import { ArrayEmptyItem } from "./arrayField"
import { FormContext, GlobalInfo, formContext } from "./context"
import { FieldName, NestField } from "./form.helper"

export interface VoidField {
  type: "void"
  name: FieldName
  userConfig: Record<any, any>
  parent: NestField
  __uform_field: boolean
}

export function useFormVoidField(name: FieldName, userConfig: Record<any, any>): void {
  const ctx = inject<FormContext>(formContext)
  if (!ctx) throw GlobalInfo.invalidField

  const { field } = ctx
  const voidField: VoidField = { type: "void", name, userConfig, parent: field, __uform_field: true }
  if (field.type === "ary") {
    if (typeof name !== "number") throw GlobalInfo.nullVoidFieldIndex
    field.struct[name] = voidField
    onBeforeUnmount(() => {
      field.struct[name] = ArrayEmptyItem as any
    })
  } else {
    field.struct.set(name, voidField)
    onBeforeUnmount(() => {
      field.struct.delete(name)
    })
  }
  provide(formContext, null)
}
