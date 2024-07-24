import { FormBaseActions } from "../actions/hooks"
import { Obj } from "../shared/type"
import { FieldToJson } from "./field.type"

export type FormConfig = {
  defaultFormData?: Obj
  arrayUnwrapKey?: string | string[]
  toJson?: FieldToJson
} & Obj

export type FormActions = FormBaseActions & {
  provide: () => void
}
