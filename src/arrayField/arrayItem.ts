import { useFormActions } from "../actions/hooks"
import { FieldWrapper } from "../form/field.type"
import { isPlainObject } from "../shared/check"
import { resolveArrayItem } from "../shared/resolve"
import { ArrayEmptyItem } from "./arrayField"
import { ArrayField, ArrayItemConfig } from "./arrayField.type"

export function useFormArrayItem({ ctx, init, afterInit, index }: ArrayItemConfig): FieldWrapper<any, any> {
  const { field, root, arrayUnwrapKey } = ctx
  const { struct } = field as ArrayField

  let record: any = struct[index]
  if (isPlainObject(record) && record.__uform_aryItem_field) {
    record = record.__aryValue
  }

  const { _field, _actions } = init({ initValue: resolveArrayItem(record, arrayUnwrapKey) })
  _field.__aryValue = record
  _field.__uform_aryItem_field = true
  struct[index] = _field
  afterInit(_field, ctx, () => {
    struct[index] = ArrayEmptyItem as any
  })
  return {
    fieldValue: _field.fieldValue,
    actions: { ...useFormActions(_field, root, arrayUnwrapKey), ..._actions }
  }
}
