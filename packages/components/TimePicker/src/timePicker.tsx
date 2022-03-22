import { useNamespace } from "@wisdom-plus/utils/namespace"
import { buildProps } from "@wisdom-plus/utils/props"
import { useAutoControl } from "@wisdom-plus/utils/use-control"
import { ref, defineComponent, ExtractPropTypes, watch, nextTick, onMounted } from "vue"
import BasicSelect, { basicSelectProps } from '../../BasicSelect'
import Panel, { timePanelProps } from './timePanel'
import Space from '../../Space'
import dayjs from 'dayjs'

import { AccessTimeFilled } from '@vicons/material'
import { useFormItem } from "@wisdom-plus/hooks"

const timePickerPropsMap = buildProps({
    size: basicSelectProps['size'],
    disabled: Boolean,
    clearable: Boolean,
    showFormat: {
        type: String,
        default: 'HH:mm:ss'
    },
    placeholder: {
        type: String,
        default: '请输入时间'
    },
    validateEvent: {
        type: Boolean,
        default: true
    }
})

export const timePickerProps = {
    ...timePickerPropsMap,
    ...timePanelProps
}
export type TimePickerProps = ExtractPropTypes<typeof timePickerProps>

export default defineComponent({
    name: 'WpTimePicker',
    props: timePickerProps,
    emits: {
        'update:modelValue': (value: Date | string) => (void value, true)
    },
    setup(props, { emit }) {
        const { basic, is } = useNamespace('time-picker')
        const panelRef = ref<InstanceType<typeof Panel>>()
        const basicSelectRef = ref<InstanceType<typeof BasicSelect>>()

        const formItem = useFormItem({})

        const timeRef = ref(dayjs().set('hours', 0).set('minutes', 0).set('seconds', 0))
        const time = useAutoControl(timeRef, props, 'modelValue', emit)
        const timeShow = ref('')

        const getDayjs = () => {
            return props.format && typeof time.value === 'string' ? dayjs(`${dayjs().format('YYYY-MM-DD')} ${time.value}`, `YYYY-MM-DD ${props.format}`) : dayjs(time.value)
        }
        const refreshValue = () => {
            if (!time.value) {
                timeShow.value = ''
            } else {
                timeShow.value = getDayjs().format(props.showFormat)
            }
        }

        watch(time, () => {
            nextTick(refreshValue)
        })

        onMounted(refreshValue)

        watch(timeShow, () => {
            time.value = timeShow.value
        })

        watch(time, () => {
            if (props.validateEvent) formItem.formItem?.validate('change')
        })

        return {
            basic,
            is,
            time,
            timeShow,
            panelRef,
            refreshValue,
            basicSelectRef,
            getDayjs
        }
    },
    expose: ['getDayjs'],
    render() {
        return (
            <BasicSelect
                ref="basicSelectRef"
                disabled={this.disabled}
                clearable={this.clearable}
                size={this.size}
                popoverProps={{
                    width: undefined,
                    class: this.is('popover')
                }}
                class={this.basic}
                onBlur={this.refreshValue}
                onClear={() => {
                    this.time = ''
                }}
                v-model:input={this.timeShow}
                arrowIcon={AccessTimeFilled}
                placeholder={this.placeholder}
            >
                <div class={this.is('wrapper')}>
                    <Panel ref='panelRef' v-model={this.time} format={this.format} use12Hours={this.use12Hours} layout={this.layout} />
                    {this.$slots.extra?.()}
                    <div class={this.is('footer')}>
                        <Space justify={'space-around'}>
                            <a onClick={() => {
                                this.time = new Date()
                            }}>
                                此刻
                            </a>
                            <a onClick={() => {
                                this.timeShow = this.getDayjs().format(this.showFormat)
                                if (this.basicSelectRef) {
                                    this.basicSelectRef.show = false
                                }
                            }}>
                                确定
                            </a>
                        </Space>
                    </div>
                </div>
            </BasicSelect>
        )
    }
})
