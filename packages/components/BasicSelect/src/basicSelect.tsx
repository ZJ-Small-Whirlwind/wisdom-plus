import { computed, defineComponent, ExtractPropTypes, PropType, ref, watch, Component, h } from "vue"

import { CloseOutlined, DownOutlined } from '@vicons/antd'
import Icon from '../../Icon'
import Popover, { type PopoverProps } from '../../Popover'
import TagInput, { tagInputProps, tagInputEmits } from '../../TagInput'

export const basicSelectProps = {
    ...tagInputProps,
    input: String,
    popoverProps: Object as PropType<Partial<PopoverProps> & Record<any, any>>,
    showPopoverWhenDisabled: Boolean,
    arrowIcon: {
        type: Object as PropType<Component>,
        default: () => DownOutlined
    }
}

export type BasicSelectProps = ExtractPropTypes<typeof basicSelectProps>

export const basicSelectEmits = {
    'update:input': (value: string) => (void value, true),
    clear: () => true,
    show: () => true,
    ...tagInputEmits
}

const focusNow = ref<symbol>()

export default defineComponent({
    name: 'WpBasicSelect',
    props: basicSelectProps,
    emits: basicSelectEmits,
    inheritAttrs: false,
    setup(props, { emit }) {
        /** if popover show */
        const show = ref(false)
        const id = Symbol()

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
                                transform: show.value && !showCloseIcon && DownOutlined === props.arrowIcon ? 'rotate(180deg)' : '',
                                transition: '.2s'
                            }}
                        >
                            { showCloseIcon && !props.disabled ? <CloseOutlined /> : h(props.arrowIcon) }
                        </Icon>
                    </div>
                </div>
            )
        })

        watch(focusNow, () => {
            if (focusNow.value !== id) {
                show.value = false
            }
        })

        watch(show, () => {
            if (show.value) {
                focusNow.value = id
            }
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
                            onBlur={e => {
                                this.$emit('blur', e)
                                if (!this.tagInputRef) return
                                this.tagInputRef.toInput(this.input)
                            }}
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