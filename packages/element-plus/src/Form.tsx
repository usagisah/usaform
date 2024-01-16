import { FormActions, FormConfig, useForm } from "@usaform/vue"
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
  callLayout: (key: string, point: any, ...params: any[]) => Record<string, any>
}

export const Form = defineComponent({
  name: "Form",
  props: ["config"],
  setup(props: CFormProps, { slots, expose }) {
    const config = normalizeFormConfig(props.config ?? {})
    const { actions, render } = useForm(config)
    actions.provide()

    const validate: CFormExpose["validate"] = async () => {
      const res = actions.call("validate", null)
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
      actions.call("reset", null)
    }

    const callLayout: CFormExpose["callLayout"] = (key, point, ...params) => {
      return actions.call(key, point, ...params)
    }

    expose({ ...actions, validate, reset, callLayout })

    return render(() => {
      return <div class="u-form">{slots.default?.()}</div>
    })
  }
})

const FormContextConfigKey = Symbol()
export function useFormConfigProvide(config: CFormConfig): CFormConfig
export function useFormConfigProvide(config: CFormConfig, app: App): CFormConfig
export function useFormConfigProvide(config: CFormConfig, app?: App) {
  const conf = normalizeFormConfig(toRaw(config))
  app ? app.provide(FormContextConfigKey, conf) : provide(FormContextConfigKey, conf)
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
