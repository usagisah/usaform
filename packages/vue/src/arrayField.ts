import { inject, onBeforeUnmount, provide, toRaw } from "vue"
import { FormBaseActions, useFormActions } from "./actions/hooks"
import { ArrayItemInitParams, useFormArrayItem } from "./arrayItem"
import { FormContext, GlobalInfo, formContext } from "./context"
import { createFieldRender } from "./fieldRender"
import { BaseFiled, Field, FieldName, FieldToJson, FieldWrapper, FormConfig, getFieldStructSize, resolveFieldDefaultValue, safeGetProperty, setProperty } from "./form.helper"
import { FieldValue, useFieldValue } from "./useFieldValue"

export interface ArrayField extends BaseFiled, FieldValue {
  type: "ary"
  struct: Field[]
  setting: boolean
  userConfig: Record<any, any>
}

type SetValue = (index: number, e: any) => void
type DelValue = (index: number) => void
type Swap = (i1: number, i2: number) => void
export const ArrayEmptyItem = Symbol()

export interface ArrayFieldInitInfo {
  initValue: any[]
  formConfig: FormConfig
}

export interface ArrayFieldConfig<T = any> {
  initValue?: T[]
  toJson?: FieldToJson
  [x: string]: any
}

export interface ArrayFieldActions extends FormBaseActions {
  setValue: SetValue
  delValue: DelValue
  swap: Swap
}

type ArrayFieldInit<T> = (info: ArrayFieldInitInfo) => ArrayFieldConfig<T>

export function useFormArrayField<T = any>(name: FieldName, init: ArrayFieldInit<T>): FieldWrapper<T[], ArrayFieldActions, false> {
  const ctx = inject<FormContext>(formContext)
  if (!ctx) throw GlobalInfo.invalidField

  const { field, root, arrayUnwrapKey } = ctx
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

  return {
    fieldValue: _field.fieldValue,
    actions: { ...useFormActions(_field, root, arrayUnwrapKey), ..._actions },
    FieldRender: createFieldRender(_field.fieldKey, _field.fieldValue)
  }
}

function updateField(_field: ArrayField, ctx: FormContext, clean: Function) {
  const { name } = _field
  const provideContext: FormContext = { ...ctx, field: _field, currentInitValue: [..._field.getter()] }
  provide(formContext, provideContext)

  _field.subscribe(() => {
    if (_field.setting) return (_field.setting = false)
    _field.struct = _field.fieldValue.value.map((item: Field) => {
      return safeGetProperty(item, "__uform_aryItem_field") ? (item as any).__aryValue : item
    })
    provideContext.currentInitValue = [..._field.getter()]
  })
  onBeforeUnmount(() => {
    _field.struct = []
    _field.clearSubscribers()
    setProperty(ctx.currentInitValue, name, null)
    clean()
  })
}

export function createArrayField(name: FieldName, ctx: FormContext, init: ArrayFieldInit<any>, p?: ArrayItemInitParams) {
  const _defaultValue = resolveFieldDefaultValue(name, ctx, p)
  const { initValue, toJson, ..._conf } = init({ formConfig: ctx.formConfig, initValue: _defaultValue })
  const _field: ArrayField = {
    type: "ary",
    name,
    order: getFieldStructSize(ctx.field),
    struct: toRaw([...(initValue ?? _defaultValue ?? [])]),
    setting: false,
    userConfig: _conf,
    parent: ctx.field,
    toJson,
    __uform_field: true,
    ...useFieldValue([...(initValue ?? _defaultValue ?? [])])
  }
  const _setStruct = () => {
    const _fieldStruct: Field[] = []
    const _fieldValue: any[] = []
    for (const item of _field.struct) {
      if ((item as any) === ArrayEmptyItem) return
      _fieldStruct.push(item)
      _fieldValue.push(safeGetProperty(item, "__uform_aryItem_field") ? (item as any).__aryValue : item)
    }
    _field.setting = true
    _field.struct = _fieldStruct
    _field.fieldValue.value = _fieldValue
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
    if (i1 < 0 || i2 >= struct.length) {
      return console.error("arrayField.swap 要交换的下标越界")
    }
    const t = struct[i1]
    struct[i1] = struct[i2]
    struct[i2] = t
    _setStruct()
  }
  return { _field, _actions: { setValue, delValue, swap } }
}
