import { BaseFiled, FieldToJson } from "../form/field.type"
import { FormConfig } from "../form/form.type"
import { Obj } from "../shared/type"

export type VoidField = BaseFiled & { type: "void"; userConfig: Obj }

export type VoidFieldInitInfo = { formConfig: FormConfig }
export type VoidFieldConfig = { toJson?: FieldToJson }
export type VoidFieldInit = (info: VoidFieldInitInfo) => VoidFieldConfig
