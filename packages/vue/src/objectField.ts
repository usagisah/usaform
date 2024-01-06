import { inject, provide } from "vue"
import { useFormArrayItem } from "./arrayItem.js"
import { FormContext, GlobalInfo, formContext } from "./context.js"
import { BaseFiled, Field, FieldName, getProperty } from "./form.common.js"
import { FormBaseActions } from "./form.js"

export interface ObjectField extends BaseFiled {
  type: "object"
  struct: Map<FieldName, Field>
  userConfig: Record<any, any>
}

export interface ObjectFieldInitInfo {
  formConfig: Record<string, any>
}

export interface ObjectFieldConfig<T> {
  bind?: T
  [x: string]: any
}

export interface ObjectFieldActions extends FormBaseActions {}

type ObjectFieldInit<T> = (info: ObjectFieldInitInfo) => ObjectFieldConfig<T>

export function createObjectField(name: FieldName, { formConfig }: FormContext, init: ObjectFieldInit<any>, rest: Record<string, any> = {}) {
  const { bind, ...config } = init({ ...rest, formConfig })
  const _field: ObjectField = { name, type: "object", struct: new Map(), userConfig: config, __uform_field: true }
  return { _field, config, bind }
}
export function useFormObjectFiled<T>(name: FieldName, init: ObjectFieldInit<T>, params: any = {}): [T, ObjectFieldActions] {
  const ctx: FormContext = inject(formContext)!
  const { field, actions, currentInitValue } = ctx
  if (field.type === "plain") throw GlobalInfo.nullPlainField
  if (field.type === "ary") return useFormArrayItem({ ctx, init: p => createObjectField(name, ctx, init, p), params: { index: name, ...params } })

  const { _field, bind } = createObjectField(name, ctx, init)
  field.struct.set(name, _field)
  provide(formContext, { ...ctx, field: _field, currentInitValue: getProperty(currentInitValue, name) } as FormContext)
  return [bind, actions]
}
