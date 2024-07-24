import { inject, onBeforeUnmount, provide } from "vue"
import { ArrayEmptyItem } from "../arrayField/arrayField"
import { formContext, FormContext } from "../form/context"
import { FieldName } from "../form/field.type"
import { getFieldStructSize } from "../shared/resolve"
import { VoidField, VoidFieldInit } from "./voidField.type"

export function useFormVoidField(name: FieldName, init: VoidFieldInit): void {
  const ctx = inject(formContext) as FormContext

  const { field } = ctx
  const { toJson, ...config } = init({ formConfig: ctx.formConfig })
  const voidField: VoidField = {
    type: "void",
    name,
    order: getFieldStructSize(ctx.field),
    userConfig: config,
    parent: field,
    toJson,
    __uform_field: true
  }

  if (field.type === "ary") {
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
