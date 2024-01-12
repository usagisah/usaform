import { defineComponent } from "vue"
import { useForm, useFormArrayField, useFormObjectField, useFormPlainField } from "../../dist/index"

export const ArrayField = defineComponent({
  setup() {
    const { fieldValue, actions } = useFormArrayField("array", ({ initValue }) => {
      return {
        message: () => "array"
      }
    })
    actions.setValue(99, { value: { plain: 90 } })
    return () =>
      fieldValue.value.map((_, index) => (
        <ObjectField index={index}>
          <PlainField />
        </ObjectField>
      ))
  }
})

export const ObjectField = defineComponent({
  props: ["index"],
  setup(props, { slots }) {
    useFormObjectField(props.index, () => {
      return {
        message: () => "array"
      }
    })
    return () => slots.default?.()
  }
})

export const PlainField = defineComponent({
  setup() {
    const { fieldValue } = useFormPlainField("plain", ({ initValue }) => {
      return {
        initValue: initValue ?? 1,
        message: () => "plain"
      }
    })
    const add = () => fieldValue.value++
    return () => <button onClick={add}>{fieldValue.value}</button>
  }
})

export const BasicForm = defineComponent({
  setup(props, { expose }) {
    const { actions, render } = useForm({})
    actions.provide()
    expose(actions)
    return render(() => {
      return <ArrayField />
    })
  }
})
