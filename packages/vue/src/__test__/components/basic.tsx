import { PropType, defineComponent } from "vue"
import { FormActions, FormConfig, ObjectFieldActions, useForm, useFormObjectField, useFormPlainField } from "../../index"
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

export type FormObjectPlainFieldExpose = { form: FormActions; fields: { n: string; e: ObjectFieldActions }[] }
export const FormObjectPlainField = defineComponent({
  name: "FormObjectField",
  props: {
    config: {
      type: Object as PropType<FormConfig>
    },
    names: {
      type: Array as PropType<string[]>,
      required: true
    },
    initValue: {
      type: Object
    },
    initFns: {
      type: Object
    },
    plainInitFns: {
      type: Object
    }
  },
  setup(props, { expose }) {
    const _expose: any = { form: null, fields: [] }
    expose(_expose)
    return () => (
      <BasicForm config={props.config} ref={e => (_expose.form = e)}>
        {props.names.map(n => (
          <BasicObjectField name={n} key={n} ref={e => _expose.fields.push({ n, e })} initFns={props.initFns} initValue={props.initValue}>
            <BasicPlainField name="input" initFns={props.plainInitFns} />
          </BasicObjectField>
        ))}
      </BasicForm>
    )
  }
})
