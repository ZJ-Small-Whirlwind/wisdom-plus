import { defineComponent } from "vue";
import {buildProps} from "@wisdom-plus/utils/props";
export const layoutSplitProps = buildProps({
    // 边界检测阈值
    index:{type:Number,default:null},
    // 滑块线宽
    lineWidth:{type:Number,default:0},
    // 是否水平布局
    Horizontally:{type:Boolean,default:false},
    // 是否自动滚动条
    autoScroll:{type:Boolean,default:false},
    // 是否支持滑动
    sliding:{type:Boolean,default:false},
    // 删格化
    span:{type:Array,default:()=>[0.5,0.5]},
})
export default defineComponent({
    name:"WpLayoutSplit",
    props:layoutSplitProps,
    setup(){
        return {
            show:false,
            clientX:0,
            mousedown_clientX:0,
            mousedown,
            mousemove,
            mouseup,
            mouseup,
            styleLeft,
            styleLine,
            styleRight,
        }
    },
    render(){
        return (<div
                 class={{
                     'LayoutSplit':true,
                     Horizontally:this.$props.Horizontally,
                     autoScroll:this.$props.autoScroll,
                     sliding:this.$props.sliding,
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
                     style={this.styleLeft}>
                    {this.$slots.left?.()}
                </div>
                {this.$props.sliding ? <div class="LayoutSplitLine" v-if="sliding" onDrag="" style={this.styleLine} ref="line"></div>: null}

                <div class={{
                    LayoutSplitRight:true,
                    LayoutSplitLineShow:this.show
                }} style={this.styleRight}>
                    {this.$slots.right?.()}
                </div>
            </div>
    )}
})
