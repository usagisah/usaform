import { PropType, defineComponent } from "vue"
import { ArrayFieldActions, FormActions, FormConfig, ObjectFieldActions } from "../../index"
import { BasicArrayField, BasicForm, BasicObjectField, BasicPlainField } from "./basic"

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

export type FormArrayPlanFieldExpose = { form: FormActions; ary: ArrayFieldActions }
export const FormArrayPlanField = defineComponent({
  name: "FormArrayPlanField",
  props: {
    config: {
      type: Object as PropType<FormConfig>
    },
    name: {
      type: String,
      required: true
    },
    count: {
      type: Number
    },
    initValue: {
      type: Array
    },
    initFns: {
      type: Object
    },
    plainInitFns: {
      type: Object
    },
    unWrapperKey: {
      type: String
    }
  },
  setup(props, { expose }) {
    const _expose: any = { form: null, ary: null }
    expose(_expose)
    return () => (
      <BasicForm config={props.config} ref={e => (_expose.form = e)}>
        <BasicArrayField
          {...props}
          ref={e => (_expose.ary = e)}
          render={(item: any, index: number) => {
            return <BasicPlainField name={index.toString()} />
          }}
        />
      </BasicForm>
    )
  }
})
