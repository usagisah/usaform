import { CArrayFieldLayoutInfo } from "../ArrayField"
import { CObjectFieldLayoutInfo } from "../ObjectField"
import { CPlainFieldLayoutInfo } from "../PlainField"

export type FormControllerProps = CPlainFieldLayoutInfo | CObjectFieldLayoutInfo | CArrayFieldLayoutInfo

export type FormControllerValidateState = { status: string; message: string }
export type FormControllerSetValidate = (state: FormControllerValidateState) => any
export type CFormItemExpose = {
  validate: (name: string, value: any) => Promise<any>
  setValidate: FormControllerSetValidate
}
