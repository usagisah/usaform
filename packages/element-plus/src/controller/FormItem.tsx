import Schema from "async-validator"
import { SlotsType, cloneVNode, computed, defineComponent, onUnmounted, reactive, shallowRef, watch, watchEffect } from "vue"
import { CFormRuleItem } from "../Form"
import { FormControllerProps, FormControllerSetValidate, FormControllerValidateState } from "./helper"

export interface CFormItemProps {
  // 标题
  label?: string
  // 标题宽度
  labelWith?: string | number
  // 尺寸
  size?: "small" | "large" | "default"
  // 禁用
  disabled?: boolean
  // 布局模式
  mode?: "left" | "right" | "top"
  // 设置容器为行内
  inline?: boolean
  // 当前字段的校验规则
  rules?: (CFormRuleItem | string)[]
}

export interface CFormItemAttrs {
  id: string
  disabled: boolean
  size: "small" | "large" | "default"
  onBlur: (e: any) => void
}

let randomIdCount = 0
export const FormItem = defineComponent({
  name: "FormItem",
  props: ["FormControllerProps"],
  inheritAttrs: true,
  slots: Object as SlotsType<{
    default: (props: { id: string; size: string; disabled: boolean }) => any
  }>,
  setup(props: { FormControllerProps: FormControllerProps }, { slots, expose }) {
    if (!props.FormControllerProps) throw "<FormItem/>必须被用于字段组件内"

    const validateState: FormControllerValidateState = reactive({ status: "", message: "" })
    const setValidate: FormControllerSetValidate = state => Object.assign(validateState, state)
    const { fieldRequired, onBlur, validate } = useRules(props.FormControllerProps, setValidate)
    expose({ validate, setValidateState: setValidate })

    const id = "ufi-id-" + randomIdCount++
    const size = computed(() => props.FormControllerProps.layoutProps.size ?? "default")
    const disabled = computed(() => {
      const { disabled } = props.FormControllerProps.layoutProps
      if (typeof disabled === "string") return disabled.length === 0
      return !!disabled
    })

    const classNames = computed(() => {
      const { inline, mode, label } = props.FormControllerProps.layoutProps
      const _inline = `ufi-${inline ? "inline" : "block"}`
      const _mode = `ufi-mode-${mode ?? "right"}`
      const _required = fieldRequired.value && label?.length !== 0 ? "ufi-required" : ""
      const _disabled = disabled.value ? "ufi-disabled" : ""
      const _size = `ufi-size-${size.value}`
      const _status = validateState.status.length > 0 ? `ufi-status-${validateState}` : ""
      return ["ufi", _size, _inline, _mode, _required, _disabled, _status].join(" ").trim()
    })

    const labelStyle = computed(() => {
      const { labelWith } = props.FormControllerProps.layoutProps
      const style = { width: "" }
      if (typeof labelWith === "string") style.width = labelWith
      else if (typeof labelWith === "number") style.width = labelWith + "px"
      else style.width = "auto"
      return style
    })

    const childrenContent = computed(() => {
      const p = { id, size: size.value, onBlur }
      return props.FormControllerProps.children({ props: { ...p }, bind: { ...p } }).map((c: any) => cloneVNode(c, { disabled: disabled.value }))
    })

    return () => {
      const { label } = props.FormControllerProps.layoutProps
      return (
        <div class={classNames.value}>
          {typeof label === "string" && (
            <label class="ufi-label" style={labelStyle.value} for={id}>
              {label}
            </label>
          )}
          <div class={"ufi-content"}>
            {childrenContent.value}
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
  watchEffect(() => {
    const { Rules, layoutProps } = props
    const { rules = [] } = layoutProps
    changeRules = []
    blurRules = []
    ;(rules as (string | CFormRuleItem)[]).forEach(r => {
      const _rule = typeof r === "string" ? Rules[r] : r
      if (!_rule) return
      if (!_rule.trigger) _rule.trigger = "change"
      if (_rule.required) fieldRequired.value = true
      _rule.trigger === "change" ? changeRules.push(_rule) : blurRules.push(_rule)
    })
  })
  onUnmounted(() => {
    changeRules = []
    blurRules = []
  })

  const validate = (rules: CFormRuleItem[], name = "", value: any) => {
    if (rules.length === 0) return Promise.resolve()
    return new Schema({ [name]: rules }).validate({ [name]: value }).then(
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
