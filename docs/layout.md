# 表单布局 & 控制器

## 完整的数据类型

```ts
interface CFormItemProps {
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
```



## 使用

`FormItem` 默认情况下并不会启用，这是因为内部的表单字段组件有很多，具体怎么用需要自己决定

绝大多数情况我们都只会给 `PlainField` 数据字段组件设置
