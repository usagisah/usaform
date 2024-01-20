import { defineComponent } from "vue"
import { useForm, useFormPlainField } from "../../index"
import { useModel } from "../hooks/useModel"

export const BasicPlainField = defineComponent({
  name: "BasicPlainField",
  props: {
    name: {
      type: String,
      required: true
    },
    initValue: {
      type: String
    },
    initFns: {
      type: Object
    }
  },
  setup(props, { expose }) {
    const { fieldValue, actions } = useFormPlainField(props.name, ({ initValue }) => {
      return { initValue: props.initValue ?? initValue, ...props.initFns }
    })
    const bind = useModel(fieldValue)
    expose(actions)
    return () => {
      return <input type="text" {...bind()} />
    }
  }
})

export const BasicForm = defineComponent({
  name: "BasicForm",
  setup(_, { slots, expose }) {
    const { FieldRender, actions } = useForm({})
    actions.provide()
    expose(actions)
    return () => {
      return <FieldRender render={slots.default} />
    }
  }
})
