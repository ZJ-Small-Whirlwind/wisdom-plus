import {defineComponent, ExtractPropTypes, ref, computed, nextTick, watch, inject} from "vue"
import {buildProps, definePropType} from "@wisdom-plus/utils/props";
import {DownOutlined, CheckOutlined} from "@vicons/antd"
import WpInput from "../../Input"
import WpIcon from "../../Icon"
import WpPopover,{popoverProps, PopoverProps} from "../../Popover"
import WpTag from "../../Tag"
import { useFormItem } from "@wisdom-plus/hooks";
import dayjs from "dayjs";
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
        type:definePropType<Array<object> | string | number | boolean | object>([Array, String, Number, Boolean, Object]),
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
    },
    multiple:{
        type:definePropType<boolean>([Boolean]),
        default:false,
    },
    collapseTags:{
        type:definePropType<boolean>([Boolean]),
        default:false,
    },
    remote:{
        type:definePropType<(value:null)=>object[]>([Function]),
        default:null,
    },
    PopoverConfig:{
        type:definePropType<PopoverProps>(null),
        default:()=>({}),
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
        const input:any = ref(null);
        const currentValue:any = ref(null);
        const inputChangeValue:any = ref(null);
        const remoteDatas:any = ref(null);
        const remoteSelectMapDatas:any = ref({});
        // ????????????????????????????????????
        const notClearInputValue = inject("notClearInputValue", false)
        const notClearInputValueFormat = inject("notClearInputValueFormat", "YYYY-MM-DDTHH:mm:ss")
        const showInputClass = inject("showInputClass", false)
        /**
         * ???????????????
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
        const propsOptionsSource = computed(()=>{
            return flattenDeep((props.options || []).concat(remoteDatas.value || []),'options',({item, parent})=>{
                if(Object.prototype.toString.call(item.value) === '[object Object]'){
                    // ????????????id
                    item.value[props.valueName] = item.value[props.valueName] || `${Date.now()}-${Math.random()*10000}-${Math.random()*10000}`;
                    if(parent && Object.prototype.toString.call(parent) === '[object Object]'){
                        item.value.disabled = (parent && parent.disabled === true ? true : item.value.disabled);
                    }
                }
            });
        })
        const optionsCopyFlatten = computed(()=>propsOptionsSource.value.map(e=>{
            if(Object.prototype.toString.call(e) === '[object Object]'){
                return e;
            }else {
                const result:any = {};
                result[props.labelName] = e;
                result[props.valueName] = e;
                return result;
            }
        }))
        const options = computed(()=>optionsCopyFlatten.value.filter(item=>{
            if(remoteDatas.value){
                return item.$$isRemote;
            }
            return !inputChangeValue.value || item[props.labelName].indexOf(inputChangeValue.value) > -1
        }));
        const optionsMaps = computed(()=>(optionsCopyFlatten.value || []).reduce((a,b, k)=>{
            a[b[props.valueName] || k] = b;
            return a;
        }, remoteSelectMapDatas.value || {}))
        const placeholder = ref(null)
        const { formItem } = useFormItem({})
        const setModelValue = (value, isClear:boolean = false, isWatch:boolean = false, isAppend:boolean = true, index?:any)=>{
            if(!props.multiple || (props.multiple && !props.filterable)){
                inputChangeValue.value = null;
            }
            placeholder.value = null;
            if(isWatch){
                remoteDatas.value = null;
            }
            if(isClear){
                remoteSelectMapDatas.value = {};
                input.value.input = '';
                inputChangeValue.value = null;
            }
            if(props.multiple){
                value = value || [];
            }
            if(props.multiple && !isClear){
                if(isWatch){
                    currentValue.value = value;
                }else {
                    currentValue.value = currentValue.value || [];
                    if(isAppend){
                        const key = currentValue.value.indexOf(value);
                        if(key > -1){
                            currentValue.value.splice(key,1);
                        }else {
                            currentValue.value.push(value);
                        }
                    }else {
                        currentValue.value.splice(index,1);
                    }
                }
                emit('update:modelValue', currentValue.value);
                emit('change',  currentValue.value);
            }else {
                currentValue.value = value;
                emit('update:modelValue', value);
                emit('change', value);
            }
            formItem?.validate('change')
        }
        watch(inputChangeValue,(val)=>{
            if(val && props.filterable && Object.prototype.toString.call(props.remote) === '[object Function]'){
                show.value = true;
                const result:Promise<any> = props.remote(val);
                if(Object.prototype.toString.call(result) === '[object Promise]'){
                    result.then(res=>{
                        if(Object.prototype.toString.call(res) === '[object Array]'){
                            remoteDatas.value = res.map(e=>{
                                e.$$isRemote = true;
                                return e;
                            });
                        }else {
                            remoteDatas.value = null;
                        }
                    }).catch(()=>{
                        remoteDatas.value = null;
                    })
                }else {
                    remoteDatas.value = null;
                }
            }else {
                remoteDatas.value = null;
            }
        })
        watch(computed(()=>props.modelValue),(value)=>{
            setModelValue(value, false, true);
        },{immediate:true})
        watch(computed(()=>props.options),()=>{
            setModelValue(null, true, true);
        })
        const valueStr = computed(()=> {
            const res = props.multiple ? {} : (optionsMaps.value[currentValue.value] || {})
            return res[props.labelName] || res[props.valueName]
        });
        const modelValueStr = computed(()=> {
            const res = (optionsMaps.value[props.modelValue] || {})
            return props.multiple ? {} : res[props.labelName] || res[props.valueName]
        });
        const currentValueMultipleTags = computed(()=>{
            if(props.multiple){
                const result = (currentValue.value || []).map(value=>{
                    const op = (optionsMaps.value[value] || {})
                    return op[props.labelName] || op[props.valueName]
                });
                if(props.collapseTags && result.length > 1){
                    return  result.slice(0,1).concat(["+"+(result.length - 1)]);
                }else {
                    return result;
                }
            }else{
                return currentValue.value
            }
        });
        const optionClick = ({item, ev})=>{
            nextTick(()=> {
                if (!item.disabled && Object.prototype.toString.call(item.options) !== '[object Array]') {
                    if(!props.multiple){
                        show.value = false;
                    }
                    if(item.$$isRemote){
                        remoteSelectMapDatas[item[props.valueName]] = item;
                    }
                    setModelValue(item[props.valueName]);
                }
            })
        }
        const onClear = (ev)=>{
            show.value = false;
            setModelValue(null, true);
            ev.stopPropagation();
            emit('clear', null)
        }

        const onFocus = ()=>{
            if(props.filterable){
                if(!props.multiple && !notClearInputValue){
                    currentValue.value = null;
                }
                if(props.modelValue && !props.multiple){
                    nextTick(()=>{
                        placeholder.value = modelValueStr.value;
                    })
                }
            }
            nextTick(()=>{
                emit('focus', currentValue.value)
            })
        }
        const onBlur = ()=>{
            if(props.filterable) {
                if(notClearInputValue && inputChangeValue.value){
                    const isValid = dayjs(inputChangeValue.value, notClearInputValueFormat).isValid();
                    placeholder.value = props.placeholder;
                    if(isValid){
                        setModelValue(inputChangeValue.value, false);
                    }else {
                        if (props.modelValue ) {
                            setModelValue(props.modelValue, true);
                        }
                    }
                    return;
                }
                if (props.modelValue ) {
                    placeholder.value = props.placeholder;
                    currentValue.value = props.modelValue;
                }
            }
            nextTick(()=>{
                emit('blur', currentValue.value)
            })
        }
        const onTagsClose = (value, k)=>{
            setModelValue(value, false, false, false, k);
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
            currentValueMultipleTags,
            onTagsClose,
            showInputClass,
        }
    },
    render(){
        const inputSuffixRender = ()=>(<WpIcon class={{
            'wp-select-icon': true,
            'wp-select-show-icon-active': this.show,
        }}><DownOutlined></DownOutlined></WpIcon>);
        const inputPrefixIconRender = ()=>this.$slots.prefixIcon?.() ? (<div class={{
            'wp-select-input-prefix-icon': true,
        }}>{this.$slots.prefixIcon?.()}</div>): null
        const inputMultiplePrefixRender = ()=>this.$props.multiple ? [
            inputPrefixIconRender(),
            (this.currentValueMultipleTags || []).map((value, k)=>(
                <WpTag closable={!this.$props.disabled && (!this.$props.collapseTags || (this.$props.collapseTags && k === 0))} onClose={()=>this.onTagsClose(value, k)}>{value}</WpTag>
            ))
        ] : inputPrefixIconRender();
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
                     placeholder={this.placeholder || this.$props.placeholder || '?????????'}
                     class={{
                         'wp-select-input': true,
                         'wp-select-show-input': this.show || this.showInputClass,
                         'wp-select-input-multiple': this.$props.multiple,
                         'wp-select-input-multiple-collapse-tags': this.$props.collapseTags,
                         'wp-select-input-multiple-not-tags': (this.currentValueMultipleTags || []).length === 0,
                     }}
                     v-slots={{
                         inputPrefix:inputMultiplePrefixRender,
                         suffix: () => inputSuffixRender(),
                     }}>
            </WpInput>
        </div>)
        const getActive = item=>this.$props.multiple ? (this.currentValue || []).includes(item[this.$props.valueName]) : item[this.$props.valueName] === this.$props.modelValue;
        const selectPanelRender = ()=>([
            this.options.map((item:any,key)=>(
                <div
                    onClick={ev=>{
                        this.optionClick({item,ev})
                    }}
                    class={{
                        'wp-select-panel-option': true,
                        'wp-select-panel-option-group':Object.prototype.toString.call(item.options) === '[object Array]',
                        'wp-select-panel-option-disabled': item.disabled,
                        'wp-select-panel-option-active': getActive(item),
                    }}>
                    {this.$slots.default?.(item) || item[this.$props.labelName] || item[this.$props.valueName]}
                    {this.$props.activeIconShow &&  getActive(item) ? <WpIcon>
                        <CheckOutlined></CheckOutlined>
                    </WpIcon> : null}
                </div>)
            ),
            !this.options || this.options.length === 0 ? <div class={{
                'wp-select-panel-option': true,
                'wp-select-panel-option-empty': true,
            }}>{this.inputChangeValue ? '???????????????':'????????????'}</div> : null
        ])
        return this.$props.disabled ? inputRender() :  (<WpPopover
                   v-model={this.show}
                   arrow={false}
                   placement={'bottom-start'}
                   {...this.$props.PopoverConfig}
                   popoverClass={`wp-select-panel-popover ${this.$props.PopoverConfig.popoverClass}`}
                   v-slots={{
                       reference:()=>inputRender()
                   }}
        >
            <div class={{
                'wp-select-panel': true,
            }}>
                {this.$slots.panel?.(this) || selectPanelRender()}
            </div>
        </WpPopover>)
    }
})
