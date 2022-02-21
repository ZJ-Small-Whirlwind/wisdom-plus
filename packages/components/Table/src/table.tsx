import { buildProps } from "@wisdom-plus/utils/props"
import {defineComponent, ExtractPropTypes, PropType, computed} from "vue"
import  simpleScroll from "./simpleScroll.js"
export const tableProps = buildProps({
    columns: {
        type: [Array] as PropType<Array<any>>,
        default: ()=>[]
    },
    data: {
        type: [Array] as PropType<Array<any>>,
        default: ()=>[]
    },
    spanCell: {
        type: Function as PropType<(CellItem:{
            column:object;
            row:object;
            rowIndex:number;
            columnIndex:number;
        }) => number[]>,
        default: ()=>()=>void (0)
    },
    stripe: {
        type: [Boolean] as PropType<boolean>,
        default: false
    },
    border: {
        type: [Boolean] as PropType<boolean>,
        default: false
    },
    height: {
        type: [String, Number] as PropType<string|number>,
        default: null
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
            let columnsIndex = 0;
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
                        index:it.columns ? -1:columnsIndex += 1,
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
        /**
         * 合并body单元格
         */
        const getTbodyMergedCells:any = ()=>{
            const result:any = [];
            const spanCellFilters:any = []
            props.data.forEach((row,rowIndex)=>{
                const item:any = [];
                theadColumns.columns_col.forEach((column, columnIndex)=>{
                    const it:any = {
                        column,
                        row,
                        rowIndex,
                        columnIndex,
                    }
                    const spanCell = props.spanCell(it) || []
                    it.spanCell = [spanCell[0] || 1,spanCell[1] || 1];
                    if(it.spanCell.reduce((a,b)=>a+b) > 2){
                        for(let x = 0; x < it.spanCell[1]; x++){
                            for(let y = 0; y < it.spanCell[0]; y++){
                                const str = [rowIndex + y, columnIndex + x].join("-");
                                const startStr = [rowIndex, columnIndex].join("-");
                                if(str != startStr){
                                    spanCellFilters.push(str)
                                }
                            }
                        }
                    }
                    item.push(it);
                });
                result.push(item)
            });
            return result.map((it,rk)=>{
                return it.filter((ee,ck)=>{
                    return !spanCellFilters.includes([rk,ck].join("-"))
                })
            })
        }

        const theadColumns = getColumnsMergedCell(props.columns)
        const tbodyCells = getTbodyMergedCells();
        const colgroupArr = computed(()=>{
            return theadColumns.columns_col.filter((e)=>props.height || !!e.width);
        })
        const tableWidth = computed(()=>{
            const sum = colgroupArr.value.reduce((a,b)=>a+(b.width),0)
            return sum ? ((sum+50) + 'px') : null;
        })
        return {
            theadColumns,
            tbodyCells,
            colgroupArr,
            tableWidth,
        }
    },
    mounted() {
        this.$nextTick(()=>{
            const el = this.$el.querySelector('.wp-table--fixed-header--wrapper')
            if(el){
                simpleScroll(el, this.$el).init()
            }
        })
        //
    },
    render() {
        const getNameIndex =  (index)=>`wp-table_${this._.uid}_column_${index || 0}`
        const theadRender = ()=>(<thead>
            {Object.values(this.theadColumns.columnsMap).map((item:any,key:number)=>(
                <tr>
                    {item.map((column)=>(
                        <th class={{
                                "wp-table__cell":true,
                                [getNameIndex(column.index)]:true,
                            }}
                            colspan={column.colspan}
                            rowspan={column.colspan === 1 ? this.theadColumns.rowspanMax-key:1}>
                            <div class={{
                                "cell":true
                            }}>{ this.$slots.header?.(column) || column.label}</div>
                        </th>
                    ))}
                </tr>
            ))}
        </thead>)
        const tbodyRender = ()=>(<tbody>
            {this.tbodyCells.map(item=>(
                <tr class={{
                    "stripe":this.stripe,
                }}>
                    {item.map(({column, row, spanCell, rowIndex, columnIndex}:any)=>(
                        <td class={{
                                "wp-table__cell":true,
                                [getNameIndex(column.index)]:true,
                            }}
                            rowspan={spanCell[0]}
                            colspan={spanCell[1]}
                            style={{
                                minWidth:column.minWidth,
                                maxWidth:column.maxWidth,
                            }}
                        >
                            <div class={{
                                "cell":true
                            }}>{this.$slots.default?.({
                                column, row, spanCell, rowIndex, columnIndex
                            }) || row[column.prop]}</div>
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>)
        const colgroupRender = ()=>this.colgroupArr ? (
            <colgroup>
                {this.colgroupArr.map((it)=>(
                    <col name={getNameIndex(it.index)} width={it.width}></col>
                ))}
            </colgroup>
        ) : null;
        const tableRender = (isFixedHeader = false)=>(<div
            class={{
            'wp-table--body': true,
            'wp-table--body--fixed-header': isFixedHeader,
        }}>
            <div class={'wp-table--body--content'}>
                <table border={0} cellPadding={0} cellSpacing={0} style={{width:this.height ? this.tableWidth : '100%'}}>
                    { this.height ? [
                        isFixedHeader ? [colgroupRender(),theadRender()] : [colgroupRender(),tbodyRender()]
                    ] : [this.colgroupArr.length === 0 ? null: colgroupRender(),theadRender(),tbodyRender()]}
                </table>
            </div>
        </div>)
        return (
            <div class={{
                'wp-table':true,
                'wp-table--border':this.border,
                'wp-table--fixed-header':this.height,
            }}>
                <div class={{
                    'wp-table--fixed-header--wrapper--box':true
                }}>
                    {this.height ? tableRender(true) : null}
                    <div class={{
                        'wp-table--fixed-header--wrapper': this.height,
                    }} style={{
                        height:typeof this.height === 'number' ? `${this.height}px` :this.height
                    }}>
                        {tableRender()}
                    </div>
                </div>
            </div>
        )
    }
})
