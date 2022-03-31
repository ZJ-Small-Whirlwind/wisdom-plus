import { useNamespace } from "@wisdom-plus/utils/namespace"
import { buildProps } from "@wisdom-plus/utils/props"
import {
    computed,
    defineComponent,
    ExtractPropTypes
} from "vue"

export const limitedInputProps = buildProps({
    modelValue: String,
    length: {
        type: Number,
        default: 6
    },
    password: Boolean
})

export type LimitedInputProps = ExtractPropTypes<typeof limitedInputProps>

export default defineComponent({
    name: 'WpLimitedInput',
    props: limitedInputProps,
    emits: {
        'update:modelValue': (value?: string) => (void value, true)
    },
    setup(props) {
        const { basic, is, of } = useNamespace('limited-input')
        const inputs = computed(() => {
            return new Array(props.length).fill('').map(() => {
                return (
                    <input
                        class={of('input')}
                        maxlength="1"
                        type={props.password ? 'password' : 'text'}
                        onInput={(e: Event) => {
                            const target = e.target as HTMLInputElement
                            if (target?.value === '') return
                            const next = target.nextElementSibling as HTMLInputElement
                            next?.focus()
                        }}
                        onKeydown={(e: KeyboardEvent) => {
                            const target = e.target as HTMLInputElement
                            if (e.code === 'Backspace' || e.code === 'Delete') {
                                if (target?.value === '') {
                                    e.preventDefault()
                                    const prev = target.previousElementSibling as HTMLInputElement
                                    prev?.focus()
                                }
                            }
                        }}
                    />
                )
            })
        })

        return {
            inputs,
            basic
        }
    },
    render() {
        return (
            <div class={this.basic}>
                { this.inputs }
            </div>
        )
    }
})