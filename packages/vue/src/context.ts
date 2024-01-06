import { provide } from "vue"
import { Field, FormConfig } from "./form.common.js"
import { FormBaseActions } from "./form.js"

export interface FormContext {
  field: Field

  defaultValue: any
  currentInitValue: any

  arrayItemBindKey: string

  actions: FormBaseActions
  formConfig: FormConfig
}

export const formContext = Symbol()

export const formGlobalContext = Symbol()
export const createGlobalFormProvide = (config: FormConfig) => {
  provide(formGlobalContext, config)
}

export let GlobalInfo = {
  nullPlainField: "非法的 PlainField 嵌套"
}
