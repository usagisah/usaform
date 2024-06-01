import { inject, onBeforeUnmount, provide } from "vue"
import { ArrayEmptyItem } from "./arrayField"
import { FormContext, GlobalInfo, formContext } from "./context"
import { BaseFiled, FieldName, getFieldStructSize } from "./form.helper"

export interface VoidField extends BaseFiled {
  type: "void"
  userConfig: Record<any, any>
}

export function useFormVoidField(name: FieldName, userConfig: Record<any, any>): void {
  const ctx = inject<FormContext>(formContext)
  if (!ctx) throw GlobalInfo.invalidField

  const { field } = ctx
  const voidField: VoidField = { type: "void", name, order: getFieldStructSize(ctx.field), userConfig, parent: field, __uform_field: true }
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
