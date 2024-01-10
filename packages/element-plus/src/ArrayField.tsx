import { useFormArrayField } from "@usaform/vue"
import { defineComponent, h, reactive } from "vue"

export interface ArrayFieldProps {
  name: string

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}

export type ArrayFieldAttrs = {
  fields: any[]
  api: {
    push: (e: Record<any, any>) => void
    unshift: (e: Record<any, any>) => void
    remove: (index: number) => void
    pop: () => void
    shift: () => void
    add: (index: number, e: any) => void
    swap: (i1: number, i2: number) => void
  }
} & Record<any, any>

export const ArrayField = defineComponent({
  name: "ArrayField",
  props: ["name", "layout", "layoutProps", "element", "props"],
  setup(props: ArrayFieldProps, { slots }) {
    const { name, layout, element } = props

    let FieldLayout: any
    let FieldElement: any

    const { fieldValue, fieldKey, actions } = useFormArrayField(name, ({ formConfig }) => {
      const Elements = formConfig.Elements ?? []
      FieldLayout = Elements[layout!]
      FieldElement = Elements[element!]
      return {}
    })
    const { delValue, setValue, swap } = actions
    const remove = (index: number) => delValue(index)
    const pop = () => delValue(fieldValue.value.length)
    const shift = () => delValue(-1)
    const add = (index: number, e: any) => setValue(index, e)
    const push = (e: any) => setValue(fieldValue.value.length, e)
    const unshift = (e: any) => setValue(-1, e)
    const api = { push, unshift, remove, pop, shift, add, swap }

    const mergeElementProps = (p = {}) => {
      return reactive({ ...props.props, ...p, fields: fieldValue, api })
    }

    return () => {
      if (FieldLayout) {
        return h(FieldLayout, {
          ...(props.layoutProps ?? {}),
          key: fieldKey.value,
          children(p: any) {
            return FieldElement ? [h(FieldElement, mergeElementProps(p))] : slots.default?.(mergeElementProps(p))
          }
        })
      }
      return FieldElement ? h(FieldElement, mergeElementProps({ key: fieldKey.value })) : slots.default?.(mergeElementProps({ key: fieldKey.value }))
    }
  }
})
