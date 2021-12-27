module.exports = {
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
                        }
                    ]
                },
                {
                    text: '展示组件',
                    children: [
                        {
                            text: 'Popover 气泡弹出框',
                            link: '/components/popover'
                        },
                        {
                            text: 'PopConfirm 气泡确认框',
                            link: '/components/pop-confirm'
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
                            text: 'ActionSheet 动作菜单',
                            link: '/components/action-sheet'
                        },
                        {
                            text: 'Dropdown 下拉菜单',
                            link: '/components/dropdown'
                        },
                        {
                            text: 'ScrollList 滚动列表',
                            link: '/components/scroll-list'
                        },
                        {
                            text: 'Statistic 数据统计',
                            link: '/components/statistic'
                        },
                        {
                            text: 'Ellipsis 文本省略',
                            link: '/components/ellipsis'
                        },
                        {
                            text: 'Overlay 遮罩',
                            link: '/components/overlay'
                        },
                        {
                            text: 'Modal 模态框',
                            link: '/components/modal'
                        },
                        {
                            text: 'Badge 徽章',
                            link: '/components/badge'
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
    }
}