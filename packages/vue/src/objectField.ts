import { Ref, inject, onBeforeUnmount, provide } from "vue"
import { ArrayItemInitParams, useFormArrayItem } from "./arrayItem"
import { FormContext, GlobalInfo, formContext } from "./context"
import { FormBaseActions } from "./form"
import { BaseFiled, Field, FieldName, getProperty, setProperty } from "./form.helper"
import { useFieldValue } from "./useFieldValue"

export interface ObjectField extends BaseFiled {
  type: "object"
  struct: Map<FieldName, Field>
  userConfig: Record<any, any>
}

export interface ObjectFieldInitInfo {
  initValue: any
  formConfig: Record<string, any>
}

export interface ObjectFieldConfig<T = any> {
  initValue?: T
  [x: string]: any
}

export interface ObjectFieldActions extends FormBaseActions {}

type ObjectFieldInit<T> = (info: ObjectFieldInitInfo) => ObjectFieldConfig<T>

export function useFormObjectFiled<T = any>(name: FieldName, init: ObjectFieldInit<T>): [Ref<T>, ObjectFieldActions] {
  const ctx: FormContext = inject(formContext)!
  const { field, actions } = ctx
  if (field.type === "plain") throw GlobalInfo.nullPlainField
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

  return [_field.fieldValue, { ...actions }]
}

function updateField(_field: ObjectField, ctx: FormContext, clean: Function) {
  const { name } = _field
  const provideContext: FormContext = { ...ctx, field: _field, currentInitValue: _field.getter() }
  provide(formContext, provideContext)
  setProperty(ctx.currentInitValue, name, null)

  _field.subscribe(() => {
    _field.struct.clear()
    provideContext.currentInitValue = _field.getter()
  }, true)
  onBeforeUnmount(() => {
    _field.struct.clear()
    _field.clearSubscribers()
    clean()
  })
}

export function createObjectField(name: FieldName, { currentInitValue, formConfig, defaultValue }: FormContext, init: ObjectFieldInit<any>, p?: ArrayItemInitParams) {
  const _defaultValue = p?.initValue ?? getProperty(currentInitValue, name) ?? defaultValue
  const { initValue, ..._conf } = init({ formConfig, initValue: _defaultValue })
  const _field: ObjectField = {
    type: "object",
    name,
    struct: new Map(),
    userConfig: _conf,
    __uform_field: true,
    ...useFieldValue(initValue ?? _defaultValue)
  }
  return { _field }
}
