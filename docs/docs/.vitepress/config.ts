module.exports = {
    title: 'Wisdom Plus',
    base: '/wisdom-plus',
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
                    text: '基础组件',
                    children: [
                        {
                            text: 'Space 空间',
                            link: '/components/space'
                        },
                        {
                            text: 'Gird 网格',
                            link: '/components/grid'
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