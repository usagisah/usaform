import { inject, onBeforeUnmount, provide } from "vue"
import { FormBaseActions, useFormActions } from "./actions/hooks"
import { ArrayItemInitParams, useFormArrayItem } from "./arrayItem"
import { FormContext, GlobalInfo, formContext } from "./context"
import { createFieldRender } from "./fieldRender"
import { BaseFiled, Field, FieldName, FieldToJson, FieldWrapper, FormConfig, getFieldStructSize, resolveFieldDefaultValue, setProperty } from "./form.helper"
import { FieldValue, useFieldValue } from "./useFieldValue"

export interface ObjectField extends BaseFiled, FieldValue {
  type: "object"
  struct: Map<FieldName, Field>
  userConfig: Record<any, any>
}

export interface ObjectFieldInitInfo {
  initValue: any
  formConfig: FormConfig
}

export interface ObjectFieldConfig<T = any> {
  initValue?: T
  toJson?: FieldToJson
  [x: string]: any
}

export interface ObjectFieldActions extends FormBaseActions {}

type ObjectFieldInit<T> = (info: ObjectFieldInitInfo) => ObjectFieldConfig<T>

export function useFormObjectField<T = any>(name: FieldName, init: ObjectFieldInit<T>): FieldWrapper<T, ObjectFieldActions, false> {
  const ctx = inject<FormContext>(formContext)
  if (!ctx) throw GlobalInfo.invalidField

  const { field, root, arrayUnwrapKey } = ctx
  if (field.type === "ary") {
    return useFormArrayItem({
      ctx,
      init: p => createObjectField(name, ctx, init, p),
      afterInit: updateField,
      index: name as number
    })
  }

  const { _field } = createObjectField(name, ctx, init)
  field.struct.set(name, _field)
  updateField(_field, ctx, () => {
    field.struct.delete(name)
  })

  return {
    fieldValue: _field.fieldValue,
    actions: useFormActions(_field, root, arrayUnwrapKey),
    FieldRender: createFieldRender(_field.fieldKey, _field.fieldValue)
  }
}

function updateField(_field: ObjectField, ctx: FormContext, clean: Function) {
  const { name } = _field
  const provideContext: FormContext = { ...ctx, field: _field, currentInitValue: { ..._field.getter() } }
  provide(formContext, provideContext)

  _field.subscribe(() => {
    _field.struct.clear()
    provideContext.currentInitValue = { ..._field.getter() }
  })
  onBeforeUnmount(() => {
    _field.struct.clear()
    _field.clearSubscribers()
    setProperty(ctx.currentInitValue, name, null)
    clean()
  })
}

export function createObjectField(name: FieldName, ctx: FormContext, init: ObjectFieldInit<any>, p?: ArrayItemInitParams) {
  const _defaultValue = resolveFieldDefaultValue(name, ctx, p)
  const { initValue, toJson, ..._conf } = init({ formConfig: ctx.formConfig, initValue: _defaultValue })
  const _field: ObjectField = {
    type: "object",
    name,
    order: getFieldStructSize(ctx.field),
    struct: new Map(),
    userConfig: _conf,
    parent: ctx.field,
    toJson,
    __uform_field: true,
    ...useFieldValue(initValue ?? _defaultValue)
  }
  return { _field }
}
