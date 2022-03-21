import {defineComponent, computed, ref, getCurrentInstance, provide, inject, ExtractPropTypes} from "vue";
import {buildProps} from "@wisdom-plus/utils/props";
export const layoutSplitProps = buildProps({
    // 边界检测阈值
    index:{type:Number,default:30},
    // 滑块线宽
    lineWidth:{type:Number,default:1},
    // 是否水平布局
    horizontally:{type:Boolean,default:false},
    // 是否自动滚动条
    autoScroll:{type:Boolean,default:false},
    // 是否显示拖拽线
    dragLine:{type:Boolean,default:false},
    // 删格化
    span:{type:Array,default:()=>[0.5,0.5]},
    // 拖拽线描述
    lineMsg:{type:String,default:null},
})
export type LayoutSplitProps = ExtractPropTypes<typeof layoutSplitProps>;

export default defineComponent({
    name:"WpLayoutSplit",
    props:layoutSplitProps,
    setup(props){
        const line = ref();
        const left = ref();
        const right = ref();
        const show = ref(false)
        provide('provideLineWidth', ref(props.lineWidth));
        const provideLineWidth = inject('provideLineWidth', ref(props.lineWidth));
        const lineWidth = computed(()=>{
            if(props.lineWidth === 1){
                return provideLineWidth.value;
            }else {
                return props.lineWidth
            }
        })
        const vm:any = getCurrentInstance();
        const clientX = ref(0)
        const startIndex = ref(0)
        const direction = ref(false)
        const mousedown_clientX = ref(0)
        const span0:any = computed(()=>props.span && props.span[0] || 0.5);
        const span1:any = computed(()=>props.span && props.span[1] || (span0.value ? 1 - span0.value : 0.5 ));
        const calc1 = computed(()=>`calc((100% - ${lineWidth.value}px) * ${span0.value} + ${clientX.value}px)`);
        const calc2 = computed(()=>`calc((100% - ${lineWidth.value}px) * ${span1.value} - ${clientX.value}px)`);
        const styleLine = computed(()=>{
            if(props.horizontally){
                return {
                    transform:`translateY(${clientX.value - parseInt(String(lineWidth.value/2))}px)`,
                    height:`${lineWidth.value}px`,
                }
            }else{
                return {
                    width:`${lineWidth.value}px`,
                    left:calc1.value
                }
            }
        })
        const styleLeft = computed(()=>{
            if(props.horizontally){
                return {
                    height:calc1.value
                }
            }else{
                return {
                    width:calc1.value
                }
            }
        })
        const styleRight = computed(()=>{
            if(props.horizontally){
                return {
                    height:calc2.value
                }
            }else{
                return {
                    width:calc2.value
                }
            }
        })
        const mousedown = (e)=>{
            if(e.target === line.value){
                if(props.horizontally){
                    mousedown_clientX.value = e.clientY - clientX.value;
                    startIndex.value =  e.clientY;
                }else{
                    mousedown_clientX.value = e.clientX - clientX.value;
                    startIndex.value =  e.clientX;
                }
                show.value = true;
            }
        }
        const mousemove = (e)=>{
            if(props.horizontally){
                direction.value =  e.clientY - startIndex.value >= 0;
            }else{
                direction.value =  e.clientX - startIndex.value >= 0;
            }
            try{
                if(show.value){
                    let index = 30;
                    if(Object.prototype.toString.call(props.index) === "[object Number]"){
                        index = props.index;
                    }
                    let X = 0;
                    if(props.horizontally) {
                        X = e.clientY - mousedown_clientX.value;
                    }else{
                        X = e.clientX - mousedown_clientX.value;
                    }
                    const key = props.horizontally ? 'height' : 'width'
                    const leftObj = parseInt(getComputedStyle(left.value)[key])
                    const max = parseInt(getComputedStyle(vm.vnode.el)[key])
                    if((direction.value || leftObj > index) && (!direction.value || leftObj < (max - index))){
                        clientX.value = X;
                    }
                }
            }catch(e){
                // err
            }
        }
        const mouseup = ()=>{
            mousedown_clientX.value = 0;
            show.value = false;
        }
        return {
            show,
            clientX,
            mousedown_clientX,
            mousedown,
            mousemove,
            mouseup,
            styleLeft,
            styleLine,
            styleRight,
            left,
            line,
            right,
        }
    },
    render(){
        return (<div
                 class={{
                     'wp-layout-split':true,
                     horizontally:this.$props.horizontally,
                     autoScroll:this.$props.autoScroll,
                     autoScrollOff:!this.$props.autoScroll,
                     dragLine:this.$props.dragLine,
                 }}
                onMousedown={this.mousedown}
                onMousemove={this.mousemove}
                onMouseup={this.mouseup}
                onMouseleave={this.mouseup}
                >
                <div class={{
                        LayoutSplitLeft:true,
                        LayoutSplitLineShow:this.show
                    }}
                    ref='left'
                    style={this.styleLeft as any}>
                    {this.$slots.left?.()}
                </div>
                {this.$props.dragLine ? <div draglinemsg={this.$props.lineMsg} class="LayoutSplitLine" style={this.styleLine as any} ref="line">
                </div>: null}
                <div class={{
                        LayoutSplitRight:true,
                        LayoutSplitLineShow:this.show
                    }}
                     ref='right'
                     style={this.styleRight as any}>
                    {this.$slots.right?.()}
                </div>
            </div>
    )}
})
