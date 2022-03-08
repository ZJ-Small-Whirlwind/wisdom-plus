import { computed, defineComponent, ExtractPropTypes, PropType, ref } from "vue"

import { CloseOutlined, DownOutlined } from '@vicons/antd'
import Icon from '../../Icon'
import Popover, { type PopoverProps } from '../../Popover'
import TagInput, { tagInputProps, tagInputEmits } from '../../TagInput'

export const basicSelectProps = {
    ...tagInputProps,
    popoverProps: Object as PropType<Partial<PopoverProps> & Record<any, any>>
}

export type BasicSelectProps = ExtractPropTypes<typeof basicSelectProps>

export const basicSelectEmits = tagInputEmits

export default defineComponent({
    name: 'WpBasicSelect',
    props: basicSelectProps,
    emits: basicSelectEmits,
    setup(props) {
        const show = ref(false)
        const propsMap = computed(() => {
            const final = {
                placehoder: '请选择',
                ...props
            }
            delete final.popoverProps
            return final
        })

        const hover = ref(false)

        return {
            hover,
            show,
            propsMap
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
                            {...this.propsMap as Partial<BasicSelectProps>}
                            onFocus={() => {
                                this.show = true
                            }}
                            onMouseenter={() => this.hover = true}
                            onMouseleave={() => this.hover = false}
                            auto={false}
                            v-slots={{
                                ...this.$slots,
                                'closeIcon': ({ clear }: { clear: () => void }) => (
                                    <div class="wp-taginput__clear">
                                        <div class="wp-taginput__clear-icon" onClick={e => {
                                            e.stopPropagation()
                                            if (this.clearable && this.hover) {
                                                clear()
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