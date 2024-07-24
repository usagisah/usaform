import { useFormActions } from "./actions/hooks"
import { ArrayEmptyItem, ArrayField } from "./arrayField"
import { FormContext } from "./context"
import { createFieldRender } from "./fieldRender"
import { FieldWrapper, FormField, resolveArrayItem, safeGetProperty } from "./form.helper"

export interface ArrayItemInitParams {
  initValue: any
}

export interface ArrayItemConfig {
  ctx: FormContext
  init: (p: ArrayItemInitParams) => { _field: FormField; _actions?: any }
  afterInit: (_field: any, ctx: FormContext, clean: Function) => any
  index: number
}

export function useFormArrayItem({ ctx, init, afterInit, index }: ArrayItemConfig): FieldWrapper<any, any, any> {
  const { field, root, arrayUnwrapKey } = ctx
  const { struct } = field as ArrayField

  const record: any = struct[index]
  if (safeGetProperty(record, "__uform_field")) throw "array-field 检测到意外的重复，请检测是否进行了错误嵌套"

  const { _field, _actions } = init({ initValue: resolveArrayItem(record, arrayUnwrapKey) })
  _field.__aryValue = record
  _field.__uform_aryItem_field = true
  struct[index] = _field
  afterInit(_field, ctx, () => {
    struct[index] = ArrayEmptyItem as any
  })
  return {
    fieldValue: _field.fieldValue,
    actions: { ...useFormActions(_field, root, arrayUnwrapKey), ..._actions },
    FieldRender: _field.type === "plain" ? null : createFieldRender(_field.fieldKey, _field.fieldValue)
  }
}
