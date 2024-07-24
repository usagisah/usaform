import { inject, onBeforeUnmount, provide } from "vue"
import { ArrayEmptyItem } from "./arrayField"
import { FormContext, GlobalInfo, formContext } from "./context"
import { BaseFiled, FieldName, FieldToJson, FormConfig, getFieldStructSize } from "./form.helper"

export interface VoidField extends BaseFiled {
  type: "void"
  userConfig: Record<any, any>
}

export interface VoidFieldInitInfo {
  formConfig: FormConfig
}

export interface VoidFieldConfig {
  toJson?: FieldToJson
  [x: string]: any
}
type VoidFieldInit = (info: VoidFieldInitInfo) => VoidFieldConfig

export function useFormVoidField(name: FieldName, init: VoidFieldInit): void {
  const ctx = inject<FormContext>(formContext)
  if (!ctx) throw GlobalInfo.invalidField

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
