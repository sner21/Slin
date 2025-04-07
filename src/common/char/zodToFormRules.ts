// zodToFormRules.ts
import { z } from 'zod'
import { Rule } from 'antd/lib/form'

export function zodToFormRules(schema: z.ZodType<any>): Rule[] {
  const rules: Rule[] = []

  // 处理必填
  if (schema instanceof z.ZodObject) {
    if (!schema.isOptional()) {
      rules.push({ required: true, message: '此项为必填' })
    }
  }

  // 处理字符串
  if (schema instanceof z.ZodString) {
    if (schema.minLength !== null) {
      rules.push({ min: schema.minLength, message: `最小长度为 ${schema.minLength}` })
    }
    if (schema.maxLength !== null) {
      rules.push({ max: schema.maxLength, message: `最大长度为 ${schema.maxLength}` })
    }
  }

  // 处理数字
  if (schema instanceof z.ZodNumber) {
    if (schema.minValue !== null) {
      rules.push({ min: schema.minValue, message: `最小值为 ${schema.minValue}` })
    }
    if (schema.maxValue !== null) {
      rules.push({ max: schema.maxValue, message: `最大值为 ${schema.maxValue}` })
    }
  }

  return rules
}