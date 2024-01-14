import { FormActions, FormConfig, useForm } from "@usaform/vue"
import { App, defineComponent, hasInjectionContext, inject, provide } from "vue"

export interface CFormProps {
  config?: FormConfig
}

export interface CFormValidateError {
  path: string
  field: string
  message: string
}

export interface CFormExpose extends FormActions {
  validate: () => Promise<CFormValidateError[]>
  reset: () => void
}

export const Form = defineComponent({
  name: "Form",
  props: ["config"],
  setup(props: CFormProps, { slots, expose }) {
    const config = normalizeFormConfig(props.config ?? {})
    const { actions, render } = useForm(config)
    actions.provide()

    async function validate() {
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

    function reset() {
      actions.call("reset", null)
    }

    expose({ ...actions, validate, reset })

    return render(() => {
      return <div class="u-form">{slots.default?.()}</div>
    })
  }
})

export const FormContextKey = Symbol()
export function useFormConfigProvide(config: FormConfig): FormConfig
export function useFormConfigProvide(config: FormConfig, app: App): FormConfig
export function useFormConfigProvide(config: FormConfig, app?: App) {
  const conf = normalizeFormConfig(config ?? {})
  app ? app.provide(FormContextKey, conf) : provide(FormContextKey, conf)
  return conf
}

export function normalizeFormConfig(c: FormConfig): FormConfig {
  const config = { ...c }
  config.Elements = { ...(config.Elements ?? {}) }
  config.Rules = { ...(config.Rules ?? {}) }
  config.layoutProps = { ...(config.layoutProps ?? {}) }
  if (hasInjectionContext()) {
    const ctxConfig = inject<FormConfig>(FormContextKey)
    if (ctxConfig) {
      for (const key in ctxConfig) {
        const ctxVal = ctxConfig[key]
        if (key === "Elements" || key === "Rules" || key === "layoutProps") {
          config[key] = { ...ctxVal, ...config[key] }
        } else {
          config[key] = ctxVal
        }
      }
    }
  }
  return config
}
