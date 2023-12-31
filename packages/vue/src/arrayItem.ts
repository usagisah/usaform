import { ArrayEmptyItem, ArrayField } from "./arrayField"
import { FormContext } from "./context"
import { Field, FieldWrapper, getProperty } from "./form.helper"

export interface ArrayItemInitParams {
  initValue: any
}

export interface ArrayItemConfig {
  ctx: FormContext
  init: (p: ArrayItemInitParams) => { _field: Field; _actions?: any }
  afterInit: (_field: any, ctx: FormContext, clean: Function) => any
  index: number
}

export function useFormArrayItem({ ctx, init, afterInit, index }: ArrayItemConfig): FieldWrapper<any, any> {
  const { field, actions } = ctx
  const { struct } = field as ArrayField

  const record: any = struct[index]
  if (getProperty(record, "__uform_field", false)) throw "array-field 检测到意外的重复，请检测是否进行了错误嵌套"

  const { _field, _actions } = init({
    initValue: getProperty(record, "value", false) ?? getProperty(record, "children", false)
  })
  _field.__aryValue = record
  _field.__uform_aryItem_field = true
  struct[index] = _field
  afterInit(_field, ctx, () => {
    struct[index] = ArrayEmptyItem as any
  })
  if (!_field.fieldValue.value) console.log(_field.fieldValue.value)
  return { fieldValue: _field.fieldValue, fieldKey: _field.fieldKey, actions: { ...actions, ..._actions } }
}
