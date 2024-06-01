import { FormActions, FormConfig, useForm, RootField } from "@usaform/vue"
import { RuleItem } from "async-validator"
import { App, defineComponent, hasInjectionContext, inject, provide, toRaw } from "vue"

export interface CFormRuleItem extends RuleItem {
  trigger?: "change" | "blur"
}

export interface CFormConfig extends FormConfig {
  Elements?: Record<any, any>
  Rules?: Record<any, CFormRuleItem>
  layoutProps?: Record<any, any>
}

export interface CFormProps {
  config?: CFormConfig
}

export interface CFormValidateError {
  path: string
  field: string
  message: string
}

export interface CFormExpose extends FormActions {
  validate: () => Promise<CFormValidateError[]>
  reset: () => void
  callLayout: (path: string, key: string, ...params: any[]) => Record<string, any>
  callElement: (path: string, key: string, ...params: any[]) => Record<string, any>
  field: RootField
}

export const Form = defineComponent({
  name: "Form",
  props: ["config"],
  setup(props: CFormProps, { slots, expose }) {
    const config = normalizeFormConfig(props.config ?? {})
    const { actions, FieldRender, field } = useForm(config)
    actions.provide()

    const validate: CFormExpose["validate"] = async () => {
      const res = actions.call("all", "validate", { fieldTypes: ["plain"] })
      const ps: Promise<any>[] = []
      const errs: CFormValidateError[] = []
      for (const path in res) {
        const p = res[path]
        if (p instanceof Promise) {
          const _p = p.catch(errors => {
            errors.forEach((e: any) => {
              errs.push({ field: e.field, message: e.message, path })
            })
          })
          ps.push(_p)
        }
      }
      await Promise.all(ps)
      return errs
    }

    const reset = () => {
      actions.call("all", "reset", { fieldTypes: ["plain"] })
    }

    const callLayout: CFormExpose["callLayout"] = (path, key, point, ...params) => {
      return actions.call(path, "callLayout", { params: [{ key, point, params }] })
    }

    const callElement: CFormExpose["callElement"] = (path, key, point, ...params) => {
      return actions.call(path, "callElement", { params: [{ key, point, params }] })
    }

    const formExpose: CFormExpose = { ...actions, validate, reset, callLayout, callElement, field }
    expose(formExpose)

    return () => {
      const render = () => {
        return <div class="u-form">{slots.default?.()}</div>
      }
      return <FieldRender render={render}></FieldRender>
    }
  }
})

const FormContextConfigKey = Symbol()
export function useFormConfigProvide(config: CFormConfig): CFormConfig
export function useFormConfigProvide(config: CFormConfig, app: App): CFormConfig
export function useFormConfigProvide(config: CFormConfig, app?: App) {
  const conf = normalizeFormConfig(toRaw(config))
  if (app) app.provide(FormContextConfigKey, conf)
  else if (hasInjectionContext()) provide(FormContextConfigKey, conf)
  return conf
}

export function normalizeFormConfig(c: CFormConfig): CFormConfig {
  const config = { ...c }
  config.Elements = { ...(config.Elements ?? {}) }
  config.Rules = { ...(config.Rules ?? {}) }
  config.layoutProps = { ...(config.layoutProps ?? {}) }
  if (hasInjectionContext()) {
    const ctxConfig = inject<CFormConfig | null>(FormContextConfigKey, null)
    if (ctxConfig) {
      for (const key in ctxConfig) {
        const ctxVal = ctxConfig[key]
        const cVal = config[key]
        if (key === "Elements" || key === "Rules" || key === "layoutProps") {
          config[key] = { ...ctxVal, ...config[key] }
        } else if (cVal === undefined) {
          config[key] = ctxVal
        }
      }
    }
  }
  return config
}
