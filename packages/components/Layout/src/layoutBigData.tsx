import {defineComponent, ExtractPropTypes, ref, onMounted, getCurrentInstance, watch, computed} from "vue"
import {buildProps} from "@wisdom-plus/utils/props";
export const layoutBigDataProps = buildProps({
    src:{type:String, default:null},
    width:{type:Number, default:null},
    height:{type:Number, default:null},
    fixed:{type:Boolean, default:false},
    isDev:{type:Boolean, default:false},
    layout:{type:Array, default:null},
})
export type LayoutBigDataProps = ExtractPropTypes<typeof layoutBigDataProps>
export default defineComponent({
    name:"WpLayoutBigData",
    props:layoutBigDataProps,
    setup(props,ctx){
        const ratio_w = ref(0);
        const ratio_h = ref(0);
        const isSuccess = ref(false);
        const vm:any = getCurrentInstance();
        const ratioReset = (w, h)=>{
            ratio_w.value = w / props.width;
            ratio_h.value = h / props.height;
        }
        const init = ()=>{
            let el:any = window;
            let w = el.innerWidth
            let h = el.innerHeight
            try{
                if(!props.fixed){
                    el = vm.vnode.el.parentNode;
                    w = el.clientWidth
                    h = el.clientHeight
                }
            }catch (e) {}
            if(props.src){
                const img = new Image();
                img.src = props.src;
                img.onload = ()=>{
                    if(props.width && props.height){
                        ratioReset(w, h);
                    }else {
                        ratio_w.value = w / img.width;
                        ratio_h.value = h / img.height;
                    }
                    isSuccess.value = true;
                }
                img.onerror = (err)=>{
                    ratioReset(w, h);
                }
                if(props.width && props.height){
                    ratioReset(w, h);
                }
            }else {
                if(props.width && props.height){
                    ratioReset(w, h);
                }
            }
        }
        const getStyle = ({ left = 0, top = 0, width = 0, height = 0})=>{
            const unit = "px";
            return {
                left:(left * ratio_w.value)  + unit,
                top:(top * ratio_h.value)  + unit,
                width:width * ratio_w.value  + unit,
                height:height * ratio_h.value  + unit,
            }
        }
        watch(props,()=>{
            init()
        })
        onMounted(()=>{
            init()
            window.addEventListener("resize",()=>{
                init();
            })
        })
        return {
            getStyle,
            isSuccess,
        }
    },
    render(){
        const layoutRender = ()=>this.$props.layout.map(item=>(<div style={this.getStyle(item)}>{item.content}</div>))
        return (<div class={{
            "wp-layout-big-data":true,
            "wp-layout-big-data-fixed":this.$props.fixed,
        }}>
            {this.isSuccess ? <img class="wp-layout-big-data-bj" ref="img" src={this.$props.src}/> : null}
            <div class={{
                "wp-layout-big-data-content":true,
                "wp-layout-big-data-is-dev":this.$props.isDev,
            }}>
                {Object.prototype.toString.call(this.$props.layout) === '[object Array]' ? layoutRender() :  this.$slots.default?.(this.getStyle)}
            </div>
        </div>)
    }
})
