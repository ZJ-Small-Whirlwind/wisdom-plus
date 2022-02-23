import { buildProps } from "@wisdom-plus/utils/props"
import {defineComponent, ExtractPropTypes, PropType, computed, ref, watch} from "vue"
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
        // 当前表格数据
        const tableDatas:any = ref([]);
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
        /**
         * 扁平化数据
         * @param bodyCellData
         * @param treeChildrenFieldName
         * @param callback
         * @param result
         * @param parent
         * @param level
         */
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
        const getTbodyMergedCells:any = (bodyCellData, notResetShow = false)=>{
            if(props.tree){
                bodyCellData = flattenDeep(bodyCellData, props.treeChildrenFieldName, ({item, parent,level})=>{
                    if(!notResetShow){
                        item.value.$$treeShow = false;
                    }
                    item.value.$$parent = parent;
                    item.value.$$parentDeep = parent ? parent.$$parentDeep.concat([parent]) : [];
                    item.value.$$level = level;
                })
            }
            const result:any = [];
            const spanCellFilters:any = []
            bodyCellData.forEach((row,rowIndex)=>{
                const item:any = [];
                theadColumns.value.columns_col.forEach((column, columnIndex)=>{
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

        let theadColumns:any = ref({});// 表头数据
        let tbodyCells:any = ref([]);// 表单元格数据
        let colgroupArr:any = ref([]);// 表限制关联数据
        let tableWidth:any = ref(null);// 表格宽度
        // 重置表渲染
        const resetTbale = (newdata, bool)=>{
            tableDatas.value = newdata;
            theadColumns.value = getColumnsMergedCell(props.columns)
            tbodyCells.value = getTbodyMergedCells(tableDatas.value, bool);
            colgroupArr = computed(()=>{
                return theadColumns.value.columns_col.filter((e)=>props.height || !!e.width);
            })
            tableWidth = computed(()=>{
                const sum = colgroupArr.value.reduce((a,b)=>a+(b.width),0)
                return sum ? ((sum+50) + 'px') : null;
            })
        }
        // 数据监听，响应式
        watch([
            computed(()=>props.columns),
            computed(()=>props.data)
        ],()=>{
            resetTbale(props.data, false);
        },{ immediate:true})

        let isDragstart = false;// 是否拖拽
        let draggableObjData = ref(null);// 拖拽目标对象数据
        let draggableObjDataIndex:any = ref(-1);// 拖拽目标对象索引
        let draggableObjDataIndexstart:any = ref(-1);// 拖拽对象开始索引
        let draggableInset:any = ref(false);// 是否同级拖拽，代表内部追加
        let draggableForbid:any = ref(false);// 是否禁止存放
        let draggableForbidIndex:any = ref(-1);// 是否禁止存放索引
        // 开始拖拽
        const onDragstart = (ev)=>{
            isDragstart = true;
            draggableObjData.value = null;
            draggableObjDataIndex.value = -1;
            draggableObjDataIndexstart.value = ev.target.attributes.getNamedItem("index").value;
            draggableInset.value = false;
            draggableForbid.value = false;
            draggableForbidIndex.value = -1;
        }
        // 结束拖拽
        const onDragend = ()=>{
            if(!draggableForbid.value && draggableObjDataIndexstart.value !==  draggableObjDataIndex.value){
                const start = Number(draggableObjDataIndexstart.value);
                const end = Number(draggableObjDataIndex.value);
                const child_start = tbodyCells.value[start][0].row;
                const child_end = tbodyCells.value[end][0].row;
                const deleteStart = (data)=>{
                    return data.filter(it=>{
                        if(Object.prototype.toString.call(it[props.treeChildrenFieldName]) === '[object Array]'){
                            it[props.treeChildrenFieldName] = deleteStart(it[props.treeChildrenFieldName])
                        }
                        delete it.$$level;
                        delete it.$$parent;
                        delete it.$$parentDeep;
                        return it.$$rowIndex !== child_start.$$rowIndex
                    })
                }
                const addStart = (data)=>{
                    let result:any = [];
                    data.forEach((it,k)=>{
                        if(Object.prototype.toString.call(it[props.treeChildrenFieldName]) === '[object Array]'){
                            it[props.treeChildrenFieldName] = addStart(it[props.treeChildrenFieldName])
                        }
                        if(it.$$rowIndex === child_end.$$rowIndex){
                            if(draggableInset.value){
                                // 内部追加
                                data.forEach((dataIt,kk)=>{
                                    if(k === kk){
                                        dataIt[props.treeChildrenFieldName] = dataIt[props.treeChildrenFieldName] || [];
                                        dataIt[props.treeChildrenFieldName].push(child_start)
                                    }
                                    dataIt.$$treeShow =  flattenDeep([child_start],props.treeChildrenFieldName).filter(fit=>fit.$$treeShow).length > 0;
                                    result.push(dataIt);
                                });
                            }else {
                                // 同级追加
                                data.forEach((dataIt,kk)=>{
                                    result.push(dataIt);
                                    if(k === kk){
                                        result.push(child_start)
                                    }
                                });
                            }
                        }
                    })
                    if(result.length > 0){
                        return  result;
                    }
                    return data
                }
                resetTbale(addStart(deleteStart(tableDatas.value)), true);
            }
            isDragstart = false;
            draggableObjData.value = null;
            draggableObjDataIndex.value = -1;
            draggableObjDataIndexstart.value = -1;
            draggableInset.value = false;
            draggableForbid.value = false;
            draggableForbidIndex.value = -1;
        }
        // 拖拽过程
        const onDragover = (ev)=>{
            draggableForbid.value = false;
            try {
                if(isDragstart){
                    let el = ev.path.find(e=>(e.tagName || "").toLowerCase().indexOf("tr") > -1);
                    if(el){
                        draggableForbidIndex.value = Number(el.attributes.getNamedItem("index").value);
                        const srart_row = tbodyCells.value[draggableObjDataIndexstart.value][0].row
                        const end_row = tbodyCells.value[draggableForbidIndex.value][0].row
                        if(srart_row.index !== end_row.index && end_row.$$parentDeep.map(e=>e.index).indexOf(srart_row.index) === -1){
                            draggableInset.value = ev.offsetY < el.clientHeight*0.5;
                            draggableObjDataIndex.value = draggableForbidIndex.value;
                            draggableObjData.value = tbodyCells.value[draggableObjDataIndex.value];
                        }else {
                            draggableObjData.value = null;
                            draggableObjDataIndex.value = -1;
                            draggableInset.value = false;
                            draggableForbid.value = true;
                        }
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
            draggableForbidIndex,
            draggableObjDataIndexstart,
            draggableInset,
            draggableForbid,
            theadColumns,
            tbodyCells,
            colgroupArr,
            tableWidth,
            flattenDeep,
            tableDatas,
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
                    "draggable-is-active":key === Number(this.draggableForbidIndex),
                    "draggable-is-active-inset":key === Number(this.draggableObjDataIndex) && this.draggableInset,
                    "draggable-is-active-forbid":key === Number(this.draggableForbidIndex) && this.draggableForbid,
                    "draggable-is-active-start":key === Number(this.draggableObjDataIndexstart),
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
                {!isFixedHeader && this.tbodyCells.length === 0 ? (<div class={{
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
