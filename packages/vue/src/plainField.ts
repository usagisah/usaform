import { inject, onBeforeUnmount, provide } from "vue"
import { FormBaseActions, useFormActions } from "./actions/hooks"
import { ArrayItemInitParams, useFormArrayItem } from "./arrayItem"
import { FormContext, GlobalInfo, formContext } from "./context"
import { BaseFiled, FieldName, FieldToJson, FieldWrapper, FormConfig, getFieldStructSize, resolveFieldDefaultValue, setProperty } from "./form.helper"
import { FieldValue, useFieldValue } from "./useFieldValue"

export interface PlainField extends BaseFiled, FieldValue {
  type: "plain"
  userConfig: Record<any, any>
}

export interface PlainFieldInitInfo {
  initValue: any
  formConfig: FormConfig
}

export interface PlainFieldConfig<T = any> {
  initValue?: T
  toJson?: FieldToJson
  [x: string]: any
}

export interface PlainFieldActions extends FormBaseActions {}

type PlainFieldInit<T> = (info: PlainFieldInitInfo) => PlainFieldConfig<T>
export function useFormPlainField<T = any>(name: FieldName, init: PlainFieldInit<T>): FieldWrapper<T, PlainFieldActions, true> {
  const ctx = inject<FormContext>(formContext)
  if (!ctx) throw GlobalInfo.invalidField

  const { field, root, arrayUnwrapKey } = ctx
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
  return {
    fieldValue: _field.fieldValue,
    actions: useFormActions(_field, root, arrayUnwrapKey),
    FieldRender: null
  }
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
  const { initValue, toJson, ..._conf } = init({ formConfig: ctx.formConfig, initValue: _defaultValue })
  const _field: PlainField = {
    type: "plain",
    name,
    order: getFieldStructSize(ctx.field),
    userConfig: _conf,
    toJson,
    __uform_field: true,
    parent: ctx.field,
    ...useFieldValue(initValue ?? _defaultValue, {}, () => name)
  }
  return { _field }
}
