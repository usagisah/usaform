import { onBeforeUnmount, provide } from "vue"
import { ArrayEmptyItem, ArrayField } from "./arrayField.js"
import { FormContext, formContext } from "./context.js"
import { Field, getProperty, setProperty } from "./form.common.js"

export interface ArrayItemParams {
  index: number
}

export interface ArrayItemConfig {
  ctx: FormContext
  init: (p: { initValue: any; setValue: (v: any) => any }) => { _field: Field; _actions?: any; bind: any }
  params: ArrayItemParams
}

type ArrayItemField = Field & {
  __aryValue: any
  __uform_aryItem_field: boolean
}

export function useFormArrayItem({ ctx, init, params }: ArrayItemConfig): [any, any] {
  const { field, actions, currentInitValue, arrayItemBindKey } = ctx
  const { struct } = field as ArrayField
  const { index } = params
  let aryItem: ArrayItemField | Field = struct[index]
  if (aryItem.__uform_field) throw "array-field 检测到意外的重复，请检测是否进行了错误嵌套"
  const {
    bind,
    _field,
    _actions = {}
  } = init({
    initValue: (aryItem as any)[arrayItemBindKey],
    setValue: v => ((aryItem as ArrayItemField).__aryValue[arrayItemBindKey] = v)
  })
  Object.defineProperties(_field, {
    __aryValue: { value: aryItem, enumerable: true },
    __uform_aryItem_field: { value: true, enumerable: true }
  })

  struct[index] = aryItem = _field
  provide(
    formContext,
    aryItem.type === "plain"
      ? null
      : ({
          ...ctx,
          field: aryItem,
          currentInitValue: getProperty(currentInitValue, index)
        } as FormContext)
  )
  setProperty(currentInitValue, index, null)
  onBeforeUnmount(() => {
    setProperty(currentInitValue, index, ArrayEmptyItem)
  })
  return [bind, { ...actions, ..._actions }]
}
