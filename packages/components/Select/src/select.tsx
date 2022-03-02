import {defineComponent, ExtractPropTypes, ref, computed, h} from "vue"
import {buildProps, definePropType} from "@wisdom-plus/utils/props";
import {DownOutlined} from "@vicons/antd"
import WpInput from "../../Input"
import WpIcon from "../../Icon"
import WpButton from "../../Button"
import WpPopover from "../../Popover"
export const selectProps = buildProps({
    options:{
        type:definePropType<Array<object>>([Array]),
        default:()=>[]
    },
    labelName:{
        type:definePropType<string>(String),
        default:'label'
    },
    modelValue:{
        type:definePropType<Array<object> | string | number | boolean>([Array, String, Number, Boolean]),
        default:null
    }
})
export type SelectProps = ExtractPropTypes<typeof selectProps>
export default defineComponent({
    name:"WpSelect",
    props:selectProps,
    inheritAttrs:false,
    setup(){
        const readonly = ref(true);
        const show = ref(true);
        const input = ref(null);
        const valueStr = computed(()=>"asdas");
        const optionClick = ({item,ev})=>{
            show.value = false;
            console.log(item)
        }
        return {
            input,
            readonly,
            show,
            optionClick,
            valueStr,
        }
    },
    render(){
        return (<WpPopover
                   v-model={this.show}
                   placement={'bottom-start'}
                   arrow={false}
                   popoverClass={'wp-select-panel-popover'}
                   v-slots={{
                        reference:()=>(<div class={{
                            'wp-select': true,
                            'wp-select-show': this.show,
                        }}>
                            <WpInput v-model={this.valueStr} readonly={this.readonly} ref={'input'} placeholder={'请选择'} class={{
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
        >
            <div class={{
                'wp-select-panel': true,
            }}>
                {this.$props.options.map(item=>(
                <div
                    onClick={ev=>this.optionClick({item,ev})}
                    class={{
                    'wp-select-panel-option': true,
                }}>
                    {this.$props.labelName}
                    {item[this.$props.labelName]}
                </div>))}
            </div>
        </WpPopover>)
    }
})
