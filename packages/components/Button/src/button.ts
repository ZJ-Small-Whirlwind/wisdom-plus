import { useFormItemProps } from '@wisdom-plus/hooks'
import { buildProps, definePropType } from '@wisdom-plus/utils/props'
import type { ExtractPropTypes, Component, PropType } from 'vue'
import type button from './buttonElement'

export const buttonType = [
  'default',
  'primary',
  'success',
  'warning',
  'info',
  'danger',
  'text',
  '',
] as const
export const buttonSize = ['', 'large', 'medium', 'small', 'mini'] as const
export const buttonNativeType = ['button', 'submit', 'reset'] as const

export const buttonProps = buildProps({
  ...useFormItemProps,
  type: {
    type: String,
    values: buttonType,
    default: '',
  },
  icon: {
    type: definePropType<string | Component>([String, Object]),
    default: '',
  },
  nativeType: {
    type: String,
    values: buttonNativeType,
    default: 'button',
  },
  loading: Boolean,
  plain: Boolean,
  autofocus: Boolean,
  round: Boolean,
  circle: Boolean,
  color: String,
  autoInsertSpace: {
    type: Boolean,
  },
  iconPlacement: {
    type: definePropType<'left' | 'right'>([String])
  },
  countdown: {
      type: [Boolean, Number],
      default:null
  }
} as const)

export interface ButtonConfigContext {
  autoInsertSpace?: boolean
}

export const buttonEmits = {
  click: (evt: MouseEvent, next?:any) => evt instanceof MouseEvent,
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
export type ButtonEmits = typeof buttonEmits

export type ButtonType = ButtonProps['type']
export type ButtonNativeType = ButtonProps['nativeType']

export type ButtonInstance = InstanceType<typeof button>
