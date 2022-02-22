import { buildProps } from "@wisdom-plus/utils/props"
import {defineComponent, ExtractPropTypes, PropType, computed, ref} from "vue"
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
    tree: {
        type: [Boolean, String] as PropType<boolean|string>,
        default: false
    },
    treeLevelDeep: {
        type: [Number] as PropType<number>,
        default: 15
    },
    treeChildrenFieldName: {
        type: [String] as PropType<string>,
        default: "children"
    },
    draggable: {
        type: [Boolean] as PropType<boolean>,
        default: false
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
                    let fixedConfig:any = {};
                    if(it.fixed){
                        // 固定列配置
                        fixedConfig.position =  "sticky";
                        fixedConfig[it.fixed === true ? 'left' : (it.fixed || 'left')] = `${it.offset || 0}px`;
                    }
                    const item = {
                        ...it,
                        level:levelIndex,
                        columns:itemColumns,
                        colspanArr,
                        colspan:colspanArr.length || 1,
                        index:it.columns ? -1:columnsIndex += 1,
                        fixedConfig
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
        const flattenDeep = (bodyCellData,treeChildrenFieldName:string,callback:any = ()=>{}, result:any = [], parent:any = null,level:number = 0)=>{
            bodyCellData.forEach(it=>{
                const item = ref(it);
                callback({item, parent,level, bodyCellData, result});
                result.push(item.value);
                if(Object.prototype.toString.call(item.value[treeChildrenFieldName]) === '[object Array]'){
                    flattenDeep(item.value[treeChildrenFieldName], treeChildrenFieldName, callback,  result, item.value,level+1);
                }
            })
            return result;
        }
        /**
         * 合并body单元格
         */
        const getTbodyMergedCells:any = (bodyCellData = props.data)=>{
            if(props.tree){
                bodyCellData = flattenDeep(bodyCellData, props.treeChildrenFieldName, ({item, parent,level})=>{
                    item.value.$$treeShow = false;
                    item.value.$$parent = parent;
                    item.value.$$level = level;
                })
            }
            const result:any = [];
            const spanCellFilters:any = []
            bodyCellData.forEach((row,rowIndex)=>{
                const item:any = [];
                theadColumns.columns_col.forEach((column, columnIndex)=>{
                    const it:any = {
                        column,
                        row,
                        rowIndex,
                        columnIndex,
                    }
                    row.$$rowIndex = rowIndex;
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
        let tbodyCells = ref(getTbodyMergedCells());
        const colgroupArr = computed(()=>{
            return theadColumns.columns_col.filter((e)=>props.height || !!e.width);
        })
        const tableWidth = computed(()=>{
            const sum = colgroupArr.value.reduce((a,b)=>a+(b.width),0)
            return sum ? ((sum+50) + 'px') : null;
        })
        let isDragstart = false;
        let draggableObjData = ref(null);
        let draggableObjDataIndex:any = ref(-1);
        let draggableObjDataIndexstart:any = ref(-1);
        const onDragstart = (ev)=>{
            isDragstart = true;
            draggableObjData.value = null;
            draggableObjDataIndex.value = -1;
            draggableObjDataIndexstart.value = ev.target.attributes.getNamedItem("index").value;
        }
        const onDragend = ()=>{
            if(draggableObjDataIndexstart.value !==  draggableObjDataIndex.value){
                const start = Number(draggableObjDataIndexstart.value);
                const end = Number(draggableObjDataIndex.value);
                let rowChild_end:any = [];
                let rowChild_start:any = [];
                let rowStart:any = null;
                const newData = tbodyCells.value.reduce((a,b, k,d)=>{
                    const s_row = d[start][0].row;
                    const e_row = b[0].row;
                    if(rowChild_end.includes(b)){
                        a.push(b);
                        if(rowChild_end.indexOf(b) === rowChild_end.length - 1){
                            a.push(rowStart)
                        }
                        return a;
                    }
                    if(k !== start){
                        if(k === end){
                            const children_e = flattenDeep(e_row[props.treeChildrenFieldName] || [], props.treeChildrenFieldName);
                            const children = flattenDeep(s_row[props.treeChildrenFieldName] || [], props.treeChildrenFieldName);
                            const index = children.indexOf(e_row);
                            if(index > -1){
                                children.forEach(child=>{
                                    child.$$level -= 1;
                                })
                            }
                            rowChild_start = d.filter(dd=>children.map(e=>e.$$rowIndex).includes(dd[0].rowIndex))
                            rowChild_end = d.filter(dd=>children_e.map(e=>e.$$rowIndex).includes(dd[0].rowIndex))
                            console.log(rowChild_start)
                            s_row.$$level = e_row.$$level;
                            s_row.$$parent = e_row.$$parent;
                            a.push(b);
                            rowStart = d[start];
                        }else {
                            a.push(b);
                        }
                    }
                    return a;
                },[])
                tbodyCells.value = newData;
            }
            isDragstart = false;
            draggableObjData.value = null;
            draggableObjDataIndex.value = -1;
            draggableObjDataIndexstart.value = -1;
        }
        const onDragover = (ev)=>{
            try {
                if(isDragstart){
                    let el = ev.path.find(e=>(e.tagName || "").toLowerCase().indexOf("tr") > -1);
                    if(el){
                        draggableObjDataIndex.value = el.attributes.getNamedItem("index").value;
                        draggableObjData.value = tbodyCells[draggableObjDataIndex.value];
                    }
                }
            }catch (e){}
        }
        return {
            onDragstart,
            onDragend,
            onDragover,
            draggableObjData,
            draggableObjDataIndex,
            theadColumns,
            tbodyCells,
            colgroupArr,
            tableWidth,
            flattenDeep,
        }
    },
    mounted() {
        this.$nextTick(()=>{
            const el = this.$el.querySelector('.wp-table--fixed-header--wrapper')
            if(el){
                simpleScroll(el, this.$el).init()
            }
        })
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
                            style={{
                                ...column.fixedConfig
                            }}
                            align={column.align}
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
        const cellClick = ({row})=>{
            if(this.tree && Object.prototype.toString.call(row[this.treeChildrenFieldName]) === '[object Array]'){
                this.flattenDeep(row[this.treeChildrenFieldName] || [],this.treeChildrenFieldName).forEach(_row=>_row.$$treeShow = false);
                row.$$treeShow = !row.$$treeShow;
            }
        }
        const treeArrowRender = (bool, row)=>(
            <i class={{
                "cell-tree-item-arrow":true,
                "cell-tree-item-arrow-parent":bool,
                "cell-tree-item-arrow-parent-open":row.$$treeShow,
            }} style={{
                marginLeft:`${this.treeLevelDeep*row.$$level}px`
            }}></i>
        )

        const tbodyRender = ()=>(<tbody onDragover={this.onDragover}>
            {this.tbodyCells.map((item,key)=>!item[0].row.$$parent || item[0].row.$$parent.$$treeShow  ?(
                <tr
                    draggable={this.draggable}
                    onDragstart={this.onDragstart}
                    onDragend={this.onDragend}
                    index={key}
                    class={{
                    "stripe":this.stripe,
                    "draggable-is-active":key === Number(this.draggableObjDataIndex),
                }}>
                    {item.map(({column, row, spanCell, rowIndex, columnIndex}:any)=>(
                        <td onClick={(ev)=>cellClick({column, row, spanCell, rowIndex, columnIndex, ev})} class={{
                                "wp-table__cell":true,
                                [getNameIndex(column.index)]:true,
                            }}
                            align={column.align}
                            rowspan={spanCell[0]}
                            colspan={spanCell[1]}
                            style={{
                                minWidth:column.minWidth,
                                maxWidth:column.maxWidth,
                                ...column.fixedConfig
                            }}
                        >
                            <div class={{
                                "cell":true,
                                "cell-tree-item":this.tree && (this.tree === column.prop || column.index === 1)
                            }}>
                                {this.tree && (this.tree === column.prop || column.index === 1) ?
                                    ((row[this.treeChildrenFieldName] || []).length > 0 ? (
                                        treeArrowRender(true,row)
                                    ) : treeArrowRender(false,row))
                                    : null}
                                {this.$slots.default?.({
                                column, row, spanCell, rowIndex, columnIndex
                            }) || row[column.prop]}
                            </div>
                        </td>
                    ))}
                </tr>
            ) : null)}
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
                {this.tbodyCells.length === 0 ? (<div class={{
                    'wp-table--empty':true,
                }}>暂无数据！</div>) : null}
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
