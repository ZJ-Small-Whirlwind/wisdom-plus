import { buildProps } from "@wisdom-plus/utils/props"
import {defineComponent, ExtractPropTypes, PropType, computed, ref, watch, h, nextTick} from "vue"
import  WpRadio from "../../Radio"
import  Checkbox from "../../Checkbox"
import  Icon from "../../Icon"
import  Dropdown from "../../Dropdown"
import  WpInput from "../../Input"
import  Ellipsis from "../../Ellipsis"
import  WpButton from "../../Button"
import  Spin from "../../Spin"
import {CaretUpFilled, CaretDownFilled, FilterFilled, EditFilled, CloseSquareFilled, UnorderedListOutlined}  from "@vicons/antd"
import {get, set, slice} from "lodash"
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
    draggableFilter: {
        type: Function as PropType<(data) => boolean>,
        default: null
    },
    remote: {
        type: Function as PropType<(data) => boolean>,
        default: null
    },
    remoteFilter: {
        type: Function as PropType<(data) => boolean>,
        default: (row:any)=>true
    },
})

export type TableProps = ExtractPropTypes<typeof tableProps>

export default defineComponent({
    name: 'WpTable',
    props: tableProps,
    inheritAttrs:false,
    setup(props,{emit}) {
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
                        fixedConfig,
                        $$checkboxValue:false,
                        $$sort:0,
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
                row.$$checkboxValue = false;
                if(props.tree){
                    // 远程加载处理
                    if(Object.prototype.toString.call(props.remote) === "[object Function]"){
                        row.$$isRemote = Object.prototype.toString.call(props.remoteFilter) === "[object Function]" ? props.remoteFilter(row) : true;
                        row.$$isRemoteLoading = false;
                    }else {
                        row.$$isRemote = false;
                        row.$$isRemoteLoading = false;
                    }
                }
                const item:any = [];
                theadColumns.value.columns_col.forEach((column, columnIndex)=>{
                    const it:any = {
                        column,
                        row,
                        rowIndex,
                        columnIndex,
                    }
                    row.$$rowIndex = rowIndex;
                    row.$$filterShow = true;
                    row.$$editValueKeyName = null;
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

        // todo 初始化声明
        let theadColumns:any = ref({});// 表头数据
        let tbodyCells:any = ref([]);// 表单元格数据
        let colgroupArr:any = ref([]);// 表限制关联数据
        let tableWidth:any = ref(null);// 表格宽度
        let radioValue:any = ref(null);// 单选数据

        // todo 拖拽声明
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
                const newData = addStart(deleteStart(tableDatas.value));
                resetTbale(newData, true);
                emit("draggable-change",newData);
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
                        const inset = ev.offsetY < el.clientHeight*0.5;
                        // 拖拽过滤
                        const draggableFilterResult = Object.prototype.toString.call(props.draggableFilter) === '[object Function]' ? props.draggableFilter({
                            srart_row,
                            end_row,
                            index:draggableForbidIndex.value,
                            ev,
                            inset,
                        }) : true;
                        if(draggableFilterResult && srart_row.index !== end_row.index && end_row.$$parentDeep.map(e=>e.index).indexOf(srart_row.index) === -1){
                            draggableInset.value = inset;
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
        const getRadio = ()=>{
            return ((tbodyCells.value.find(cell=>String(cell[0].rowIndex) === radioValue.value) || [])[0] || {}).row;
        }

        const getCheckbox = ()=>{
            return tbodyCells.value.filter(e=>e[0].row.$$checkboxValue).map(e=>e[0].row);
        }
        watch(radioValue,()=>{
            const selection = getRadio();
            emit("select", selection, null, true)
            emit("selection-change", selection, true)
        })
        const setRadio = (rowIndex)=>{
            radioValue.value = String(rowIndex);
        }
        const setCheckbox = (rowIndexs:any[] = [])=>{
            let index = 0;
            tbodyCells.value.forEach(cell=>{
                const rowIndex = cell[0].rowIndex;
                if(rowIndexs.includes(rowIndex)){
                    cell[0].row.$$checkboxValue = true;
                    const column = (cell.find(e=>e.column.checkbox) || {}).column;
                    index += 1;
                    CheckboxRow(true, rowIndex, column, index === rowIndexs.length)
                }
            });
        }
        const setCheckboxAll = (bool = true)=>{
            const column = theadColumns.value.columns_col.find(e=>e.checkbox) || {};
            column.$$checkboxValue = bool;
            CheckboxAll(bool);
        }
        // 栏目全选
        let isSetUpInit = false;
        const CheckboxAll = (v)=>{
            tbodyCells.value.forEach(cell=>{
                const row = cell[0].row;
                row.$$checkboxValue = v;
            });
            if(isSetUpInit){
                const selection = getCheckbox();
                emit("select-all", selection)
                emit("selection-change", selection, false)
            }else {
                isSetUpInit = true;
            }
        }
        // 单元格复选
        const CheckboxRow = (v,rowIndex,column, isChange)=>{
            const cell = tbodyCells.value[rowIndex][0];
            const row = cell.row;
            // 检查孩子
            flattenDeep(
                row[props.treeChildrenFieldName] || [],
                props.treeChildrenFieldName
            ).forEach(row=>{
                row.$$checkboxValue = v;
            });
            // 检查父级
            (row.$$parentDeep || []).reverse().forEach(parent=>{
                let isCheck = true;
                flattenDeep(
                    parent[props.treeChildrenFieldName] || [],
                    props.treeChildrenFieldName
                ).forEach(row=>{
                    if(!row.$$checkboxValue){
                        isCheck = false;
                    }
                });
                parent.$$checkboxValue = isCheck;
            })
            // 全选处理
            column.$$checkboxValue = tbodyCells.value.filter(cellItem=>cellItem[0].row.$$checkboxValue).length === tbodyCells.value.length;
            if(isChange){
                const selection = getCheckbox();
                emit("select", selection, row, false)
                emit("selection-change", selection, false)
            }
        }
        const clearRadio = ()=>{
            radioValue.value = null;
        }
        const clearCheckbox = ()=>{
            setCheckboxAll(false)
        }
        const sortClick = (ev, column, bool, isp, arrs)=>{
            if(column.sort){
                arrs.forEach(it=>{
                    it.forEach(item=>{
                        if(item !== column){
                            item.$$sort = 0;
                        }
                    })
                })
                if(isp){
                    if(column.$$sort == 2){
                        column.$$sort = 0;
                    }else {
                        column.$$sort += 1;
                    }
                }else {
                    if(bool){
                        column.$$sort = column.$$sort === 1 ? 0 : 1;
                    }else {
                        column.$$sort = column.$$sort === 2 ? 0 : 2;
                    }
                    ev.stopPropagation();
                }
                if(column.$$sort === 0){
                    resetTbale(tableDatas.value, false, false);
                }else {
                    const newdata = JSON.parse(JSON.stringify(tableDatas.value)).sort((a,b)=> {
                        return {
                            1:String(get(a,column.prop)).localeCompare(String(get(b,column.prop))),
                            2:String(get(b,column.prop)).localeCompare(String(get(a,column.prop))),
                        }[column.$$sort] || 1;
                    });
                    resetTbale(newdata, false, false);
                }
            }
            emit('cell-header-click',column,ev);
        }
        const search = (v,column, notResetRable)=>{
            let newdata = JSON.parse(JSON.stringify(tableDatas.value));
            const propArr = theadColumns.value.columns_col.filter(e=>e.prop && (column ? e === column : true)).map(e=>e.prop);
            newdata = newdata.filter(row=>{
                return propArr.some(prop=>{
                    const value = get(row, prop);
                    if([
                        "[object String]",
                        "[object Number]",
                    ].includes(Object.prototype.toString.call(value))){
                        return  String(value).indexOf(v) > -1;
                    }
                    return false;
                })
            });
            if(!notResetRable){
                resetTbale(newdata, false, false);
            }
            return newdata;
        }
        // 远程数据处理
        const remoteDataInit = ({ev, bool, row, res})=>{
            row.$$treeShow = true;
            setTimeout(()=>{
                row[props.treeChildrenFieldName] = (row[props.treeChildrenFieldName] || []).concat(res);
                resetTbale(tableDatas.value, true, false);
                nextTick(()=>{
                    emit("remote-success", {ev, bool, row, res})
                })
            })

        }

        // 重置表渲染
        const resetTbale = (newdata, notResetShow, columnsUpdate = true)=>{
            // 是否更新表头及源数据
            if(columnsUpdate){
                tableDatas.value = newdata;
                theadColumns.value = getColumnsMergedCell(props.columns)
            }
            tbodyCells.value = getTbodyMergedCells(newdata, notResetShow);
            colgroupArr = computed(()=>{
                return theadColumns.value.columns_col.filter((e)=>props.height || !!e.width);
            })
            tableWidth = computed(()=>{
                const sum = colgroupArr.value.reduce((a,b)=>a+(b.width),0)
                return sum ? ((sum+50) + 'px') : null;
            })
            radioValue.value = null;
            clearCheckbox();
        }

        // 数据监听，响应式
        watch([
            computed(()=>props.columns),
            computed(()=>props.data)
        ],()=>{
            resetTbale(props.data, false);
        },{ immediate:true})
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
            radioValue,
            getRadio,
            getCheckbox,
            setRadio,
            setCheckbox,
            CheckboxRow,
            CheckboxAll,
            setCheckboxAll,
            clearCheckbox,
            clearRadio,
            sortClick,
            search,
            remoteDataInit,
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
        // 获取栏目标识
        // @ts-ignore
        const getNameIndex =  (index)=>`wp-table_${this._.uid}_column_${index || 0}`;
        const sortIconRender = (column, bool, active, arrs)=>(
            <Icon class={{
                    'active':column.$$sort === active
                }}
                size={12}
                onClick={(ev)=>this.sortClick(ev,column, bool, false,arrs)}>
                    {active === 1 ?
                        <CaretUpFilled></CaretUpFilled>
                        :
                        <CaretDownFilled></CaretDownFilled>
                    }
            </Icon>)
        const columnLableRenderSchedulingLine = (column)=>{
            if(Object.prototype.toString.call(column.label) === '[object Array]' && column.label.length > 0){
                const data = column.label.slice(0,3);
                return (<div class={{
                    'wp-table--cell-scheduling-line':true,
                    [`wp-table--cell-scheduling-line-len-`]:true,
                }}>
                    {data.map((label, key)=>(<div class={{
                        'wp-table--cell-scheduling-line-item':true,
                        [`wp-table--cell-scheduling-line-item-${key}`]:true,
                        [`wp-table--cell-scheduling-line-len-${data.length}-item`]:true,
                        [`wp-table--cell-scheduling-line-len-${data.length}-item-${key}`]:true,
                    }}><div class={{
                        'wp-table--cell-scheduling-line-item-label':true,
                    }}>{label}</div></div>))}
                </div>)
            }
            return column.label;
        }
        const columnLableRender = (column)=>this.$slots.header?.(column) ||
            (column.search ?
                <WpInput placeholder={column.placeholder || column.label} clearable onUpdate:modelValue={(v)=>(column.change || (()=>void (0)))(v, column)} modelValue={column.modelValue}></WpInput>
                :
                column.number ? (column.label || 'number') : columnLableRenderSchedulingLine(column)
            ) ||
            (column.radio ? '-' :null) ||
            (column.checkbox ? (<Checkbox onClick={ev=>ev.stopPropagation()} v-model={column.$$checkboxValue} onUpdate:modelValue={v=>this.CheckboxAll(v)}></Checkbox>) : null)
        const getFilterData = (column)=>{
            return this.tbodyCells.map(cellRow=>{
                const obj = cellRow[column.index - 1];
                const row = obj.row;
                return {
                    row,
                    column,
                    title:h("div",{
                        class:"wp-table-thead-cell-filter-content",
                    },[
                        h(Checkbox, {
                            class: "wp-table-thead-cell-filter-content-checkbox",
                            onClick:ev=>{
                                ev.stopPropagation();
                            },
                            modelValue: row.$$filterShow,
                            "onUpdate:modelValue":v=>{
                                row.$$filterShow = v;
                            }
                        }),
                        this.$slots.headerFilter?.({column, obj, row}) || get(row,column.prop)
                    ]),
                    index:obj.rowIndex
                }
            })
        }
        const theadRender = ()=>(<thead>
            {Object.values(this.theadColumns.columnsMap).map((item:any,key:number,arrs)=>(
                <tr>
                    {item.map((column)=>(
                        <th class={{
                                "wp-table__cell":true,
                                "wp-table--cell-scheduling":Object.prototype.toString.call(column.label) === '[object Array]',
                                [getNameIndex(column.index)]:true,
                            }}
                            style={{
                                ...column.fixedConfig
                            }}
                            align={column.align}
                            colspan={column.colspan}
                            rowspan={column.colspan === 1 ? this.theadColumns.rowspanMax-key:1}>
                            <div class={{
                                "cell":true,
                                "cell-sort":column.sort,
                                "cell-filter":column.filter,
                            }} onClick={(ev)=>this.sortClick(ev,column, true, true,arrs)}>
                                {column.filter ? (<Dropdown list={column.filterData || getFilterData(column)} onClick={(...agrs)=>this.$emit('click-filter',...agrs)}>
                                                {columnLableRender(column)}
                                                {<Icon class={'cell-filter-icon'}><FilterFilled></FilterFilled></Icon>}
                                            </Dropdown>):columnLableRender(column)}
                                {(column.sort ? (<div class={{
                                    "cell-sort-content":column.sort
                                }}>
                                    {sortIconRender(column,true,1,arrs)}
                                    {sortIconRender(column,false,2,arrs)}
                                </div>) : null)}
                            </div>
                        </th>
                    ))}
                </tr>
            ))}
        </thead>)
        // 单元格点击事件
        const cellClick = ({row,column,ev,...args})=>{
            if(this.tree && Object.prototype.toString.call(row[this.treeChildrenFieldName]) === '[object Array]'){
                this.flattenDeep(row[this.treeChildrenFieldName] || [],this.treeChildrenFieldName).forEach(_row=>_row.$$treeShow = false);
                row.$$treeShow = !row.$$treeShow;
            }
            this.$emit('cell-click',{...args,column,row},ev);
            if(Object.prototype.toString.call(column.emit) === '[object String]'){
                this.$emit(column.emit || '',{...args,column,row},ev);
            }
        }

        // 展开数据处理
        const treeArrowClick = (ev, bool, row)=>{
            try {
                if(row.$$isRemote && (!row[this.treeChildrenFieldName] || row[this.treeChildrenFieldName].length === 0)){
                    row.$$isRemoteLoading = true;
                    const remoteData = this.remote({ev, bool, row}) || [];
                    if(Object.prototype.toString.call(remoteData) === '[object Promise]'){
                        remoteData.then((res)=>{
                            row.$$isRemoteLoading = false;
                            this.remoteDataInit({ev, bool, row, res})
                        }).catch((err)=>{
                            // 请求失败
                            row.$$isRemoteLoading = false;
                            row.$$isRemote = true;
                            this.$emit("remote-error", err)
                        })
                    }else {
                        row.$$isRemoteLoading = false;
                        this.remoteDataInit({ev, bool, row, res:remoteData})
                    }
                    row.$$isRemote = false;
                }
            }catch (err) {
                this.$emit("remote-error", err)
            }
            this.$emit("tree-arrow-click", {ev, bool, row})
        }
        // 树形箭头绘制
        const treeArrowRender = (bool, row)=> row.$$isRemoteLoading ?
            (<Spin class={{
            "cell-tree-item-arrow-loading":true,
            }} style={{
                marginLeft:`${this.treeLevelDeep*row.$$level}px`
            }}></Spin>)
            :
            (<i onClick={ev=>treeArrowClick(ev, bool, row)} class={{
                "cell-tree-item-arrow":true,
                "cell-tree-item-arrow-parent":bool || row.$$isRemote,
                "cell-tree-item-arrow-parent-open":row.$$treeShow,
                "cell-tree-item-arrow-is-remote":row.$$isRemote,
            }} style={{
                marginLeft:`${this.treeLevelDeep*row.$$level}px`
            }}></i>
        )
        // 获取单元格唯一标识名称
        const getEditKeyName = (column, row)=>`$$${column.index}-${row.$$rowIndex}`;

        const cellLabelEditToggle = ({row,column, ev})=>{
            if(!row.$$editValueKeyName){
                row.$$editValueKeyName = getEditKeyName(column, row);
                row[row.$$editValueKeyName] = column.labelFilter ? column.labelFilter({value:get(row,column.prop),row,column}) : get(row,column.prop);
            }else {
                row.$$editValueKeyName = false;
            }
        }

        const cellDblclick = ({row,ev,column,...args})=>{
            cellLabelEditToggle({row,ev,column,...args});
            this.$emit('cell-dblclick',{row,ev,...args},ev);
        }
        const editSave = (ev,value, label,column, row, editValueKeyName)=>{
            ev.stopPropagation();
            this.$emit('edit-save', value, {label,column, row, ev, next:()=>{
                label = value;
                row.$$editValueKeyName = null;
                set(row,column.prop, value);
            }});
        }
        // 文本样式
        const cellTextTypeRender = (label, column, row, editValueKeyName)=>{
            if(Object.prototype.toString.call(column.textType) === '[object String]' || Object.prototype.toString.call(column.textTypeFilter) === '[object Function]'){
                let textType = column.textType;
                if(Object.prototype.toString.call(column.textTypeFilter) === '[object Function]'){
                    textType = column.textTypeFilter({label, column, row, editValueKeyName})
                }
                return (<span class={`WpColor ${textType || ''}`}>{label}</span>)
            }
            return label;
        }
        const cellNumberRender = (label, column, row, editValueKeyName)=>{
            if(column.number){
                return cellTextTypeRender(row.$$rowIndex+1, column, row, editValueKeyName);
            }
            return cellTextTypeRender(label, column, row, editValueKeyName)
        }
        // 操作按钮
        const filterBtns = (label, column, row, editValueKeyName)=>{
            return column.btns.filter(e=>{
                return Object.prototype.toString.call(e.show) === '[object Function]' ?
                    e.show({label, column, row, editValueKeyName, btnConfig:e})
                    :
                    Object.prototype.toString.call(e.show) === '[object Boolean]' ?
                        e.show
                        :
                        true;
            })
        }
        const operatingButtonRender = (label, column, row, editValueKeyName)=>{
            if(Object.prototype.toString.call(column.btns) === '[object Array]'){
                return column.dropdown ?
                        (<Dropdown list={filterBtns(label, column, row, editValueKeyName)} titleKeyName="name" onClick={({index},{emit,name,emitData,...ButtonConfig},ev)=> {
                            this.$emit(emit || editValueKeyName+'-'+index, {
                                ev,
                                label,
                                column,
                                row,
                                k:index,
                                config:{
                                    name, emit, emitData,
                                    ...ButtonConfig,
                                },
                                editValueKeyName
                            })
                        }} v-slots={{
                            title:(item)=>(<div class={`WpColor ${item.class || ''}`}>{item.name}</div>)
                        }}>
                            <Icon><UnorderedListOutlined></UnorderedListOutlined></Icon>
                        </Dropdown>)
                    :
                        (<div class={{
                                'cell-operate-btns':true,
                            }}>
                                {filterBtns(label, column, row, editValueKeyName).map(({name, emit, emitData, ...ButtonConfig},k)=><WpButton
                                    {...ButtonConfig}
                                    onClick={ev=>this.$emit(emit || editValueKeyName+'-'+k, {
                                        ev,
                                        label,
                                        column,
                                        row,
                                        k,
                                        config:{
                                            name, emit, emitData,
                                            ...ButtonConfig,
                                        },
                                        editValueKeyName
                                    })}
                                    class="WpColor"
                                >
                                    {name}
                                </WpButton>)}
                            </div>)
            }else {
                return cellNumberRender(label, column, row, editValueKeyName);
            }
        }
        // 快捷编辑图标
        const cellLabelEditIconRender = (column,row,editValueKeyName)=>{
            return (column.editIcon ? (<Icon class={{
                'cell-edit-input-icon':true,
            }} onClick={ev=>cellLabelEditToggle({row, column, ev})}>
                {column.edit && row.$$editValueKeyName === editValueKeyName ?
                    <CloseSquareFilled></CloseSquareFilled>
                    :
                    <EditFilled></EditFilled>
                }
            </Icon>) : null);
        }
        // 快捷编辑
        const cellLabelEditRender = (label,column, row)=>{
            const editValueKeyName = getEditKeyName(column, row);
            if(column.edit && row.$$editValueKeyName === editValueKeyName){
                const editConfig = Object.prototype.toString.call(column.edit) === '[object Object]' ? column.edit : {};
                return [
                    (this.$slots.edit?.({label,column, row, editValueKeyName}) || (<div class={{
                        'cell-edit-input':true,
                    }}>
                        {cellLabelEditIconRender(column, row,editValueKeyName)}
                        <WpInput {...editConfig}
                                 placeholder={column.placeholder}
                                 v-model={row[editValueKeyName]}
                                 clearable
                        ></WpInput>
                        <WpButton type="primary"
                                  onClick={(ev)=>editSave(ev, row[editValueKeyName], label,column, row, editValueKeyName)}
                                  // @ts-ignore
                                  onDblclick={ev=>ev.stopPropagation()}>保存</WpButton>
                    </div>))
                ]
            }
            const editIcon = cellLabelEditIconRender(column, row,editValueKeyName);
            return editIcon ?  [
                editIcon,
                operatingButtonRender(label, column, row, editValueKeyName)
            ] : operatingButtonRender(label, column, row, editValueKeyName);
        }
        // 文本省略
        const cellLableRender = (label, column, row)=> {
            if(column.ellipsis){
                const ellipsisConfig = Object.prototype.toString.call(column.ellipsis) === '[object Object]' ? column.ellipsis : {};
                return (<Ellipsis style={{width:'300px', paddingRight:'50px'}} v-slots={{
                    title:()=>(<div style={{maxWidth:'300px'}}>{label}</div>)
                }} line={2} force {...ellipsisConfig}>
                    {cellLabelEditRender(label, column, row)}
                </Ellipsis>)
            }
            return cellLabelEditRender(label, column, row);
        };
        const tbodyRender = ()=>(<tbody onDragover={this.onDragover}>
            {this.tbodyCells.map((item,key)=>(!item[0].row.$$parent || item[0].row.$$parent.$$treeShow) && item[0].row.$$filterShow  ?(
                <tr
                    draggable={this.draggable}
                    onDragstart={this.onDragstart}
                    onDragend={this.onDragend}
                    // @ts-ignore
                    index={key}
                    onClick={(ev)=>this.$emit('cell-row-click',item, ev)}
                    class={{
                    "stripe":this.stripe,
                    "draggable-is-active":key === Number(this.draggableForbidIndex),
                    "draggable-is-active-inset":key === Number(this.draggableObjDataIndex) && this.draggableInset,
                    "draggable-is-active-forbid":key === Number(this.draggableForbidIndex) && this.draggableForbid,
                    "draggable-is-active-start":key === Number(this.draggableObjDataIndexstart),
                    "wp-table-cell-row-radio":String(item[0].rowIndex) === this.radioValue,
                    "wp-table-cell-row-checkbox":item[0].row.$$checkboxValue,
                }}>
                    {item.map(({column, row, spanCell, rowIndex, columnIndex}:any)=>(
                        <td onClick={(ev)=>cellClick({column, row, spanCell, rowIndex, columnIndex, ev})} class={{
                                "wp-table__cell":true,
                                [getNameIndex(column.index)]:true,
                            }}
                            onDblclick={(ev)=>cellDblclick({column, row, spanCell, rowIndex, columnIndex, ev})}
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
                                {this.tree && (this.tree === column.prop || (column.index === 1 && typeof this.tree === 'boolean')) ?
                                    ((row[this.treeChildrenFieldName] || []).length > 0 || row.$$isRemote ? (
                                        treeArrowRender(true,row)
                                    ) : treeArrowRender(false,row))
                                    : null}
                                {this.$slots.default?.({
                                column, row, spanCell, rowIndex, columnIndex
                                }) ||
                                    (column.labelFilter ? cellLableRender(column.labelFilter({value:get(row,column.prop),row,column}),column, row) : cellLableRender(get(row,column.prop), column, row)) ||
                                    (column.radio ? (<WpRadio onClick={ev=>ev.stopPropagation()} v-model={this.radioValue} border-radius="0" value={String(rowIndex)}></WpRadio>) : null) ||
                                    (column.checkbox ? (<Checkbox onClick={ev=>ev.stopPropagation()} v-model={row.$$checkboxValue} onUpdate:modelValue={v=>this.CheckboxRow(v, rowIndex, column, true)}></Checkbox>) : null)
                                }
                            </div>
                        </td>
                    ))}
                </tr>
            ) : null)}
        </tbody>)

        const colgroupRender = ()=>this.colgroupArr ? (
            <colgroup>
                {this.colgroupArr.map((it)=>(
                    // @ts-ignore
                    <col name={getNameIndex(it.index)} width={it.width}/>
                ))}
            </colgroup>
        ) : null;
        const tableRender = (isFixedHeader = false)=>(<div
            class={{
            'wp-table--body': true,
            'wp-table--body--fixed-header': isFixedHeader,
        }}>
            <div class={'wp-table--body--content'}>
                <table cellpadding={0} cellspacing={0} style={{width:this.height ? this.tableWidth : '100%'}}>
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
