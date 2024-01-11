import { FormActions, FormConfig, useForm } from "@usaform/vue"
import { defineComponent } from "vue"

export interface FormProps {
  config?: FormConfig
}

export interface FormValidateError {
  path: string
  field: string
  message: string
}

export interface FormExpose extends FormActions {
  validate: () => Promise<FormValidateError[]>
  reset: () => void
}

export const Form = defineComponent({
  name: "Form",
  props: ["config"],
  setup(props: FormProps, { slots, expose }) {
    const config = props.config ?? {}
    config.Elements = { ...(config.Elements ?? {}) }
    config.Rules = { ...(config.Rules ?? {}) }
    const form = useForm(config)
    form.provide()

    async function validate() {
      const res = form.call("validate", null)
      const ps: Promise<any>[] = []
      const errs: FormValidateError[] = []
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
      form.call("reset", null)
    }

    expose({ ...form, validate, reset })

    return () => {
      return <div class="u-form">{slots.default?.()}</div>
    }
  }
})
