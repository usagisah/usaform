import { Ref, inject, onBeforeUnmount, provide, toRaw } from "vue"
import { ArrayItemInitParams, useFormArrayItem } from "./arrayItem"
import { FormContext, GlobalInfo, formContext } from "./context"
import { FormBaseActions } from "./form"
import { BaseFiled, Field, FieldName, getProperty, setProperty } from "./form.helper"
import { useFieldValue } from "./useFieldValue"

export interface ArrayField extends BaseFiled {
  type: "ary"
  struct: Field[]
  userConfig: Record<any, any>
}

type SetValue = (index: number, e: any) => void
type DelValue = (index: number) => void
type Swap = (i1: number, i2: number) => void
export const ArrayEmptyItem = Symbol()

export interface ArrayFieldInitInfo {
  initValue: any[]
  formConfig: Record<string, any>
}

export interface ArrayFieldConfig<T = any> {
  initValue?: T[]
  [x: string]: any
}

export interface ArrayFieldActions extends FormBaseActions {
  setValue: SetValue
  delValue: DelValue
  swap: Swap
}

type ArrayFieldInit<T> = (info: ArrayFieldInitInfo) => ArrayFieldConfig<T>

export function useFormArrayField<T = any>(name: FieldName, init: ArrayFieldInit<T>): [Ref<T[]>, ArrayFieldActions] {
  const ctx: FormContext = inject(formContext)!
  const { field, actions } = ctx
  if (field.type === "plain") throw GlobalInfo.nullPlainField
  if (field.type === "ary") {
    return useFormArrayItem({
      ctx,
      init: p => createArrayField(name, ctx, init, p),
      afterInit: updateField,
      index: name as number
    })
  }

  const { _field, _actions } = createArrayField(name, ctx, init)
  field.struct.set(name, _field)
  updateField(_field, ctx, () => {
    field.struct.delete(name)
  })

  return [_field.fieldValue, { ...actions, ..._actions }]
}

function updateField(_field: ArrayField, ctx: FormContext, clean: Function) {
  const { name } = _field
  const provideContext: FormContext = { ...ctx, field: _field, currentInitValue: _field.getter() }
  provide(formContext, provideContext)
  setProperty(ctx.currentInitValue, name, null)

  _field.subscribe(() => {
    _field.struct = _field.fieldValue.value.map((item: Field) => {
      return item.__uform_aryItem_field ? item.__aryValue : item
    })
    provideContext.currentInitValue = _field.getter()
  }, true)
  onBeforeUnmount(() => {
    _field.struct = []
    _field.clearSubscribers()
    clean()
  })
}

export function createArrayField(name: FieldName, { formConfig, currentInitValue, defaultValue }: FormContext, init: ArrayFieldInit<any>, p?: ArrayItemInitParams) {
  const _defaultValue = p?.initValue ?? getProperty(currentInitValue, name) ?? defaultValue
  const { initValue, ..._conf } = init({
    initValue: getProperty(currentInitValue, name),
    formConfig
  })
  const _field: ArrayField = {
    type: "ary",
    name,
    struct: toRaw([...(initValue ?? _defaultValue ?? [])]),
    userConfig: _conf,
    __uform_field: true,
    ...useFieldValue([...(initValue ?? _defaultValue ?? [])])
  }
  const _setStruct = () => {
    const _fieldStruct: Field[] = []
    const _fieldValue: any[] = []
    for (const item of _field.struct) {
      if ((item as any) === ArrayEmptyItem) return
      _fieldStruct.push(item)
      _fieldValue.push(item.__uform_aryItem_field ? item.__aryValue : item)
    }
    _field.struct = _fieldStruct
    _field.setter(_fieldValue)
  }
  const setValue: SetValue = (index, e) => {
    e = toRaw(e)
    const { struct } = _field
    if (index >= struct.length) struct.push(e)
    else if (index < 0) struct.unshift(e)
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
  return { _field, _actions: { setValue, delValue, swap } }
}
