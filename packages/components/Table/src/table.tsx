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
        /**
         * 获取合并单元格栏目数据
         * @param columns
         */
        const getColumnsMergedCell = (columns)=>{
            let rowspanMax = 0;
            let colspanMax = 0;
            let columns_col:any = [];
            let columnsMap = {};
            /**
             * 平铺单元格栏目
             * @param itemColumns 单元格栏目集合
             * @param result 返回平铺数据
             */
            const flatDry:any = (itemColumns,result:any = []) =>{
                itemColumns.forEach(it=>{
                    if(it.columns.length > 1){
                        flatDry(it.columns,result)
                    }else {
                        result.push(it);
                    }
                })
                return result;
            }
            /**
             * 获取单元格栏目信息
             * @param columns 栏目
             * @param level 栏目层深
             */
            const getItemColumns = (columns, level = 0)=>{
                return columns.map(it=>{
                    const levelIndex = level+1;
                    rowspanMax = levelIndex > rowspanMax ? levelIndex : rowspanMax;
                    colspanMax = it.columns ? colspanMax : colspanMax + 1;
                    columnsMap[levelIndex] = columnsMap[levelIndex] || [];
                    const itemColumns = getItemColumns(it.columns || [],levelIndex);
                    let colspanArr = flatDry(itemColumns);
                    const item = {
                        ...it,
                        level:levelIndex,
                        columns:itemColumns,
                        colspanArr,
                        colspan:colspanArr.length || 1,
                    }
                    if(!it.columns){
                        columns_col.push(item);
                    }
                    columnsMap[levelIndex].push(item);
                    return item;
                });
            }
            getItemColumns(columns);
            return {
                // 栏目映射
                columnsMap,
                // 总行数
                rowspanMax,
                // 总列数
                colspanMax,
                // 栏目列集合
                columns_col,
            }
        }
        return {
            theadColumns:getColumnsMergedCell(props.columns)
        }
    },
    render() {
        const theadRender = ()=>(<thead>
            {Object.values(this.theadColumns.columnsMap).map((item:any,key:number)=>(
                <tr>
                    {item.map((column)=>(
                        <th class={{
                                "wp-table__cell":true,
                            }}
                            colspan={column.colspan}
                            rowspan={column.colspan === 1 ? this.theadColumns.rowspanMax-key:1}>
                            <div class={{
                                "cell":true
                            }}>{column.label}</div>
                        </th>
                    ))}
                </tr>
            ))}
        </thead>)
        const tbodyRender = ()=>(<tbody>
            {this.data.map(row=>(
                <tr>
                    {this.theadColumns.columns_col.map((column:any)=>(
                        <td class={{
                                "wp-table__cell":true,
                            }}>
                            <div class={{
                                "cell":true
                            }}>{row[column.prop]}{column.prop}</div>
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>)
        return (
            <div class={'wp-table'}>
                <table class={{
                    'wp-table--body': true,
                }} border={0} cellpadding={0} cellspacing={0}>
                    {theadRender()}
                    {tbodyRender()}
                </table>
            </div>
        )
    }
})
