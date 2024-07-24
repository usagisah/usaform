import { computed, defineComponent, h, shallowRef, unref } from "vue"
import { CFormValidateError } from "../controller/rule"
import { buildScopeElement } from "../shared/helper"
import { normalizeFormConfig } from "./Provider"
import { useForm } from "./form"
import { CFormConfig, CFormExpose, CFormProps } from "./form.type"

export function useComponentForm(formConfig?: CFormConfig) {
  const config = normalizeFormConfig(formConfig ?? {})
  const { actions, FieldRender, field } = useForm(config)

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
    actions.call("all", "reset", { fieldTypes: ["ary", "plain"] })
  }

  const callLayout: CFormExpose["callLayout"] = (path, key, point, ...params) => {
    return actions.call(path, "callLayout", { params: [{ key, point, params }] })
  }

  const callElement: CFormExpose["callElement"] = (path, key, point, ...params) => {
    return actions.call(path, "callElement", { params: [{ key, point, params }] })
  }

  const createFormExpose = (): CFormExpose => {
    const { provide, ..._actions } = actions
    return { ..._actions, validate, reset, callLayout, callElement, field }
  }

  return { actions, config, field, FieldRender, validate, reset, callLayout, callElement, createFormExpose }
}

export function createForm(props: CFormProps = {}) {
  const formActions = shallowRef<CFormExpose | null>(null)
  const flushKey = shallowRef(0)
  const forceRender = () => {
    formActions.value = null
    flushKey.value++
  }

  const createFormRender = () => {
    return defineComponent({
      name: "Form",
      setup(_, { attrs, slots, expose }) {
        const { FieldRender, config, actions, createFormExpose } = useComponentForm(props.config)
        Object.assign(config.Elements!.value, buildScopeElement(slots))

        const { defaultFormLayout } = config
        const gFormLayout = typeof defaultFormLayout === "string" ? unref(config.Elements!)[defaultFormLayout] : defaultFormLayout

        actions.provide()

        const formExpose = createFormExpose()
        formActions.value = formExpose
        expose(formExpose)

        return () => {
          const { layout, layoutProps } = props
          const Layout = typeof layout === "string" ? unref(config.Elements!)[layout] : (layout ?? gFormLayout)
          return (
            <FieldRender>
              {Layout ? (
                h(Layout, { ...layoutProps, ...attrs }, () => slots.default?.())
              ) : (
                <div class="u-form" {...attrs}>
                  {slots.default?.()}
                </div>
              )}
            </FieldRender>
          )
        }
      }
    })
  }
  const ProxyForm = defineComponent({
    name: "ProxyForm",
    setup(_, { attrs, slots }) {
      const Form = computed<any>(() => {
        return flushKey.value > -1 && createFormRender()
      })
      return () => h(Form.value, attrs, slots)
    }
  })
  return [(props.dynamic ?? true) ? ProxyForm : createFormRender(), formActions, forceRender] as const
}
