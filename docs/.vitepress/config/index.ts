import { languages } from '../utils/lang'
import { head } from './head'
import { sidebars } from './sidebars'
import { nav } from './nav'
import { mdPlugin } from './plugins'
import { features } from './features'
import type { UserConfig } from 'vitepress'

const buildTransformers = () => {
  const transformer = () => {
    return {
      props: [],
      needRuntime: true,
    }
  }

  const transformers = {}
  const directives = [
    'infinite-scroll',
    'loading',
    'popover',
    'click-outside',
    'repeat-click',
    'trap-focus',
    'mousewheel',
    'resize',
  ]
  directives.forEach((k) => {
    transformers[k] = transformer
  })

  return transformers
}

console.log(`DOC_ENV: ${process.env.DOC_ENV}`)

const locales = {}
languages.forEach((lang) => {
  locales[`/${lang}`] = {
    label: lang,
    lang,
  }
})

export const config: UserConfig = {
  title: 'Element Plus',
  head,
  themeConfig: {
    repo: 'wisdom-plus/wisdom-plus',
    docsDir: 'docs',

    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    logo: '/images/wisdom-plus-logo.svg',
    logoSmall: '/images/wisdom-plus-logo-small.svg',
    sidebars,
    nav,
    agolia: {
      apiKey: '377f2b647a96d9b1d62e4780f2344da2',
      appId: 'BH4D9OD16A',
    },
    features,
    langs: languages,
  },

  locales,

  markdown: {
    config: (md) => mdPlugin(md),
  },

  vue: {
    template: {
      ssr: true,
      compilerOptions: {
        directiveTransforms: buildTransformers(),
      },
    },
  },
}
