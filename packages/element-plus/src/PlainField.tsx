import { useFormPlainField } from "@usaform/vue"
import { RuleItem } from "async-validator"
import { SlotsType, defineComponent, h, reactive, ref } from "vue"
import { FormItemExpose } from "./FormItem"

export interface CPlainFieldProps {
  name: string | number

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}

export const PlainField = defineComponent({
  name: "PlainField",
  props: ["name", "layout", "layoutProps", "element", "props"],
  slots: Object as SlotsType<{
    default?: { bind: { modelValue: any; "onUpdate:modelValue": (e: any) => any } } & Record<any, any>
  }>,
  setup(props: CPlainFieldProps, { slots }) {
    const { name, layout, element } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 PlainField 组件"
    }

    const fieldLayoutRef = ref<FormItemExpose | null>(null)

    let FieldLayout: any = null
    let FieldElement: any = null
    let gFieldRules: Record<any, RuleItem>
    let gLayoutProps: any
    let FieldSlot = slots.default
    const { fieldValue } = useFormPlainField(name, ({ formConfig }) => {
      const { Elements, Rules, layoutProps, defaultValue } = formConfig
      FieldLayout = Elements![layout as any]
      FieldElement = Elements![element as any]
      gFieldRules = Rules!
      gLayoutProps = layoutProps!

      return {
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

    const resolveElement = (p = {}) => {
      const baseProps = { ...props.props, ...p }
      if (FieldElement) {
        return [h(FieldElement), reactive({ ...baseProps, modelValue: fieldValue, "onUpdate:modelValue": setFieldValue })]
      } else {
        return FieldSlot?.(reactive({ ...baseProps, bind: { modelValue: fieldValue, "onUpdate:modelValue": setFieldValue } }))
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
