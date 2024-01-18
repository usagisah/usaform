import Schema from "async-validator"
import { SlotsType, computed, defineComponent, mergeProps, reactive, watch, watchEffect } from "vue"
import { CArrayFieldLayoutInfo } from "./ArrayField"
import { CFormRuleItem } from "./Form"
import { CObjectFieldLayoutInfo } from "./ObjectField"
import { CPlainFieldLayoutInfo } from "./PlainField"

export interface CFormItemProps {
  label?: string
  labelWith?: string | number
  size?: "small" | "large" | "default"
  disabled?: boolean
  inline?: boolean
  position?: "left" | "right" | "top"
  showError?: boolean
  required?: boolean
  rules?: (CFormRuleItem | string)[]
  __fieldInfo?: CPlainFieldLayoutInfo | CObjectFieldLayoutInfo | CArrayFieldLayoutInfo
}

export interface CFormItemAttrs {
  id: string
  disabled: boolean
  size: "small" | "large" | "default"
  onBlur: (e: any) => void
}

export interface CFormItemExpose {
  validate: (name: string, value: any) => Promise<any>
  setValidateState: (state: { error: boolean; message: string }) => void
}

let randomIdCount = 0
export const FormItem = defineComponent({
  name: "FormItem",
  props: ["label", "labelWith", "size", "disabled", "inline", "position", "showError", "required", "rules", "__fieldInfo"],
  inheritAttrs: true,
  slots: Object as SlotsType<{
    default: { id: string; size: string; disabled: boolean }
  }>,
  setup(props: CFormItemProps, { slots, expose }) {
    const { showError, errorState, setValidateState } = useError(props)
    const { onBlur, validate } = useRules(props, setValidateState)
    expose({ validate, setValidateState })

    const id = "ufi-id-" + randomIdCount++
    const size = computed(() => props.size ?? "default")
    const disabled = computed(() => {
      const { disabled } = props as any
      if (typeof disabled === "string") return disabled.length === 0
      return !!disabled
    })
    const classNames = computed(() => {
      const { inline, position, required, label } = props
      const _inline = `ufi-${inline ? "inline" : "block"}`
      const _position = `ufi-pos-${position ?? "right"}`
      const _required = required === true && label?.length !== 0 ? "ufi-required" : ""
      const _disabled = disabled.value ? "ufi-disabled" : ""
      const _size = `ufi-size-${size.value}`
      const _error = showError.value && errorState.error ? "ufi-error" : ""
      return ["ufi", _size, _inline, _position, _required, _disabled, _error].join(" ").trim()
    })
    const labelStyle = computed(() => {
      const { labelWith } = props
      const style = { width: "" }
      if (typeof labelWith === "string") style.width = labelWith
      else if (typeof labelWith === "number") style.width = labelWith + "px"
      else style.width = "auto"
      return style
    })

    return () => {
      const childrenProps: any = { id, size: size.value, disabled: disabled.value, onBlur }
      childrenProps.bind = childrenProps

      const _children1 = props.__fieldInfo?.children
      const _children2 = _children1 ? _children1(childrenProps) : slots.default?.(childrenProps)
      const children = (_children2 ?? []).map((c: any) => mergeProps(c, { disabled: disabled.value }))

      return (
        <div class={classNames.value}>
          {typeof props.label === "string" && (
            <label class="ufi-label" style={labelStyle.value} for={id}>
              {props.label}
            </label>
          )}
          <div class={"ufi-content"}>
            {children}
            {showError.value && errorState.error && <div class="ufi-content-error">{errorState.message}</div>}
          </div>
        </div>
      )
    }
  }
})

function useRules(props: CFormItemProps, setErrorState: (p: ErrorState) => any) {
  let _rules: CFormRuleItem[] = []
  let changeCount = 0
  let blurCount = 0
  watchEffect(() => {
    const { required, rules = [], __fieldInfo } = props
    if (!__fieldInfo) return

    const { Rules, fieldValue } = __fieldInfo
    _rules = []
    changeCount = blurCount = 0

    rules.forEach(r => {
      const _rule = typeof r === "string" ? Rules![r] : r
      if (!_rule) return
      if (required) _rule.required = true
      if (!_rule.trigger) _rule.trigger = "blur"
      _rules.push(_rule)
      _rule.trigger === "change" ? changeCount++ : blurCount++
    })

    if (required && rules.length === 0) {
      const requiredRule: CFormRuleItem = {
        message: "",
        trigger: "blur",
        validator: (_, v) => {
          if (Array.isArray(v) || typeof v === "string") return v.length !== 0
          if (v === undefined || v === null || v === false) return false
          return true
        }
      }
      _rules.push(requiredRule)
    }

    if (changeCount > 0) {
      return watch(fieldValue, v => {
        return validate(
          _rules.filter(r => r.trigger === "change"),
          "",
          v
        ).catch(() => null)
      })
    }
  })

  const validate = (rules: CFormRuleItem[], name = "", value: any) => {
    if (rules.length === 0) return Promise.resolve()
    return new Schema({ [name]: rules }).validate({ [name]: value }).then(
      () => setErrorState({ error: false, message: "" }),
      ({ errors }) => {
        setErrorState({ error: true, message: errors[0].message })
        throw errors
      }
    )
  }

  return {
    validate: (n: string, v: any) => {
      return validate(_rules, n, v)
    },
    onBlur: () => {
      validate(
        _rules.filter(r => r.trigger === "blur"),
        "",
        props.__fieldInfo!.fieldValue.value
      ).catch(() => null)
    }
  }
}

type ErrorState = {
  error: boolean
  message: string
}
function useError(props: CFormItemProps) {
  const showError = computed(() => (typeof props.showError === "boolean" ? props.showError : true))
  const errorState = reactive({ error: false, message: "" })
  const setValidateState = (state: ErrorState) => {
    if (showError.value) Object.assign(errorState, state)
  }
  return { showError, errorState, setValidateState }
}
