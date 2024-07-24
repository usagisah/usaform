import { InternalRuleItem, RuleItem, SyncValidateResult } from "async-validator"
import { PlainFieldActions } from "../plainField/plainField.type"

export * from "async-validator"
export { default as Schema } from "async-validator"

export interface CFormRuleItem extends Omit<RuleItem, "validator" | "asyncValidator"> {
  trigger?: "change" | "blur"
  value?: any
  validator?: (value: any, options: InternalRuleItem & { value: any; actions: PlainFieldActions }) => SyncValidateResult | void
}

export interface CFormValidateError {
  path: string
  field: string
  message: string
}
