import { BuildOptions } from 'vite'
import { defineConfig } from 'vitepress'
export default defineConfig({
    base:process.argv.includes("dev") ? '/':"/static",
    title: 'Wisdom Plus',
    themeConfig: {
        nav: [
            { text: '首页', link: '/' },
            { text: '引导', link: '/guide/' },
            { text: '组件', link: '/components/' },
            { text: 'Github', link: 'https://github.com/Mamorial/wisdom-plus' },
        ],
        sidebar: {
            '/components/': [
                {
                    text: '业务组件',
                    children: [
                        {
                            text: 'Upload 上传',
                            link: '/components/pro/upload'
                        },
                        {
                            text: 'Editor 编辑器',
                            link: '/components/pro/editor'
                        },
                        {
                            text: 'Form 数据表单',
                            link: '/components/pro/form'
                        },
                        {
                            text: 'PersonTree 人员树',
                            link: '/components/pro/person-tree'
                        },
                        {
                            text: 'PersonTransfer 人员穿梭框',
                            link: '/components/pro/person-transfer'
                        },
                        {
                            text: 'PageLayout 页面脚手架',
                            link: '/components/pro/page-layout'
                        },
                        {
                            text: 'Cascader 级联菜单',
                            link: '/components/pro/cascader'
                        },
                        {
                            text: 'Permission 权限',
                            link: '/components/pro/permission'
                        }
                    ]
                },
                {
                    text: '布局组件',
                    children: [
                        {
                            text: 'Space 空间',
                            link: '/components/space'
                        },
                        {
                            text: 'Gird 网格',
                            link: '/components/grid'
                        },
                        {
                            text: 'Collapse 折叠面板',
                            link: '/components/collapse'
                        },
                        {
                            text: 'Toast 轻提示',
                            link: '/components/toast'
                        },
                        {
                            text: 'Layout 布局',
                            link: '/components/layout'
                        }
                    ]
                },
                {
                    text: '基础组件',
                    children: [
                        {
                            text: 'Button 按钮',
                            link: '/components/button'
                        },
                        {
                            text: 'Spin 加载中',
                            link: '/components/spin'
                        },
                        {
                            text: 'List 列表',
                            link: '/components/list'
                        },
                        {
                            text: 'VirtualList 虚拟列表',
                            link: '/components/virtual-list'
                        },
                        {
                            text: 'PullRefresh 下拉刷新',
                            link: '/components/pull-refresh'
                        },
                        {
                            text: 'Await 等待',
                            link: '/components/await'
                        },
                        {
                            text: 'Debug 调试',
                            link: '/components/debug'
                        }
                    ]
                },
                {
                    text: '输入组件',
                    children: [
                        {
                            text: 'Input 输入框',
                            link: '/components/input'
                        },
                        {
                            text: 'InputNumber 数字输入框',
                            link: '/components/input-number'
                        },
                        {
                            text: 'Checkbox 复选框',
                            link: '/components/checkbox'
                        },
                        {
                            text: 'Radio 单选框',
                            link: '/components/radio'
                        },
                        {
                            text: 'Switch 开关',
                            link: '/components/switch'
                        },
                        {
                            text: 'Slider 滑块',
                            link: '/components/slider'
                        },
                        {
                            text: 'TagInput 标签输入',
                            link: '/components/tag-input'
                        },
                        {
                            text: 'Upload 上传',
                            link: '/components/upload'
                        },
                        {
                            text: 'Tree 树',
                            link: '/components/tree'
                        },
                        {
                            text: 'Form 表单',
                            link: '/components/form'
                        },
                        {
                            text: 'BasicSelect 基础选择器',
                            link: '/components/basic-select'
                        },
                        {
                            text: 'select 选择器',
                            link: '/components/select'
                        },
                        {
                            text: 'Cascader 级联选择器',
                            link: '/components/cascader'
                        },
                        {
                            text: 'DatePicker 日期选择器',
                            link: '/components/date-picker'
                        },
                        {
                            text: 'TimePicker 时间选择器',
                            link: '/components/time-picker'
                        },
                        {
                            text: 'Rate 评分',
                            link: '/components/rate'
                        }
                    ]
                },
                {
                    text: '展示组件',
                    children: [
                        {
                            text: 'Watermark 水印',
                            link: '/components/watermark'
                        },
                        {
                            text: 'ActionSheet 动作菜单',
                            link: '/components/action-sheet'
                        },
                        {
                            text: 'Avatar 头像',
                            link: '/components/avatar'
                        },
                        {
                            text: 'Image 图片',
                            link: '/components/image'
                        },
                        {
                            text: 'Image Preview 图片预览',
                            link: '/components/image-preview'
                        },
                        {
                            text: 'Badge 徽章',
                            link: '/components/badge'
                        },
                        {
                            text: 'Breadcrumb 面包屑导航',
                            link: '/components/breadcrumb'
                        },
                        {
                            text: 'Dropdown 下拉菜单',
                            link: '/components/dropdown'
                        },
                        {
                            text: 'Ellipsis 文本省略',
                            link: '/components/ellipsis'
                        },
                        {
                            text: 'Popover 气泡弹出框',
                            link: '/components/popover'
                        },
                        {
                            text: 'PopConfirm 气泡确认框',
                            link: '/components/pop-confirm'
                        },
                        {
                            text: 'Progress 进度条',
                            link: '/components/progress'
                        },
                        {
                            text: 'Tooltip 文本提示',
                            link: '/components/tooltip'
                        },
                        {
                            text: 'Menu 菜单',
                            link: '/components/menu'
                        },
                        {
                            text: 'Table 表格',
                            link: '/components/table'
                        },
                        {
                            text: 'ScrollList 滚动列表',
                            link: '/components/scroll-list'
                        },
                        {
                            text: 'CountTo 数值动画',
                            link: '/components/count-to'
                        },
                        {
                            text: 'Statistic 数据统计',
                            link: '/components/statistic'
                        },
                        {
                            text: 'Overlay 遮罩',
                            link: '/components/overlay'
                        },
                        {
                            text: 'Dialog 对话框',
                            link: '/components/dialog'
                        },
                        {
                            text: 'Modal 模态框',
                            link: '/components/modal'
                        },
                        {
                            text: 'Drawer 抽屉',
                            link: '/components/drawer'
                        },
                        {
                            text: 'Tag 标签',
                            link: '/components/tag'
                        },
                        {
                            text: 'XScroll 横向滚动',
                            link: '/components/xscroll'
                        },
                        {
                            text: 'Pagination 分页',
                            link: '/components/pagination'
                        },
                        {
                            text: 'Calendar 日历',
                            link: '/components/calendar'
                        },
                        {
                            text: 'Tabs 标签页',
                            link: '/components/tabs'
                        },
                        {
                            text: 'Carousel 轮播图',
                            link: '/components/carousel'
                        },
                        {
                            text: 'Maps 地图',
                            link: '/components/maps'
                        },
                        {
                            text: 'BackTop 回到顶部',
                            link: '/components/back-top'
                        }
                    ]
                }
            ]
        }
    },
    markdown: {
        config: (md) => {
            const { demoBlockPlugin } = require('vitepress-theme-demoblock')
            md.use(demoBlockPlugin)
        }
    },
    vite:{
        build:<BuildOptions>{
            rollupOptions:{
                onwarn(warning){
                    // 拦截rollup警告
                }
            }
        }
    }
})
