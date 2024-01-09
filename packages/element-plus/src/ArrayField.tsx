import { useFormArrayField } from "@usaform/vue"
import { defineComponent, h, reactive } from "vue"

interface UFormFieldProps {
  name: string

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}

export const ArrayField = defineComponent({
  name: "ArrayField",
  props: ["name", "layout", "layoutProps", "element", "props"],
  setup(props: UFormFieldProps, { slots }) {
    const { name, layout, element } = props

    let FieldLayout: any
    let FieldElement: any

    const [modelValue, actions] = useFormArrayField(name, ({ formConfig }) => {
      const Elements = formConfig.Elements ?? []
      FieldLayout = Elements[layout!]
      FieldElement = Elements[element!]
      return {}
    })
    const { delValue, setValue, swap } = actions
    const remove = (index: number) => delValue(index)
    const pop = () => delValue(modelValue.value.length)
    const shift = () => delValue(-1)
    const add = (index: number, e: any) => setValue(index, e)
    const push = (e: any) => setValue(modelValue.value.length, e)
    const unshift = (e: any) => setValue(-1, e)
    const api = { push, unshift, remove, pop, shift, add, swap }

    const mergeElementProps = (p = {}) => {
      return reactive({ ...props.props, ...p, fields: modelValue, api })
    }

    return () => {
      if (FieldLayout) {
        return h(FieldLayout, {
          ...(props.layoutProps ?? {}),
          children(p: any) {
            return FieldElement ? [h(FieldElement, mergeElementProps(p))] : slots.default?.(mergeElementProps(p))
          }
        })
      }
      return FieldElement ? h(FieldElement, mergeElementProps()) : slots.default?.(mergeElementProps())
    }
  }
})
