import { inject, onBeforeUnmount, provide } from "vue"
import { FormBaseActions, useFormActions } from "./actions/hooks"
import { ArrayItemInitParams, useFormArrayItem } from "./arrayItem"
import { FormContext, GlobalInfo, formContext } from "./context"
import { BaseFiled, FieldName, FieldWrapper, FormConfig, resolveFieldDefaultValue, setProperty } from "./form.helper"
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
export function useFormPlainField<T = any>(name: FieldName, init: PlainFieldInit<T>): FieldWrapper<T, PlainFieldActions> {
  const ctx: FormContext = inject(formContext)!
  const { field, root } = ctx

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
  updateField(_field, ctx, () => {
    field.struct.delete(name)
  })
  return { fieldValue: _field.fieldValue, fieldKey: _field.fieldKey, actions: useFormActions(_field, root) }
}

function updateField(_field: PlainField, { currentInitValue }: FormContext, clean: Function) {
  provide(formContext, null)
  onBeforeUnmount(() => {
    _field.clearSubscribers()
    setProperty(currentInitValue, _field.name, null)
    clean()
  })
}

export function createPlainField(name: FieldName, ctx: FormContext, init: PlainFieldInit<any>, p?: ArrayItemInitParams) {
  const _defaultValue = resolveFieldDefaultValue(name, ctx, p)
  const { initValue, ..._conf } = init({ formConfig: ctx.formConfig, initValue: _defaultValue })
  const _field: PlainField = {
    type: "plain",
    name,
    userConfig: _conf,
    __uform_field: true,
    parent: ctx.field,
    ...useFieldValue(initValue ?? _defaultValue)
  }
  return { _field }
}
