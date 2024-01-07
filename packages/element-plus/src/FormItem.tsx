import Schema, { RuleItem } from "async-validator"
import { SlotsType, computed, defineComponent, h, reactive, watchEffect } from "vue"

export interface FormItemProps {
  label?: string
  labelWith?: string | number
  size?: "small" | "large" | "default"
  required?: boolean
  rules?: (RuleItem | string)[]
  Rules?: Record<string, RuleItem>
  disabled?: boolean
  inline?: boolean
  position?: "left" | "right" | "top"
  showError?: boolean
  children?: (p: any) => any[]
}

export interface FormItemExpose {
  validate: Validate
  setValidateState: (state: { error: boolean; message: string }) => void
}

let randomIdCount = 0
export const FormItem = defineComponent({
  name: "FormItem",
  props: ["label", "labelWith", "size", "required", "rules", "Rules", "disabled", "inline", "position", "showError", "children"],
  inheritAttrs: true,
  slots: Object as SlotsType<{
    default?: { id: string; size: string; disabled: boolean }
  }>,
  setup(props: FormItemProps, { slots, expose }) {
    const { showError, errorState, setValidateState } = useError(props)
    const { onChange, validate } = useRules(props, setValidateState)
    expose({ validate, setValidateState })

    const id = "ufi-id-" + randomIdCount++
    const size = computed(() => props.size ?? "default")
    const classNames = computed(() => {
      const { inline, position, required, disabled, label } = props
      const _inline = `ufi-${inline ? "inline" : "block"}`
      const _position = `ufi-pos-${position ?? "right"}`
      const _required = required === true && label?.length !== 0 ? "ufi-required" : ""
      const _disabled = disabled ? "ufi-disabled" : ""
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
    const contentProps = computed<any>(() => ({ id, size: size.value, disabled: !!props.disabled, onChange }))

    return () => {
      const children = (props.children ? props.children(contentProps.value) : slots.default?.(contentProps.value)) ?? []
      return (
        <div class={classNames.value}>
          {typeof props.label === "string" && (
            <label class="ufi-label" style={labelStyle.value} for={id}>
              {props.label}
            </label>
          )}
          <div class={"ufi-content"}>
            {children.map(c => h(c, contentProps.value))}
            {showError.value && errorState.error && <div class="ufi-content-error">{errorState.message}</div>}
          </div>
        </div>
      )
    }
  }
})

type Validate = (name: string, value: any) => Promise<any>
function useRules(props: FormItemProps, setErrorState: (p: ErrorState) => any) {
  let rules: RuleItem[] = []
  watchEffect(() => {
    const { Rules, required } = props
    const _rules = (props.rules ?? []) as RuleItem[]
    rules = []
    _rules.forEach(r => {
      const _rule = typeof r === "string" ? Rules![r] : r
      if (required) _rule.required = true
      rules.push(_rule)
    })
    if (required && rules.length === 0) {
      rules.push({
        message: "The field is required",
        validator: (_, v) => {
          return Array.isArray(v) ? v.length !== 0 : (v + "").length !== 0
        }
      })
    }
  })

  const validate: Validate = (name: string, value: any) => {
    return new Schema({ [name]: rules }).validate({ [name]: value }).catch((e: any) => {
      throw e.errors
    })
  }

  const onChange = (e: any) => {
    if (e instanceof Event) return
    if (rules.length === 0) return
    validate("f", e).then(
      () => setErrorState({ error: false, message: "" }),
      e => setErrorState({ error: true, message: e[0].message })
    )
  }
  return { onChange, validate }
}

type ErrorState = {
  error: boolean
  message: string
}
function useError(props: FormItemProps) {
  const showError = computed(() => (typeof props.showError === "boolean" ? props.showError : true))
  const errorState = reactive({ error: false, message: "" })
  const setValidateState = (state: ErrorState) => {
    if (showError.value) Object.assign(errorState, state)
  }
  return { showError, errorState, setValidateState }
}
