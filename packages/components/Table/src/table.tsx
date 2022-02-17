import { buildProps } from "@wisdom-plus/utils/props"
import {defineComponent, ExtractPropTypes, PropType} from "vue"

export const tableProps = buildProps({
    columns: {
        type: [Array] as PropType<Array<any>>,
        default: ()=>[]
    },
    data: {
        type: [Array] as PropType<Array<any>>,
        default: ()=>[]
    },
})

export type TableProps = ExtractPropTypes<typeof tableProps>

export default defineComponent({
    name: 'WpTable',
    props: tableProps,
    setup(props) {
        return {

        }
    },
    render() {
        let rowspan = 0;
        let colspan = 0;
        let rowsIndexMap = {};
        const getThead = (columns, level = 0)=>{
            return columns.map(it=>{
                const levelIndex = level+1;
                rowspan = levelIndex > rowspan ? levelIndex : rowspan;
                colspan = it.columns ? colspan : colspan + 1;
                rowsIndexMap[levelIndex] = rowsIndexMap[levelIndex] || [];
                const itemColumns = getThead(it.columns || [],levelIndex);
                const item = {
                    ...it,
                    level:levelIndex,
                    columns:itemColumns,
                }
                rowsIndexMap[levelIndex].push(item);
                return item
            });
        }
        console.log(getThead(this.columns), rowspan, colspan,rowsIndexMap)
        const theadRender = ()=>(<thead>
            {Object.values(rowsIndexMap).map((item:any,key:number)=>(
                <tr>
                    {item.map((it)=>(
                        <th rowspan={rowspan - key - it.columns.length}>
                            <div>{it.label}</div>
                        </th>
                    ))}
                </tr>
            ))}
            {/*<tr>*/}
            {/*    <th colspan={1} rowspan={3}>1</th>*/}
            {/*    <th colspan={5} rowspan={1}>2</th>*/}
            {/*</tr>*/}
            {/*<tr>*/}
            {/*    <th colspan={1} rowspan={2}>4</th>*/}
            {/*    <th colspan={4} rowspan={1}>5</th>*/}
            {/*</tr>*/}
            {/*<tr>*/}
            {/*    <th colspan={1} rowspan={1}>7</th>*/}
            {/*    <th colspan={1} rowspan={1}>8</th>*/}
            {/*    <th colspan={1} rowspan={1}>9</th>*/}
            {/*    <th colspan={1} rowspan={1}>10</th>*/}
            {/*</tr>*/}
        </thead>)
        const tbodyRender = ()=>(<tbody>

        </tbody>)
        return (
            <div class={'wp-table'}>
                <table class={{
                    'wp-table--body': true,
                }} border>
                    {theadRender()}
                    {tbodyRender()}
                </table>
            </div>
        )
    }
})
