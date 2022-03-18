import { defineComponent} from "vue"
export default defineComponent({
    name:"WpLayoutBigData",
    setup(){
        const isDev
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
