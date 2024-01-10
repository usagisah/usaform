import { ArrayFieldActions, useFormArrayField } from "@usaform/vue"
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
  actions: {
    push: (e: Record<any, any>) => void
    unshift: (e: Record<any, any>) => void
    pop: () => void
    shift: () => void
  } & ArrayFieldActions
} & Record<any, any>

export const ArrayField = defineComponent({
  name: "ArrayField",
  props: ["name", "layout", "layoutProps", "element", "props"],
  setup(props: ArrayFieldProps, { slots }) {
    const { name, layout, element } = props

    let FieldLayout: any
    let FieldElement: any

    const { fieldValue, actions, render } = useFormArrayField(name, ({ formConfig }) => {
      const Elements = formConfig.Elements ?? []
      FieldLayout = Elements[layout!]
      FieldElement = Elements[element!]
      return {}
    })
    const { delValue, setValue, swap } = actions
    const pop = () => delValue(fieldValue.value.length)
    const shift = () => delValue(-1)
    const push = (e: any) => setValue(fieldValue.value.length, e)
    const unshift = (e: any) => setValue(-1, e)

    const mergeElementProps = (p = {}) => {
      return reactive({ ...props.props, ...p, fields: fieldValue, actions: { ...actions, push, unshift, pop, shift, swap } })
    }

    return render(() => {
      if (FieldLayout) {
        return h(FieldLayout, {
          ...(props.layoutProps ?? {}),
          children(p: any) {
            return FieldElement ? [h(FieldElement, mergeElementProps(p))] : slots.default?.(mergeElementProps(p))
          }
        })
      }
      return FieldElement ? h(FieldElement, mergeElementProps()) : slots.default?.(mergeElementProps())
    })
  }
})
