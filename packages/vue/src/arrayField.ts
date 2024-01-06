import { inject, provide, toRaw } from "vue"
import { useFormArrayItem } from "./arrayItem.js"
import { FormContext, GlobalInfo, formContext } from "./context.js"
import { BaseFiled, Field, FieldName, getProperty } from "./form.common.js"
import { FormBaseActions } from "./form.js"

export interface ArrayField extends BaseFiled {
  type: "ary"
  struct: Field[]
  userConfig: Record<any, any>
}

type AddValue = (index: number, e: any) => void
type DelValue = (index: number) => void
type Swap = (i1: number, i2: number) => void

export interface ArrayFieldInitInfo {
  formConfig: Record<string, any>
  initValue: any[]
  addValue: AddValue
  delValue: DelValue
  swap: Swap
}

export interface ArrayFieldConfig<T> {
  bind?: T
  initValue: any[]
  setValue: (v: any) => any
  [x: string]: any
}

export interface ArrayFieldActions extends FormBaseActions {
  addValue: AddValue
  delValue: DelValue
  swap: Swap
}

type ArrayFieldInit<T> = (info: ArrayFieldInitInfo) => ArrayFieldConfig<T>

export function createArrayField(name: FieldName, { formConfig, currentInitValue }: FormContext, init: ArrayFieldInit<any>, rest: Record<string, any> = {}) {
  const _field: ArrayField = { name, type: "ary", struct: [], userConfig: {}, __uform_field: true }
  const _setStruct = () => {
    setValue(_field.struct.map((v: any) => (v.__uform_aryItem_field ? v.__aryValue : v)))
  }
  const addValue: AddValue = (index, e) => {
    e = toRaw(e)
    const { struct } = _field
    if (index >= struct.length) struct.push(e)
    else if (index === -1) struct.unshift(e)
    else struct[index] = e
    _setStruct()
  }
  const delValue: DelValue = index => {
    const { struct } = _field
    if (index >= struct.length) struct.pop()
    else if (index === -1) struct.shift()
    else struct.splice(index, 1)
    _setStruct()
  }
  const swap: Swap = (i1, i2) => {
    const { struct } = _field
    const t = struct[i1]
    struct[i1] = struct[i2]
    struct[i2] = t
    _setStruct()
  }
  const { bind, initValue, setValue, ...config } = init({
    initValue: getProperty(currentInitValue, name),
    ...rest,
    formConfig,
    addValue,
    delValue,
    swap
  })
  _field.struct = [...toRaw(initValue)]
  _field.userConfig = config
  return { _field, _actions: { addValue, delValue, swap }, config, bind }
}
export function useFormArrayField<T>(name: FieldName, init: ArrayFieldInit<T>, params: any = {}): [T, ArrayFieldActions] {
  const ctx: FormContext = inject(formContext)!
  const { field, actions, currentInitValue } = ctx
  if (field.type === "plain") throw GlobalInfo.nullPlainField
  if (field.type === "ary") {
    return useFormArrayItem({
      ctx,
      init: p => createArrayField(name, ctx, init, p),
      params: { index: name, ...params }
    })
  }

  const { _field, _actions, bind } = createArrayField(name, ctx, init)
  field.struct.set(name, _field)

  provide(formContext, { ...ctx, field: _field, currentInitValue: getProperty(currentInitValue, name) } as FormContext)
  return [bind, { ...actions, ..._actions }]
}
