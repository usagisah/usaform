import { useFormPlainField } from "@usaform/vue"
import { RuleItem } from "async-validator"
import { SlotsType, defineComponent, h, ref } from "vue"
import { CFormItemExpose } from "./FormItem"

export interface CPlainFieldProps {
  name: string | number

  initValue?: any

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}

export const PlainField = defineComponent({
  name: "PlainField",
  props: ["name", "initValue", "layout", "layoutProps", "element", "props"],
  slots: Object as SlotsType<{
    default: { bind: { modelValue: any; "onUpdate:modelValue": (e: any) => any } } & Record<any, any>
  }>,
  setup(props: CPlainFieldProps, { slots }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 PlainField 组件"
    }

    const fieldLayoutRef = ref<CFormItemExpose | null>(null)

    let FieldLayout: any = null
    let FieldElement: any = null
    let gFieldRules: Record<any, RuleItem>
    let gLayoutProps: any
    let FieldSlot = slots.default
    const { fieldValue } = useFormPlainField(name, ({ initValue, formConfig }) => {
      const { Elements, Rules, layoutProps, defaultValue } = formConfig
      FieldLayout = Elements![layout as any]
      FieldElement = Elements![element as any]
      gFieldRules = Rules!
      gLayoutProps = layoutProps!

      return {
        initValue: initValue ?? props.initValue,
        reset: () => {
          fieldValue.value = defaultValue
          fieldLayoutRef.value!.setValidateState({ error: false, message: "" })
        },
        validate({ path }: any) {
          return fieldLayoutRef.value!.validate(path, fieldValue.value)
        }
      }
    })
    const setFieldValue = (v: any) => {
      fieldValue.value = v
    }

    const resolveElement = (p: any = {}) => {
      if (FieldElement) {
        return [h(FieldElement, { ...p, ...props.props, modelValue: fieldValue.value, "onUpdate:modelValue": setFieldValue })]
      } else {
        const { bind, ..._p } = p
        return FieldSlot?.({ ..._p, ...props.props, bind: { ...bind, modelValue: fieldValue.value, "onUpdate:modelValue": setFieldValue } })
      }
    }

    return () => {
      if (FieldLayout) {
        return h(FieldLayout, {
          ...gLayoutProps,
          ...props.layoutProps,
          Rules: gFieldRules,
          ref: fieldLayoutRef,
          children: resolveElement
        })
      }
      return resolveElement()
    }
  }
})
