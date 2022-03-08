import { computed, defineComponent, ExtractPropTypes, PropType, ref, watch } from "vue"

import { CloseOutlined, DownOutlined } from '@vicons/antd'
import Icon from '../../Icon'
import Popover, { type PopoverProps } from '../../Popover'
import TagInput, { tagInputProps, tagInputEmits } from '../../TagInput'

export const basicSelectProps = {
    ...tagInputProps,
    input: String,
    popoverProps: Object as PropType<Partial<PopoverProps> & Record<any, any>>,
    showPopoverWhenDisabled: Boolean
}

export type BasicSelectProps = ExtractPropTypes<typeof basicSelectProps>

export const basicSelectEmits = {
    'update:input': (value: string) => (void value, true),
    clear: () => true,
    ...tagInputEmits
}

export default defineComponent({
    name: 'WpBasicSelect',
    props: basicSelectProps,
    emits: basicSelectEmits,
    setup(props) {
        const show = ref(false)
        const propsMap = computed(() => {
            const final: Partial<BasicSelectProps> = {
                ...props
            }
            delete final.popoverProps
            delete final.showPopoverWhenDisabled
            return final
        })

        const tagInputRef = ref()
        watch(() => props.input, () => {
            if (!tagInputRef.value) return
            tagInputRef.value.toInput(props.input)
        }, {
            immediate: true
        })

        const hover = ref(false)

        return {
            hover,
            show,
            propsMap,
            tagInputRef
        }
    },
    render() {
        return (
            <Popover
                v-model={this.show}
                trigger={'none'}
                placement={'bottom'}
                width={300}
                {...this.popoverProps}
                v-slots={{
                    reference: () => (
                        <TagInput
                            ref="tagInputRef"
                            {...this.propsMap as Partial<BasicSelectProps>}
                            onClick={() => {
                                if (this.disabled && !this.showPopoverWhenDisabled) return
                                this.show = true
                            }}
                            onFocus={() => {
                                if (this.disabled && !this.showPopoverWhenDisabled) return
                                this.show = true
                            }}
                            onInput={e => {
                                this.$emit('update:input', e)
                            }}
                            onMouseenter={() => this.hover = true}
                            onMouseleave={() => this.hover = false}
                            auto={false}
                            v-slots={{
                                ...this.$slots,
                                'closeIcon': () => (
                                    <div class="wp-taginput__clear">
                                        <div class="wp-taginput__clear-icon" onClick={e => {
                                            e.stopPropagation()
                                            if (this.clearable && this.hover) {
                                                this.$emit('clear')
                                            } else {
                                                this.show = !this.show
                                            }
                                        }}>
                                            <Icon style={{
                                                transform: this.show && !(this.clearable && this.hover) ? 'rotate(180deg)' : '',
                                                transition: '.4s'
                                            }}>
                                                {
                                                    this.clearable && this.hover ? (
                                                        <CloseOutlined />
                                                    ) : (
                                                        <DownOutlined />
                                                    )
                                                }
                                            </Icon>
                                        </div>
                                    </div>
                                )
                            }}
                        />
                    )
                }}
            >
                { this.$slots.default?.() }
            </Popover>
        )
    }
})