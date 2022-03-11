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
    show: () => true,
    ...tagInputEmits
}

export default defineComponent({
    name: 'WpBasicSelect',
    props: basicSelectProps,
    emits: basicSelectEmits,
    inheritAttrs: false,
    setup(props, { emit }) {
        /** if popover show */
        const show = ref(false)

        /** extends props and remove some no need */
        const propsMap = computed(() => {
            const final: Partial<BasicSelectProps> = {
                ...props
            }
            delete final.popoverProps
            delete final.showPopoverWhenDisabled
            return final
        })

        /** sync input value */
        const tagInputRef = ref()
        watch(() => props.input, () => {
            if (!tagInputRef.value) return
            tagInputRef.value.toInput(props.input)
        }, {
            immediate: true
        })

        /** is hover? */
        const hover = ref(false)

        const showPopover = () => {
            if (props.disabled && !props.showPopoverWhenDisabled) return
            show.value = true
        }

        const clear = (e: Event) => {
            if (props.disabled && !props.showPopoverWhenDisabled) return
            e.stopPropagation()
            if (props.clearable && hover.value) {
                emit('clear')
            } else {
                show.value = !show.value
            }
        }

        /**
         * When to show clear icon && if show clear icon.
         */
        const CloseIcon = computed(() => {
            const showCloseIcon = props.clearable && hover.value
            return (
                <div class="wp-taginput__clear">
                    <div class="wp-taginput__clear-icon" onClick={clear}>
                        <Icon
                            style={{
                                transform: show.value && !showCloseIcon ? 'rotate(180deg)' : '',
                                transition: '.2s'
                            }}
                        >
                            { showCloseIcon ? <CloseOutlined /> : <DownOutlined /> }
                        </Icon>
                    </div>
                </div>
            )
        })

        watch(show, () => {
            emit('show')
        })

        return {
            hover,
            clear,
            show,
            showPopover,
            propsMap,
            tagInputRef,
            CloseIcon
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
                    default: this.$slots.default,
                    reference: () => (
                        <TagInput
                            ref="tagInputRef"
                            {...this.propsMap as Partial<BasicSelectProps>}
                            {...this.$attrs}
                            onClick={this.showPopover}
                            onFocus={this.showPopover}
                            onInput={e => this.$emit('update:input', e)}
                            onClose={index => this.$emit('close', index)}
                            onMouseenter={() => this.hover = true}
                            onMouseleave={() => this.hover = false}
                            auto={false}
                            v-slots={{
                                ...this.$slots,
                                closeIcon: () => this.CloseIcon
                            }}
                        />
                    )
                }}
            />
        )
    }
})