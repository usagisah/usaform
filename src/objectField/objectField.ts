import { inject, onBeforeUnmount, provide } from "vue"
import { useFormActions } from "../actions/hooks"
import { ArrayItemInitParams } from "../arrayField/arrayField.type"
import { useFormArrayItem } from "../arrayField/arrayItem"
import { formContext, FormContext } from "../form/context"
import { FieldName, FieldWrapper } from "../form/field.type"
import { createFieldRender } from "../shared/field"
import { getFieldStructSize, resolveFieldDefaultValue, setProperty } from "../shared/resolve"
import { useFieldValue } from "../shared/useFieldValue"
import { ObjectField, ObjectFieldActions, ObjectFieldInit } from "./objectField.type"

export function useFormObjectField<T = any>(name: FieldName, init: ObjectFieldInit<T>): FieldWrapper<T, ObjectFieldActions, false> {
  const ctx = inject(formContext) as FormContext

  const { field, root, arrayUnwrapKey } = ctx
  if (field.type === "ary") {
    return useFormArrayItem({
      ctx,
      init: p => createObjectField(name, ctx, init, p),
      afterInit: handleFieldUpdate,
      index: name as number
    })
  }

  const { _field } = createObjectField(name, ctx, init)
  field.struct.set(name, _field)
  handleFieldUpdate(_field, ctx, () => {
    field.struct.delete(name)
  })

  return {
    fieldValue: _field.fieldValue,
    actions: useFormActions(_field, root, arrayUnwrapKey),
    FieldRender: createFieldRender(_field.fieldKey, _field.fieldValue)
  }
}

function handleFieldUpdate(_field: ObjectField, ctx: FormContext, clean: Function) {
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
    setProperty(ctx.currentInitValue, name, undefined)
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
    ...useFieldValue(initValue ?? _defaultValue, {}, () => name),
    struct: new Map(),
    parent: ctx.field,
    toJson,
    userConfig: _conf,
    __uform_field: true
  }
  return { _field }
}
