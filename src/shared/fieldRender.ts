import { PropType, ShallowRef, defineComponent } from "vue"

export function createFieldRender(fieldKey: ShallowRef<number>, fieldValue: ShallowRef<unknown>) {
  let key = fieldKey.value
  return defineComponent({
    name: "FieldRender",
    props: {
      render: {
        required: false,
        type: Function as PropType<() => any>
      }
    },
    setup(props, { slots }) {
      return () => {
        if (key !== fieldKey.value) {
          key = fieldKey.value
          return fieldValue.value, null
        }
        if (props.render) return props.render?.()
        return slots.default?.()
      }
    }
  })
}
