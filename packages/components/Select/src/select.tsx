import {defineComponent, ExtractPropTypes, ref, computed, nextTick} from "vue"
import {buildProps, definePropType} from "@wisdom-plus/utils/props";
import {DownOutlined, CheckOutlined} from "@vicons/antd"
import WpInput from "../../Input"
import WpIcon from "../../Icon"
import WpPopover from "../../Popover"
export const selectProps = buildProps({
    disabled: Boolean,
    options:{
        type:definePropType<Array<object>>([Array]),
        default:()=>[]
    },
    labelName:{
        type:definePropType<string>(String),
        default:'label'
    },
    valueName:{
        type:definePropType<string>(String),
        default:'value'
    },
    modelValue:{
        type:definePropType<Array<object> | string | number | boolean>([Array, String, Number, Boolean]),
        default:null
    },
    clearable:{
        type:definePropType<boolean>([Boolean]),
        default:false,
    },
    filterable:{
        type:definePropType<boolean>([Boolean]),
        default:false,
    },
    placeholder:{
        type:definePropType<string>([String]),
        default:null,
    },
    activeIconShow:{
        type:definePropType<boolean>([Boolean]),
        default:true,
    }
})
export type SelectProps = ExtractPropTypes<typeof selectProps>
export default defineComponent({
    name:"WpSelect",
    props:selectProps,
    inheritAttrs:false,
    setup(props,{emit}){
        const readonly = ref(true);
        const show = ref(false);
        const input = ref(null);
        const currentValue = ref(null);
        const inputChangeValue:any = ref(null);
        /**
         * 扁平化数据
         * @param bodyCellData
         * @param treeChildrenFieldName
         * @param callback
         * @param result
         * @param parent
         * @param level
         */
        const flattenDeep = (data,treeChildrenFieldName:string,callback:any = ()=>{}, result:any = [], parent:any = null,level:number = 0)=>{
            data.forEach(it=>{
                const item = ref(it);
                callback({item, parent,level, data, result});
                result.push(item.value);
                if(Object.prototype.toString.call(item.value[treeChildrenFieldName]) === '[object Array]'){
                    flattenDeep(item.value[treeChildrenFieldName], treeChildrenFieldName, callback,  result, item.value,level+1);
                }
            })
            return result;
        }
        const options = computed(()=>flattenDeep(props.options || [],'options').map(e=>{
            if(Object.prototype.toString.call(e) === '[object Object]'){
                return e;
            }else {
                const result:any = {};
                result[props.labelName] = e;
                result[props.valueName] = e;
                return result;
            }
        }).filter(item=>{
            return !inputChangeValue.value || item[props.labelName].indexOf(inputChangeValue.value) > -1
        }));
        const placeholder = ref(null)
        const setModelValue = (value)=>{
            inputChangeValue.value = null;
            placeholder.value = null;
            currentValue.value = value;
            emit('update:modelValue', value);
        }
        const valueStr = computed(()=> (props.options.find(e=>e[props.valueName] === currentValue.value) || {})[props.labelName]);
        const modelValueStr = computed(()=> (props.options.find(e=>e[props.valueName] === props.modelValue) || {})[props.labelName]);
        const optionClick = ({item, ev})=>{
            nextTick(()=> {
                if (!item.disabled) {
                    show.value = false;
                    setModelValue(item[props.valueName]);
                }
            })
        }
        const onClear = (ev)=>{
            show.value = false;
            setModelValue(null);
            ev.stopPropagation();
        }
        const onFocus = ()=>{
            currentValue.value = null;
            if(props.modelValue){
                nextTick(()=>{
                    placeholder.value = modelValueStr.value;
                })
            }
        }
        const onBlur = ()=>{
            if(props.modelValue){
                placeholder.value = props.placeholder;
                currentValue.value = props.modelValue;
            }
        }
        return {
            input,
            readonly,
            show,
            optionClick,
            valueStr,
            options,
            onClear,
            onFocus,
            onBlur,
            placeholder,
            currentValue,
            inputChangeValue,
        }
    },
    render(){
        const inputRender = ()=>(<div class={{
            'wp-select': true,
            'wp-select-show': this.show,
        }}>
            <WpInput clearable={this.$props.clearable}
                     onClear={this.onClear}
                     disabled={this.$props.disabled}
                     isSelect={true}
                     modelValue={this.valueStr}
                     onFocus={this.onFocus}
                     onBlur={this.onBlur}
                     onUpdate:modelValue={value=>this.inputChangeValue = value}
                     readonly={!this.$props.filterable && this.readonly}
                     ref={'input'}
                     placeholder={this.placeholder || this.$props.placeholder || '请选择'}
                     class={{
                         'wp-select-input': true,
                         'wp-select-show-input': this.show,
                     }}
                     v-slots={{
                         suffix: () => (<WpIcon class={{
                             'wp-select-icon': true,
                             'wp-select-show-icon-active': this.show,
                         }}><DownOutlined></DownOutlined></WpIcon>)
                     }}>
            </WpInput>
        </div>)
        return this.$props.disabled ? inputRender() :  (<WpPopover
                   v-model={this.show}
                   arrow={false}
                   placement={'bottom-start'}
                   popoverClass={'wp-select-panel-popover'}
                   v-slots={{
                        reference:()=>inputRender()
                   }}
        >
            <div class={{
                'wp-select-panel': true,
            }}>
                {this.options.map((item:any,key)=>(
                <div
                    onClick={ev=>{
                        this.optionClick({item,ev})
                    }}
                    class={{
                    'wp-select-panel-option': true,
                    'wp-select-panel-option-disabled': item.disabled,
                    'wp-select-panel-option-active': item[this.$props.valueName] === this.$props.modelValue,
                }}>
                    {this.$slots.default?.(item) || item[this.$props.labelName]}
                    {this.$props.activeIconShow && item[this.$props.valueName] === this.$props.modelValue ? <WpIcon>
                        <CheckOutlined></CheckOutlined>
                    </WpIcon> : null}
                </div>))}
                {!this.options || this.options.length === 0 ? <div class={{
                    'wp-select-panel-option': true,
                    'wp-select-panel-option-empty': true,
                }}>{this.inputChangeValue ? '无匹配数据':'暂无数据'}</div> : null}
            </div>
        </WpPopover>)
    }
})
