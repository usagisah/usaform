import { PropType, defineComponent, h } from "vue"
import { FormConfig, useForm, useFormArrayField, useFormObjectField, useFormPlainField } from "../../index"
import { useModel } from "../hooks/useModel"

export const BasicForm = defineComponent({
  name: "BasicForm",
  props: {
    config: {
      type: Object as PropType<FormConfig>
    }
  },
  setup(props, { slots, expose }) {
    const { FieldRender, actions } = useForm(props.config)
    actions.provide()
    expose(actions)
    return () => {
      return <FieldRender render={slots.default} />
    }
  }
})

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
  inheritAttrs: false,
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

export const BasicObjectField = defineComponent({
  name: "BasicObjectField",
  props: {
    name: {
      type: String,
      required: true
    },
    initValue: {
      type: Object
    },
    initFns: {
      type: Object
    }
  },
  inheritAttrs: false,
  setup(props, { expose, slots }) {
    const { actions, FieldRender } = useFormObjectField(props.name, ({ initValue }) => {
      return { initValue: props.initValue ?? initValue, ...props.initFns }
    })
    expose(actions)
    return () => {
      return <FieldRender render={slots.default} />
    }
  }
})

export const BasicArrayField = defineComponent({
  name: "BasicArrayField",
  props: {
    name: {
      type: String,
      required: true
    },
    render: {
      type: Function,
      required: true
    },
    initValue: {
      type: Array
    },
    count: {
      type: Number
    },
    initFns: {
      type: Object
    },
    unWrapperKey: {
      type: String
    }
  },
  inheritAttrs: false,
  setup(props, { expose }) {
    const { fieldValue, actions, FieldRender } = useFormArrayField(props.name, ({ initValue }) => {
      return {
        initValue: props.initValue ?? initValue ?? new Array(props.count).fill(0).map((_, i) => ({ id: i, [props.unWrapperKey ?? "value"]: i.toString() })),
        ...props.initFns
      }
    })
    expose(actions)
    return () => {
      const _render = () => {
        return fieldValue.value.map((item, index) => h(props.render(item, index), { key: item.id }))
      }
      return <FieldRender render={_render} />
    }
  }
})
