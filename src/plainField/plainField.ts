import { inject, onBeforeUnmount, provide } from "vue"
import { useFormActions } from "../actions/hooks"
import { ArrayItemInitParams } from "../arrayField/arrayField.type"
import { useFormArrayItem } from "../arrayField/arrayItem"
import { FormContext, formContext } from "../form/context"
import { FieldName, FieldWrapper } from "../form/field.type"
import { getFieldStructSize, resolveFieldDefaultValue, setProperty } from "../shared/resolve"
import { useFieldValue } from "../shared/useFieldValue"
import { PlainField, PlainFieldActions, PlainFieldInit } from "./plainField.type"

export function useFormPlainField<T = unknown>(name: FieldName, init: PlainFieldInit<T>): FieldWrapper<T, PlainFieldActions, true> {
  const ctx = inject(formContext) as FormContext

  const { field, root, arrayUnwrapKey } = ctx
  if (field.type === "ary") {
    return useFormArrayItem({
      ctx,
      init: p => createPlainField(name, ctx, init, p),
      afterInit: handleFieldUpdate,
      index: name as number
    })
  }

  const { _field } = createPlainField(name, ctx, init)
  field.struct.set(name, _field)
  handleFieldUpdate(_field, ctx, () => {
    field.struct.delete(name)
  })

  return {
    fieldValue: _field.fieldValue,
    actions: useFormActions(_field, root, arrayUnwrapKey),
    FieldRender: null
  }
}

function handleFieldUpdate(_field: PlainField, { currentInitValue }: FormContext, clean: Function) {
  provide(formContext, null)
  onBeforeUnmount(() => {
    _field.clearSubscribers()
    setProperty(currentInitValue, _field.name, undefined)
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
    ...useFieldValue(initValue ?? _defaultValue, {}, () => name),
    parent: ctx.field,
    toJson,
    userConfig: _conf,
    __uform_field: true
  }
  return { _field }
}
