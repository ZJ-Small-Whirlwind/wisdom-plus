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
                            text: 'Checkbox 复选框',
                            link: '/components/checkbox'
                        },
                        {
                            text: 'Radio 单选框',
                            link: '/components/radio'
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
                        }
                    ]
                },
                {
                    text: '展示组件',
                    children: [
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
