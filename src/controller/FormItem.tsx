import Schema from "async-validator"
import { SlotsType, computed, defineComponent, h, onUnmounted, reactive, shallowRef, watch, watchEffect } from "vue"
import { isPlainObject } from "../shared/check"
import { CFormSlotAttrs, FormControllerProps, FormControllerSetValidate, FormControllerValidateState } from "./FormItem.type"
import { CFormRuleItem } from "./rule"

let randomIdCount = 0
export const FormItem = defineComponent({
  name: "FormItem",
  props: ["FormControllerProps"],
  inheritAttrs: true,
  slots: Object as SlotsType<{
    default: (props?: CFormSlotAttrs) => any
  }>,
  setup(props: { FormControllerProps?: FormControllerProps }, { slots, expose }) {
    if (!props.FormControllerProps) {
      return () => {
        return slots.default?.()
      }
    }

    const validateState: FormControllerValidateState = reactive({ status: "", message: "" })
    const setValidateState: FormControllerSetValidate = state => Object.assign(validateState, state)
    const { fieldRequired, onBlur, validate } = useRules(props.FormControllerProps, setValidateState)
    expose({ validate, setValidateState })

    const id = "ufi-id-" + randomIdCount++

    const size = computed(() => {
      return props.FormControllerProps!.layoutProps.size ?? "default"
    })

    const disabled = computed(() => {
      return !!props.FormControllerProps!.layoutProps.disabled
    })

    const classNames = computed(() => {
      const { inline = false, mode = "right", classNames = [] } = props.FormControllerProps!.layoutProps ?? {}
      const _inline = `ufi-${inline ? "inline" : "block"}`
      const _mode = `ufi-mode-${mode ?? "right"}`
      const _required = fieldRequired.value ? "ufi-required" : ""
      const _disabled = disabled.value ? "ufi-disabled" : ""
      const _size = `ufi-size-${size.value}`
      const _status = validateState.status.length > 0 ? `ufi-status-${validateState.status}` : ""
      return ["ufi", _size, _inline, _mode, _required, _disabled, _status, ...classNames].join(" ").trim()
    })

    const labelStyle = computed(() => {
      const style: Record<string, string> = {}
      let { labelWidth, mode } = props.FormControllerProps!.layoutProps
      labelWidth = labelWidth

      if (typeof labelWidth === "string") style.width = labelWidth
      else if (typeof labelWidth === "number") style.width = labelWidth + "px"
      else if (mode !== "top") style.width = "auto"
      return style
    })

    return () => {
      const { props: elemProps, layoutProps, children } = props.FormControllerProps!
      const { label: _label } = layoutProps

      const labelProps = { class: "ufi-label", style: labelStyle.value, id }
      let LabelElem: any = null
      if (_label) {
        if (isPlainObject(_label)) LabelElem = h(_label, labelProps)
        else if (typeof _label === "function") LabelElem = (_label as any)(labelProps)
        else {
          LabelElem = (
            <label class="ufi-label" style={labelStyle.value} for={id}>
              {_label}
            </label>
          )
        }
      }

      const _props: CFormSlotAttrs = { ...elemProps, id, size: size.value, status: validateState.status, disabled: disabled.value, onBlur }

      return (
        <div class={classNames.value}>
          {LabelElem}
          <div class="ufi-content">
            {children({ props: _props, bind: _props })}
            {validateState.status.length > 0 && <div class={`ufi-content-${validateState.status}`}>{validateState.message}</div>}
          </div>
        </div>
      )
    }
  }
})

function useRules(props: FormControllerProps, setValidate: FormControllerSetValidate) {
  const fieldRequired = shallowRef(false)
  let changeRules: CFormRuleItem[] = []
  let blurRules: CFormRuleItem[] = []
  let first = true
  watchEffect(() => {
    if (first) {
      first = false
    } else {
      setValidate({ status: "", message: "" })
    }

    const { Rules, layoutProps, actions } = props
    const { rules = [] } = layoutProps
    changeRules = []
    blurRules = []
    ;(rules as ([string, any] | CFormRuleItem)[]).forEach(r => {
      let _rule: CFormRuleItem
      let _value: any
      if (Array.isArray(r)) {
        _rule = Rules[r[0]](r[1])
        _value = r[1]
      } else {
        _rule = r
        _value = r.value
      }
      if (!_rule) return
      if (!_rule.trigger) _rule.trigger = "blur"
      if (_rule.required) fieldRequired.value = true
      if (_rule.validator) {
        const r = _rule as any
        const f = _rule.validator
        r.validator = (rule: any, value: any) => {
          return f(value, { ...rule, value: _value, actions })
        }
      }
      _rule.trigger === "change" ? changeRules.push(_rule) : blurRules.push(_rule)
    })
  })
  onUnmounted(() => {
    changeRules = []
    blurRules = []
  })

  const validate = (rules: CFormRuleItem[], name = "", value: any) => {
    if (rules.length === 0) return Promise.resolve()
    return new Schema({ [name]: rules }).validate({ [name]: value }, { firstFields: true, ...(props.formConfig.defaultValidateOption ?? {}) }).then(
      () => setValidate({ status: "", message: "" }),
      ({ errors }) => {
        setValidate({ status: "error", message: errors[0].message })
        throw errors
      }
    )
  }

  watch(
    () => props.fieldValue,
    v => {
      validate(changeRules, "", v).catch(() => null)
    }
  )

  return {
    fieldRequired,
    validate: (n: string, v: any) => {
      return validate([...blurRules, ...changeRules], n, v)
    },
    onBlur: () => {
      validate(blurRules, "", props.fieldValue.value).catch(() => null)
    }
  }
}
