import { provide } from "vue"
import { FormBaseActions } from "./form"
import { Field, FormConfig } from "./form.common"

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
