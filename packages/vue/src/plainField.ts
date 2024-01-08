import { Ref, inject, onBeforeUnmount, provide } from "vue"
import { ArrayItemInitParams, useFormArrayItem } from "./arrayItem"
import { FormContext, GlobalInfo, formContext } from "./context"
import { FormBaseActions } from "./form"
import { BaseFiled, FieldName, FormConfig, getProperty, setProperty } from "./form.helper"
import { useFieldValue } from "./useFieldValue"

export interface PlainField extends BaseFiled {
  type: "plain"
  userConfig: Record<any, any>
}

export interface PlainFieldInitInfo {
  initValue: any
  formConfig: FormConfig
}

export interface PlainFieldConfig<T = any> {
  initValue?: T
  [x: string]: any
}

export interface PlainFieldActions extends FormBaseActions {}

type PlainFieldInit<T> = (info: PlainFieldInitInfo) => PlainFieldConfig<T>
export function useFormPlainField<T = any>(name: FieldName, init: PlainFieldInit<T>): [Ref<T>, PlainFieldActions] {
  const ctx: FormContext = inject(formContext)!
  const { field, actions } = ctx

  if (field.type === "plain") throw GlobalInfo.nullPlainField
  if (field.type === "ary") {
    return useFormArrayItem({
      ctx,
      init: p => createPlainField(name, ctx, init, p),
      afterInit: updateField,
      index: name as number
    })
  }

  const { _field } = createPlainField(name, ctx, init)
  field.struct.set(name, _field)
  updateField(_field, ctx)
  return [_field.fieldValue, { ...actions }]
}

function updateField(_field: PlainField, ctx: FormContext) {
  const { name } = _field
  const field: any = ctx.field

  onBeforeUnmount(() => {
    field.struct.delete(name)
    _field.clearSubscribers()
  })
  provide(formContext, null)
}

export function createPlainField(name: FieldName, { formConfig, currentInitValue, defaultValue }: FormContext, init: PlainFieldInit<any>, p?: ArrayItemInitParams) {
  const _defaultValue = p?.initValue ?? getProperty(currentInitValue, name) ?? defaultValue
  const { initValue, ..._conf } = init({ formConfig, initValue: _defaultValue })
  setProperty(currentInitValue, name, null)

  const _field: PlainField = {
    type: "plain",
    name,
    userConfig: _conf,
    __uform_field: true,
    ...useFieldValue(initValue ?? _defaultValue)
  }
  return { _field }
}
