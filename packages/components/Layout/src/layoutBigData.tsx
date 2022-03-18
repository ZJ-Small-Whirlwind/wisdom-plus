import { defineComponent} from "vue"
export default defineComponent({
    name:"WpLayoutBigData",
    setup(){
        return {
            isDev:true
        }
    },
    render(){
        return (<div class={{
            "CockpitLayoutBj":true,
            isDev:this.isDev,
        }}>

        </div>)
    }
})
