import { defineComponent, h, onBeforeMount, reactive, ref } from "vue"
import { FormItemExpose } from "./FormItem.jsx"
import { ArrayItemParams, useFormPlainField } from "@usaform/vue"

export interface PlainFieldProps {
  name: string | number

  layout?: string
  layoutProps?: any

  element: string
  props?: Record<any, any>
  arrayProps?: Partial<ArrayItemParams>

  formSlots?: FormSlots
}
type FormSlots = Record<string, string | ((...props: any[]) => any)>
export const PlainField = defineComponent({
  name: "PlainField",
  props: ["name", "layout", "layoutProps", "element", "props", "arrayProps", "formSlots"],
  setup(props: PlainFieldProps) {
    const { name, arrayProps, layout, element, formSlots } = props
    if (name !== 0 && !name) {
      throw "非法的使用方式，请正确使用 PlainField 组件"
    }

    const fieldLayoutRef = ref<FormItemExpose | null>(null)

    let FieldLayout: any
    let FieldElement: any
    let FieldSlots: any = {}

    let modelValue = ref<any>("")
    let setModelValue: (e: any) => any

    const [_, action] = useFormPlainField(
      name,
      ({ initValue, formConfig, setValue }) => {
        const Elements = formConfig.Elements ?? []
        FieldLayout = layout ? Elements[layout] : null
        FieldElement = Elements[element]

        if (formSlots) {
          for (const key in formSlots) {
            const val = formSlots[key]
            if (typeof val === "string") FieldSlots[key] = () => h(Elements[val])
            else FieldSlots[key] = () => h(val)
          }
        }

        modelValue.value = initValue
        setModelValue = (e: any) => {
          modelValue.value = setValue(e)
        }

        return {
          initValue: modelValue.value,
          getter: () => modelValue.value,
          setter: setModelValue,
          reset: () => {
            modelValue.value = setValue("")
            fieldLayoutRef.value!.setValidateState({ error: false, message: "" })
          },
          validate({ path }: any) {
            return fieldLayoutRef.value!.validate(path, modelValue.value)
          },
          bind: { Rules: formConfig.Rules ?? {} }
        }
      },
      arrayProps
    )
    onBeforeMount(() => action.clearWatcher())

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
          Rules: _.Rules,
          ref: fieldLayoutRef,
          children: (p = {}) => [h(FieldElement, mergeElementProps(p), FieldSlots)]
        })
      }
      return h(FieldElement, mergeElementProps(), FieldSlots)
    }
  }
})
