import { ArrayFieldActions, useFormArrayField } from "@usaform/vue"
import { SlotsType, defineComponent, h, reactive } from "vue"

export interface CArrayFieldProps {
  name: string

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}

export type CArrayFieldAttrs = {
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
  slots: Object as SlotsType<{
    default?: CArrayFieldAttrs
  }>,
  setup(props: CArrayFieldProps, { slots }) {
    const { name, layout, element } = props

    let FieldLayout: any
    let FieldElement: any
    let FieldSlot = slots.default
    let gLayoutProps: any
    const { fieldValue, actions, render } = useFormArrayField(name, ({ formConfig }) => {
      const { Elements, layoutProps } = formConfig
      FieldLayout = Elements![layout as any]
      FieldElement = Elements![element as any]
      gLayoutProps = layoutProps
      return {}
    })
    const { delValue, setValue, swap } = actions
    const pop = () => delValue(fieldValue.value.length)
    const shift = () => delValue(-1)
    const push = (e: any) => setValue(fieldValue.value.length, e)
    const unshift = (e: any) => setValue(-1, e)

    const resolveElement = (p = {}) => {
      const _props = reactive({ ...props.props, ...p, fields: fieldValue, actions: { ...actions, push, unshift, pop, shift, swap } })
      return FieldElement ? [h(FieldElement), _props] : FieldSlot?.(_props)
    }
    return render(() => {
      if (FieldLayout) {
        return h(FieldLayout, {
          ...gLayoutProps,
          ...props.layoutProps,
          children: resolveElement
        })
      }
      return resolveElement()
    })
  }
})
