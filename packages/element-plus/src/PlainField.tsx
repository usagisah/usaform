import { useFormPlainField } from "@usaform/vue"
import { defineComponent, h, reactive, ref } from "vue"
import { FormItemExpose } from "./FormItem"

export interface PlainFieldProps {
  name: string | number

  layout?: string
  layoutProps?: any

  element: string
  props?: Record<any, any>

  formSlots?: FormSlots
}
type FormSlots = Record<string, string | ((...props: any[]) => any)>
export const PlainField = defineComponent({
  name: "PlainField",
  props: ["name", "layout", "layoutProps", "element", "props", "formSlots"],
  setup(props: PlainFieldProps) {
    const { name, layout, element, formSlots } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 PlainField 组件"
    }

    const fieldLayoutRef = ref<FormItemExpose | null>(null)

    let FieldLayout: any
    let FieldElement: any
    let FieldSlots: any = {}
    let FieldRules: any = {}

    const [modelValue] = useFormPlainField(name, ({ formConfig }) => {
      const { Elements = [], Rules = {}, defaultValue } = formConfig

      FieldLayout = layout ? Elements[layout] : null
      FieldElement = Elements[element]
      FieldRules = Rules

      if (formSlots) {
        for (const key in formSlots) {
          const val = formSlots[key]
          if (typeof val === "string") FieldSlots[key] = () => h(Elements[val])
          else FieldSlots[key] = () => h(val)
        }
      }

      return {
        reset: () => {
          modelValue.value = defaultValue
          fieldLayoutRef.value!.setValidateState({ error: false, message: "" })
        },
        validate({ path }: any) {
          return fieldLayoutRef.value!.validate(path, modelValue.value)
        }
      }
    })
    const setModelValue = (v: any) => {
      modelValue.value = v
    }

    const mergeElementProps = (p = {}) => {
      return reactive({
        ...props.props,
        ...p,
        modelValue,
        "onUpdate:modelValue": setModelValue
      })
    }

    return () => {
      if (FieldLayout) {
        return h(FieldLayout, {
          ...props.layoutProps,
          Rules: FieldRules,
          ref: fieldLayoutRef,
          children: (p = {}) => [h(FieldElement, mergeElementProps(p), FieldSlots)]
        })
      }
      return h(FieldElement, mergeElementProps(), FieldSlots)
    }
  }
})
