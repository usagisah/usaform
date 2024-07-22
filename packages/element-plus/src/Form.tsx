import { FormActions, FormConfig, PlainFieldActions, RootField, useForm as _useForm } from "@usaform/vue"
import { InternalRuleItem, RuleItem, SyncValidateResult, ValidateOption } from "async-validator"
import { MaybeRef, computed, defineComponent, h, shallowRef } from "vue"
import { normalizeFormConfig } from "./Provider"
import { CFormItemProps } from "./controller/FormItem"
import { buildScopeElement } from "./helper"

export interface CFormRuleItem extends Omit<RuleItem, "validator" | "asyncValidator"> {
  trigger?: "change" | "blur"
  value?: any
  validator?: (value: any, options: InternalRuleItem & { value: any; actions: PlainFieldActions }) => SyncValidateResult | void
}

export interface CFormConfig extends FormConfig {
  // 默认使用的表单布局组件
  defaultFormLayout?: string | Record<any, any>
  // 默认使用的控制器
  plainFieldController?: string | Record<any, any>
  objectFieldController?: string | Record<any, any>
  arrayFieldController?: string | Record<any, any>
  // 全局布局参数
  layoutProps?: MaybeRef<CFormItemProps>
  // 双向绑定的 key
  modelValue?: string
  // 用于指定 key 的元素
  Elements?: MaybeRef<Record<string, any>>
  // 默认的校验选项
  defaultValidateOption?: ValidateOption
  // 用于指定 key 的规则
  Rules?: MaybeRef<Record<any, (value: any) => CFormRuleItem>>
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
  const { actions, FieldRender, field } = _useForm(config)

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
        const { FieldRender, config, actions, createFormExpose } = useForm(props.config)
        Object.assign(config.Elements!.value, buildScopeElement(slots))

        const { defaultFormLayout } = config
        const gFormLayout = typeof defaultFormLayout === "string" ? config.Elements!.value[defaultFormLayout] : defaultFormLayout

        actions.provide()

        const formExpose = createFormExpose()
        formActions.value = formExpose
        expose(formExpose)

        return () => {
          const { layout, layoutProps } = props
          const Layout = typeof layout === "string" ? config.Elements!.value[layout] : (layout ?? gFormLayout)
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
