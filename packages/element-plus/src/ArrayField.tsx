import { ArrayItemParams, useFormArrayField } from "@usaform/vue"
import { defineComponent, h, reactive, ref } from "vue"

interface UFormFieldProps {
  name: string

  layout?: string
  layoutProps?: any

  element: string
  props?: Record<any, any>
  arrayProps?: Partial<ArrayItemParams>
}

export const ArrayField = defineComponent({
  name: "ArrayField",
  props: ["name", "layout", "layoutProps", "element", "props", "arrayProps"],
  setup(props: UFormFieldProps) {
    const { name, layout, element } = props

    const arrayValue = ref<any[]>([])

    let FieldLayout: any
    let FieldElement: any
    let api: any

    useFormArrayField(
      name,
      ({ formConfig, addValue, delValue, swap, initValue }) => {
        arrayValue.value = initValue

        const Elements = formConfig.Elements ?? []
        FieldLayout = layout ? Elements[layout] : null
        FieldElement = Elements[element]

        const remove = (index: number) => delValue(index)
        const pop = () => delValue(arrayValue.value.length)
        const shift = () => delValue(-1)
        const add = (index: number, e: any) => addValue(index, e)
        const push = (e: any) => addValue(arrayValue.value.length, e)
        const unshift = (e: any) => addValue(-1, e)
        api = { push, unshift, remove, pop, shift, add, swap }
        return {
          initValue,
          setValue: v => {
            arrayValue.value = v
          }
        }
      },
      props.arrayProps
    )

    const mergeElementProps = (p = {}) => {
      return reactive({ ...props.props, ...p, fields: arrayValue, api })
    }

    return () => {
      if (FieldLayout) {
        return h(FieldLayout, { ...(props.layoutProps ?? {}), children: (p: any) => [h(FieldElement, mergeElementProps(p))] })
      }
      return h(FieldElement, mergeElementProps())
    }
  }
})
