import { ArrayFieldActions, useFormArrayField } from "@usaform/vue"
import { SlotsType, defineComponent, h } from "vue"

export interface CArrayFieldProps {
  name: string

  initValue?: any[]

  layout?: string
  layoutProps?: Record<any, any>

  element?: string
  props?: Record<any, any>
}

export type CArrayFieldAttrs = {
  fieldValue: any[]
  actions: {
    push: (e: Record<any, any>) => void
    unshift: (e: Record<any, any>) => void
    pop: () => void
    shift: () => void
  } & ArrayFieldActions
} & Record<any, any>

export const ArrayField = defineComponent({
  name: "ArrayField",
  props: ["name", "initValue", "layout", "layoutProps", "element", "props"],
  slots: Object as SlotsType<{
    default: CArrayFieldAttrs
  }>,
  setup(props: CArrayFieldProps, { slots }) {
    const { name, layout, element } = props

    let FieldLayout: any
    let FieldElement: any
    let FieldSlot = slots.default
    let gLayoutProps: any
    const { fieldValue, actions, render } = useFormArrayField(name, ({ initValue, formConfig }) => {
      const { Elements, layoutProps } = formConfig
      FieldLayout = Elements![layout as any]
      FieldElement = Elements![element as any]
      gLayoutProps = layoutProps
      return {
        initValue: initValue ?? props.initValue,
        reset() {
          actions.set("", [])
        }
      }
    })
    const { delValue, setValue, swap } = actions
    const pop = () => delValue(fieldValue.value.length)
    const shift = () => delValue(-1)
    const push = (e: any) => setValue(fieldValue.value.length, e)
    const unshift = (e: any) => setValue(-1, e)

    const resolveElement = (p: any = {}) => {
      const { bind, ..._p } = p
      const _props = { ..._p, ...props.props, fieldValue: fieldValue.value, actions: { ...actions, push, unshift, pop, shift, swap } }
      return FieldElement ? [h(FieldElement, _props)] : FieldSlot?.(_props)
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
