import { computed, defineComponent, h, nextTick, shallowRef, unref, watch } from "vue"
import { CFormValidateError } from "../controller/rule"
import { buildScopeElement } from "../shared/helper"
import { normalizeFormConfig } from "./Provider"
import { useForm } from "./form"
import { CFormExpose, CFormProps, FormConfig, OnForceRenderForm } from "./form.type"

export function useComponentForm(formConfig?: FormConfig) {
  const config = normalizeFormConfig(formConfig ?? {})
  const { actions, field } = useForm(config)

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
    return actions.call(path, "callLayout", { fieldTypes: ["plain"], params: [{ key, point, params }] })
  }

  const callElement: CFormExpose["callElement"] = (path, key, point, ...params) => {
    return actions.call(path, "callElement", { fieldTypes: ["plain"], params: [{ key, point, params }] })
  }

  const setProps: CFormExpose["setProps"] = (path, setter) => {
    return actions.call(path, "setProps", { fieldTypes: ["plain"], params: [setter] })
  }

  const createFormExpose = (): Omit<CFormExpose, "onForceRenderForm"> => {
    const { provide, ..._actions } = actions
    return { ..._actions, validate, reset, callLayout, callElement, setProps, field }
  }

  return { actions, config, field, validate, reset, callLayout, callElement, createFormExpose }
}

export function createForm(props: CFormProps = {}) {
  let prevFlushKey = 0
  const flushKey = shallowRef(prevFlushKey)

  const forceRender = () => {
    formActions.value = { onForceRenderForm } as any
    flushKey.value++
  }

  const forceRenderPost: ((expose: CFormExpose) => any)[] = []
  const onForceRenderForm: OnForceRenderForm = fn => {
    if (typeof fn === "function") forceRenderPost.push(fn)
    return function clean() {
      const index = forceRenderPost.indexOf(fn)
      if (index > -1) forceRenderPost.splice(index, 1)
    }
  }

  const formActions = shallowRef<CFormExpose>({ onForceRenderForm } as any)

  const createFormRender = () => {
    return defineComponent({
      name: "Form",
      setup(_, { attrs, slots, expose }) {
        const { config, actions, createFormExpose, field } = useComponentForm(props.config)
        config.Elements!.value = { ...config.Elements!.value, ...buildScopeElement(slots) }

        watch(
          () => props.config?.defaultFormData,
          data => {
            field.setter(data)
          }
        )

        const { defaultFormLayout } = config
        const gFormLayout = typeof defaultFormLayout === "string" ? unref(config.Elements!)[defaultFormLayout] : defaultFormLayout

        actions.provide()

        const formExpose = createFormExpose()
        expose((formActions.value = { ...formExpose, onForceRenderForm }))
        if (prevFlushKey !== flushKey.value) {
          nextTick(() => {
            prevFlushKey = flushKey.value
            forceRenderPost.forEach(fn => fn(formActions.value))
          })
        }

        return () => {
          const { layout, layoutProps } = props
          const Layout = typeof layout === "string" ? unref(config.Elements!)[layout] : (layout ?? gFormLayout)

          if (Layout) return h(Layout, { ...layoutProps, ...attrs }, () => slots.default?.())

          return (
            <div class="u-form" key={formExpose.field.fieldValue.value} {...attrs}>
              {slots.default?.()}
            </div>
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
