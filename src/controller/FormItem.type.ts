import { ArrayFieldActions, CArrayFieldLayoutInfo } from "../arrayField/arrayField.type"
import { CObjectFieldLayoutInfo, ObjectFieldActions } from "../objectField/objectField.type"
import { CPlainFieldLayoutInfo, PlainFieldActions } from "../plainField/plainField.type"
import { CFormRuleItem } from "./rule"

export type FormControllerProps = CPlainFieldLayoutInfo | CObjectFieldLayoutInfo | CArrayFieldLayoutInfo

export type FormControllerValidateState = { status: string; message: string }
export type FormControllerSetValidate = (state: FormControllerValidateState) => any
export type CFormItemExpose = {
  validate: (name: string, value: any) => Promise<any>
  setValidate: FormControllerSetValidate
}

export interface CFormItemProps {
  // 标题
  label?: string | Record<any, any> | ((...props: any[]) => any)
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
  rules?: (CFormRuleItem | [string] | [string, any])[]
  // 自定义布局 class
  classNames?: string[]
}

export interface CFormSlotAttrs {
  id: string
  size: "small" | "large" | "default"
  status: string
  disabled: boolean
  onBlur: (e: any) => void
  actions?: PlainFieldActions & ObjectFieldActions & ArrayFieldActions
}
