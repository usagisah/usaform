import { FormActions, FormConfig, RootField, useForm as _useForm } from "@usaform/vue"
import { RuleItem, ValidateOption } from "async-validator"
import { App, PropType, computed, defineComponent, h, hasInjectionContext, inject, provide, shallowRef, toRaw } from "vue"
import { CFormItemProps } from "./controller/FormItem"
import { buildScopeElement } from "./helper"

export interface CFormRuleItem extends RuleItem {
  trigger?: "change" | "blur"
}

export interface CFormConfig extends FormConfig {
  // 默认使用的控制器
  plainFieldController?: string | Record<any, any>
  objectFieldController?: string | Record<any, any>
  arrayFieldController?: string | Record<any, any>
  // 全局布局参数
  layoutProps?: CFormItemProps
  // 双向绑定的 key
  modelValue?: string
  // 用于指定 key 的元素
  Elements?: Record<string, any>
  // 默认的校验选项
  defaultValidateOption?: ValidateOption
  // 用于指定 key 的规则
  Rules?: Record<any, CFormRuleItem>
}

export interface CFormProps {
  config?: CFormConfig
  layout?: any
  layoutProps?: Record<any, any>
  dynamic?: boolean
}

export interface CFormValidateError {
  path: string
  field: string
  message: string
}

export interface CFormExpose extends Omit<FormActions, "provide"> {
  validate: () => Promise<CFormValidateError[]>
  reset: () => void
  callLayout: (path: string, key: string, ...params: any[]) => Record<string, any>
  callElement: (path: string, key: string, ...params: any[]) => Record<string, any>
  field: RootField
}

export function useForm(formConfig?: CFormConfig) {
  const config = normalizeFormConfig(formConfig ?? {})
  const { actions, FieldRender, field } = _useForm({ ...config })

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
        const { FieldRender, config, actions, createFormExpose } = useForm(props.config)
        Object.assign(config.Elements!, buildScopeElement(slots))

        actions.provide()

        const formExpose = createFormExpose()
        formActions.value = formExpose
        expose(formExpose)

        return () => {
          const { layout, layoutProps } = props
          const Layout = typeof layout === "string" ? config.Elements![layout] : layout
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
  return [props.dynamic ?? true ? ProxyForm : createFormRender(), formActions, forceRender] as const
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

  config.modelValue = config.modelValue ?? "modelValue"

  return config
}

const FormContextConfigKey = "u" + Date.now().toString(16)
export function provideGlobalFormConfig(config: CFormConfig, app?: App) {
  const conf = normalizeFormConfig(toRaw(config))
  if (app) app.provide(FormContextConfigKey, conf)
  else if (hasInjectionContext()) provide(FormContextConfigKey, conf)
  return conf
}

export const CFormPlugin = (app: any, config: CFormConfig) => {
  provideGlobalFormConfig(config ?? {}, app)
}

export const CFormProvider = defineComponent({
  name: "FormProvider",
  props: {
    config: {
      type: Object as PropType<CFormConfig>,
      required: true
    }
  },
  setup(props, { slots }) {
    provideGlobalFormConfig(props.config)
    return () => slots.default?.()
  }
})
