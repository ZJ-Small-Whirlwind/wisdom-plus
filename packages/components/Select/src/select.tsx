import {defineComponent, ExtractPropTypes, ref, computed} from "vue"
import {buildProps, definePropType} from "@wisdom-plus/utils/props";
import {DownOutlined} from "@vicons/antd"
import WpInput from "../../Input"
import WpIcon from "../../Icon"
import WpPopover from "../../Popover"
export const selectProps = buildProps({
    options:{
        type:definePropType<Array<object>>([Array]),
        default:()=>[]
    }
})
export type SelectProps = ExtractPropTypes<typeof selectProps>
export default defineComponent({
    name:"WpSelect",
    props:selectProps,
    setup(){
        const readonly = ref(true);
        const show = ref(false);
        const input = ref(null);
        const dark = ref(false);
        return {
            input,
            readonly,
            show,
            dark,
        }
    },
    render(){
        return (<WpPopover
                   placement={'bottom-start'}
                   arrow={false}
                   v-slots={{
                        reference:()=>(<div class={{
                            'wp-select': true,
                            'wp-select-show': this.show,
                        }}>
                            <WpInput readonly={this.readonly} ref={'input'} placeholder={'请选择'} class={{
                                'wp-select-input': true,
                                'wp-select-show-input': this.show,
                            }} v-slots={{
                                suffix: () => (<WpIcon class={{
                                    'wp-select-icon': true,
                                    'wp-select-show-icon-active': this.show,
                                }}><DownOutlined></DownOutlined></WpIcon>)
                            }}></WpInput>
                        </div>)
                   }}
        >asdasd----{String(this.show)}
        </WpPopover>)
    }
})
