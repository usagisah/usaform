import { inject, onBeforeUnmount, provide, toRaw } from "vue"
import { useFormActions } from "../actions/hooks"
import { formContext, FormContext } from "../form/context"
import { Field, FieldName, FieldWrapper } from "../form/field.type"
import { createFieldRender } from "../shared/fieldRender"
import { getFieldStructSize, resolveFieldDefaultValue, safeGetProperty, setProperty } from "../shared/resolve"
import { useFieldValue } from "../shared/useFieldValue"
import {
  ArrayActionDelValue,
  ArrayActionPop,
  ArrayActionPush,
  ArrayActionSetValue,
  ArrayActionShift,
  ArrayActionSwap,
  ArrayActionUnshift,
  ArrayField,
  ArrayFieldActions,
  ArrayFieldInit,
  ArrayItemInitParams
} from "./arrayField.type"
import { useFormArrayItem } from "./arrayItem"

export const ArrayEmptyItem = Symbol()

export function useFormArrayField<T = any>(name: FieldName, init: ArrayFieldInit<T>): FieldWrapper<T[], ArrayFieldActions, false> {
  const ctx = inject(formContext) as FormContext

  const { field, root, arrayUnwrapKey } = ctx
  if (field.type === "ary") {
    return useFormArrayItem({
      ctx,
      init: p => createArrayField(name, ctx, init, p),
      afterInit: handleFieldUpdate,
      index: name as number
    })
  }

  const { _field, _actions } = createArrayField(name, ctx, init)
  field.struct.set(name, _field)
  handleFieldUpdate(_field, ctx, () => {
    field.struct.delete(name)
  })

  return {
    fieldValue: _field.fieldValue,
    actions: { ...useFormActions(_field, root, arrayUnwrapKey), ..._actions },
    FieldRender: createFieldRender(_field.fieldKey, _field.fieldValue)
  }
}

function handleFieldUpdate(_field: ArrayField, ctx: FormContext, clean: Function) {
  const { name } = _field
  const provideContext: FormContext = { ...ctx, field: _field, currentInitValue: [..._field.getter()] }
  provide(formContext, provideContext)

  _field.subscribe(() => {
    if (_field.setting) {
      _field.setting = false
      return 
    }
    // ???
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

  const _setStruct = () => {
    const _fieldStruct: Field[] = []
    const _fieldValue: any[] = []
    for (const item of _field.struct) {
      if ((item as any) === ArrayEmptyItem) continue
      _fieldStruct.push(item)
      _fieldValue.push(safeGetProperty(item, "__uform_aryItem_field") ? (item as any).__aryValue : item)
    }
    _field.setting = true
    _field.struct = _fieldStruct
    _field.fieldValue.value = _fieldValue
  }

  const setValue: ArrayActionSetValue = (index, e) => {
    e = toRaw(e)
    const { struct } = _field
    if (index >= struct.length) struct.push(e)
    else if (index < 0) struct.unshift(e)
    else struct[index] = e
    _setStruct()
  }

  const delValue: ArrayActionDelValue = index => {
    const { struct } = _field
    if (index >= struct.length) struct.pop()
    else if (index === -1) struct.shift()
    else struct.splice(index, 1)
    _setStruct()
  }

  const clear = () => {
    const { struct } = _field
    struct.length = 0
    _setStruct()
  }

  const swap: ArrayActionSwap = (i1, i2) => {
    const { struct } = _field
    if (i1 < 0 || i2 >= struct.length) {
      return console.error("arrayField.swap 要交换的下标越界")
    }
    const t = struct[i1]
    struct[i1] = struct[i2]
    struct[i2] = t
    _setStruct()
  }

  const pop: ArrayActionPop = () => delValue(_field.fieldValue.value.length)

  const shift: ArrayActionShift = () => delValue(-1)

  const push: ArrayActionPush = (e: any) => {
    setValue(_field.fieldValue.value.length, e)
  }

  const unshift: ArrayActionUnshift = (e: any) => setValue(-1, e)

  const _arrayActions = { setValue, delValue, swap, pop, shift, push, unshift, clear }

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
    ...useFieldValue([...(initValue ?? _defaultValue ?? [])], _arrayActions, () => name)
  }

  return { _field, _actions: _arrayActions }
}
