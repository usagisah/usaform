import Schema from "async-validator"
import { SlotsType, computed, defineComponent, h, onUnmounted, reactive, shallowRef, watch, watchEffect } from "vue"
import { CFormRuleItem } from "../Form"
import { isPlainObject } from "../helper"
import { FormControllerProps, FormControllerSetValidate, FormControllerValidateState } from "./helper"
import { PlainFieldActions, ObjectFieldActions, ArrayFieldActions } from "@usaform/vue"

export interface CFormItemProps {
  // 标题
  label?: string | Record<any, any>
  // 标题宽度
  labelWidth?: string | number
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

export interface CFormSlotAttrs {
  id: string
  size: "small" | "large" | "default"
  status: string
  disabled: boolean
  onBlur: (e: any) => void
  actions?: PlainFieldActions & ObjectFieldActions & ArrayFieldActions
}

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
    const setValidate: FormControllerSetValidate = state => Object.assign(validateState, state)
    const { fieldRequired, onBlur, validate } = useRules(props.FormControllerProps, setValidate)
    expose({ validate, setValidateState: setValidate })

    const id = "ufi-id-" + randomIdCount++

    const size = computed(() => {
      return props.FormControllerProps!.layoutProps.size ?? "default"
    })

    const disabled = computed(() => {
      const { disabled } = props.FormControllerProps!.layoutProps
      if (typeof disabled === "string") return disabled.length === 0
      return !!disabled
    })

    const classNames = computed(() => {
      const { inline = false, mode = "right" } = props.FormControllerProps!.layoutProps ?? {}
      const _inline = `ufi-${inline ? "inline" : "block"}`
      const _mode = `ufi-mode-${mode ?? "right"}`
      const _required = fieldRequired.value ? "ufi-required" : ""
      const _disabled = disabled.value ? "ufi-disabled" : ""
      const _size = `ufi-size-${size.value}`
      const _status = validateState.status.length > 0 ? `ufi-status-${validateState.status}` : ""
      return ["ufi", _size, _inline, _mode, _required, _disabled, _status].join(" ").trim()
    })

    const labelStyle = computed(() => {
      const style: Record<string, string> = {}
      const { labelWidth, mode } = props.FormControllerProps!.layoutProps
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
        else if (typeof _label === "function") LabelElem = _label(labelProps)
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
  watchEffect(() => {
    setValidate({ status: "", message: "" })

    const { Rules, layoutProps } = props
    const { rules = [] } = layoutProps
    changeRules = []
    blurRules = []
    ;(rules as (string | CFormRuleItem)[]).forEach(r => {
      const _rule = typeof r === "string" ? Rules[r] : r
      if (!_rule) return
      if (!_rule.trigger) _rule.trigger = "blur"
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
