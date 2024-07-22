import { FormActionCallInfo, PlainFieldActions, useFormPlainField } from "@usaform/vue"
import { Ref, SlotsType, computed, defineComponent, h, reactive, ref, unref, useAttrs } from "vue"
import { CFormConfig, CFormRuleItem } from "./Form"
import { CFormItemProps } from "./controller/FormItem"
import { CFormItemExpose } from "./controller/helper"
import { callFuncWithError, createFormCFieldToJson, isPlainObject, resolveScopeElement } from "./helper"

export interface CPlainFieldProps {
  name: string | number

  // 初始值
  initValue?: any

  // 双向绑定的 key
  modelValue?: string

  layout?: string | Record<any, any>
  layoutProps?: CFormItemProps

  element?: string | Record<any, any>
  props?: Record<any, any>

  slots?: Record<any, any>
}

export interface CPlainFieldLayoutInfo {
  type: "plain"
  fieldValue: Ref<any>
  actions: PlainFieldActions
  Rules: Record<any, CFormRuleItem>
  props: Record<any, any>
  layoutProps: CFormItemProps
  children: (p: { bind: Record<any, any>; props: Record<any, any> }) => any
  fieldProps: Record<any, any>
  formConfig: CFormConfig
}

export const PlainField = defineComponent<CPlainFieldProps>({
  name: "PlainField",
  props: ["name", "initValue", "layout", "layoutProps", "element", "props", "modelValue", "slots"] as any as undefined,
  slots: Object as SlotsType<{
    default: (props: { bind?: Record<any, any> } & Record<any, any>) => any
  }>,
  setup(props, { slots, attrs }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 PlainField 组件"
    }

    const fieldLayoutRef = ref<(CFormItemExpose & Record<any, any>) | null>(null)
    const fieldElementRef = ref<Record<any, any> | null>(null)

    let FieldLayout: any = null
    let FieldElement: any = null
    let FieldSlots: Record<string, any> = slots

    let gLayoutProps: any = {}
    let gFieldRules: any

    let vModel = { v: "", e: "" }
    let formConfig_ = {} as any

    const { fieldValue, actions } = useFormPlainField(name, ({ initValue, formConfig }) => {
      let { Elements, Rules, layoutProps, plainFieldController, modelValue } = formConfig

      for (const k in props.slots) {
        const v = props.slots[k]
        if (typeof v === "string") FieldSlots[k] = resolveScopeElement(v, Elements.value)
        else if (isPlainObject(v) && "setup" in v) FieldSlots[k] = () => [h(v, useAttrs())]
        else FieldSlots[k] = v
      }

      if (layout) FieldLayout = isPlainObject(layout) ? layout : Elements.value[layout]
      if (!FieldLayout && plainFieldController) FieldLayout = isPlainObject(plainFieldController) ? plainFieldController : Elements.value[plainFieldController]
      if (element) FieldElement = isPlainObject(element) ? element : resolveScopeElement(element, Elements.value)

      gLayoutProps = layoutProps!
      gFieldRules = Rules!

      if (typeof props.modelValue === "string") modelValue = props.modelValue
      vModel.v = modelValue
      vModel.e = "onUpdate:" + modelValue

      formConfig_ = formConfig

      return {
        initValue: initValue === undefined ? props.initValue : initValue,
        toJson: createFormCFieldToJson(props, layout, element),
        reset: () => {
          // 确保初始值在没有可用的情况下，永远是外部传进来最新的
          fieldValue.value = props.initValue
          fieldLayoutRef.value?.setValidateState({ status: "", message: "" })
        },
        validate({ path }: FormActionCallInfo) {
          return fieldLayoutRef.value?.validate(path, fieldValue.value)
        },
        callLayout(_: any, { key, point, params }: FormActionCallInfo) {
          return callFuncWithError(() => {
            const f = fieldLayoutRef.value?.[key]
            if (typeof f === "function") f.apply(point, params)
          })
        },
        callElement(_: any, { key, point, params }: FormActionCallInfo) {
          return callFuncWithError(() => {
            const f = fieldElementRef.value?.[key]
            if (typeof f === "function") f.apply(point, params)
          })
        }
      }
    })
    const setFieldValue = (v: any) => {
      fieldValue.value = v
    }

    const controllerProps = computed(() => {
      if (!FieldLayout) return null
      const p: CPlainFieldLayoutInfo = {
        type: "plain",
        fieldValue,
        actions,
        props: props.props ?? {},
        layoutProps: { ...unref(gLayoutProps), ...reactive(props.layoutProps ?? {}) },
        Rules: unref(gFieldRules),
        formConfig: formConfig_,
        fieldProps: attrs,
        children: ({ bind, props }) => {
          const _props = { ...props, [vModel.v]: fieldValue.value, [vModel.e]: setFieldValue, actions, ref: fieldElementRef }
          if (FieldElement) {
            return h(FieldElement, _props, FieldSlots)
          } else {
            Object.assign(_props, { bind: { ...bind, [vModel.v]: fieldValue.value, [vModel.e]: setFieldValue, ref: fieldElementRef } })
            return FieldSlots.default?.(_props)
          }
        }
      }
      return p
    })

    const resolveRenderElement = () => {
      const _props = { ...props.props, [vModel.v]: fieldValue.value, [vModel.e]: setFieldValue, actions, ref: fieldElementRef }
      return FieldElement ? h(FieldElement, _props, FieldSlots) : FieldSlots.default?.(_props)
    }

    return () => {
      return FieldLayout ? h(FieldLayout, { FormControllerProps: controllerProps.value, ref: fieldLayoutRef }) : resolveRenderElement()
    }
  }
})
