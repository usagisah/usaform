import { FormActions, FormConfig, useForm } from "@usaform/vue"
import { defineComponent, h } from "vue"
import { FormItemProps } from "./FormItem.jsx"

export interface FormProps {
  config?: FormConfig
  itemsProps?: FormItemProps
}

export interface FormValidateError {
  path: string
  field: string
  message: string
}

export interface FormExpose extends FormActions {
  validate: () => Promise<FormValidateError[]>
}

export const Form = defineComponent({
  name: "Form",
  props: ["config", "itemsProps"],
  setup(props: FormProps, { slots, expose }) {
    const config = props.config ?? {}
    config.Elements = { ...(config.Elements ?? {}) }
    config.rules = { ...(config.rules ?? {}) }
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

    expose({ ...form, validate })

    return () => {
      const children = slots.default?.() ?? []
      return <div class="u-form">{children.map(item => h(item, props.itemsProps))}</div>
    }
  }
})
