<p align="center">

  <img width="300px" src="https://user-images.githubusercontent.com/10731096/95823103-9ce15780-0d5f-11eb-8010-1bd1b5910d4f.png">

</p>

<p align="center">

  <a href="https://www.npmjs.org/package/wisdom-plus">

    <img src="https://img.shields.io/npm/v/wisdom-plus.svg">

  </a>

  <a href="https://npmcharts.com/compare/wisdom-plus?minimal=true">

    <img src="http://img.shields.io/npm/dm/wisdom-plus.svg">

  </a>

  <br>

</p>

<p align="center">Element Plus - A Vue.js 3 UI library</p>

[comment]: <> (- 💪 Vue 3 Composition API)

[comment]: <> (- 🔥 Written in TypeScript)

## Archived website

[comment]: <> (If you are looking for previous version website, here is the link.)

[comment]: <> ([Element Plus Documentation Archived]&#40;https://github.com/wisdom-plus/doc-archive&#41;)

[comment]: <> (The new website is launched at 17th Sep 2021.)

## Status: Beta

[comment]: <> (This project is still under heavy development. Feel free to join us and make your first pull request.)

### Playground

#### Try it with code sandbox

[comment]: <> ([![Edit wisdom-plus]&#40;https://codesandbox.io/static/img/play-codesandbox.svg&#41;]&#40;https://codesandbox.io/s/wisdom-plus-demo-dxtcr&#41;)

#### Try it with our built-in playground

[comment]: <> ([Playground]&#40;https://play.wisdom-plus.org/&#41;)

[comment]: <> (<p align="center">)

[comment]: <> (  <b>Special thanks to the generous sponsorship by:</b>)

[comment]: <> (</p>)

[comment]: <> (<br/>)

[comment]: <> (<table align="center" cellspacing="0" cellpadding="0">)

[comment]: <> (  <tbody>)

[comment]: <> (    <tr>)

[comment]: <> (      <td align="center" valign="middle">)

[comment]: <> (        <a href="https://www.jnpfsoft.com/index.html?from=elementUI" target="_blank">)

[comment]: <> (          <img width="150px" src="https://user-images.githubusercontent.com/17680888/140337374-59b3cb43-c1d3-449e-9757-2503de56f8e2.png">)

[comment]: <> (        </a>)

[comment]: <> (      </td>)

[comment]: <> (      <td align="center" valign="middle">)

[comment]: <> (        <a href="https://bit.dev/?from=element-ui" target="_blank">)

[comment]: <> (          <img width="150px" src="https://user-images.githubusercontent.com/10095631/41342907-e44e7196-6f2f-11e8-92f2-47702dc8f059.png">)

[comment]: <> (        </a>)

[comment]: <> (      </td>)

[comment]: <> (      <td align="center" valign="middle">)

[comment]: <> (        <a href="https://www.renren.io/?from=element-ui" target="_blank">)

[comment]: <> (          <img width="150px" src="https://user-images.githubusercontent.com/82012629/126620778-0d8ab509-018a-45d7-b8de-a5bac2ad519a.png">)

[comment]: <> (        </a>)

[comment]: <> (      </td>)

[comment]: <> (    </tr>)

[comment]: <> (  </tbody>)

[comment]: <> (</table>)

[comment]: <> (---)

## Translations

[comment]: <> (Element Plus is translated to multiple languages, you can click the badge to help up update the translation or apply to become)

[comment]: <> (a proofreader [![Crowdin]&#40;https://badges.crowdin.net/wisdom-plus/localized.svg&#41;]&#40;https://crowdin.com/project/wisdom-plus&#41;)

## Documentation

[comment]: <> (You can find for more details, API, and other docs on [https://wisdom-plus.org]&#40;https://wisdom-plus.org/&#41;)

[comment]: <> (国内[加速镜像站点]&#40;https://wisdom-plus.gitee.io/&#41;)

[comment]: <> (Join our [Discord]&#40;https://discord.link/ElementPlus&#41; to start communicating with everybody.)

## Breaking change list

[comment]: <> (You can find the breaking change list here: [Breaking Change List]&#40;https://github.com/wisdom-plus/wisdom-plus/issues/162&#41;.)

## Bootstrap project

[comment]: <> (With command)

[comment]: <> (```bash)

[comment]: <> ($ pnpm i)

[comment]: <> (```)

[comment]: <> (the project will install all dependencies)

## Website preview

[comment]: <> (With command)

[comment]: <> (```bash)

[comment]: <> ($ pnpm docs:dev)

[comment]: <> (```)

[comment]: <> (the project will launch website for you to preview all existing component)

## Local development

[comment]: <> (1. With command)

[comment]: <> (```shell)

[comment]: <> ($ pnpm dev)

[comment]: <> (```)

[comment]: <> (will start the local development environment)

[comment]: <> (2. Add your component into `play/src/App.vue`)

[comment]: <> (> App.vue)

[comment]: <> (```vue)

[comment]: <> (<template>)

[comment]: <> (  <ComponentYouAreDeveloping />)

[comment]: <> (</template>)

[comment]: <> (<script setup lang="ts">)

[comment]: <> (// make sure this component is registered in @wisdom-plus/components)

[comment]: <> (import { ComponentYouAreDeveloping } from '@wisdom-plus/components')

[comment]: <> (</script>)

[comment]: <> (```)

[comment]: <> (Modify `App.vue` file per your needs to get things work.)

## Component migration process

[comment]: <> (1. Convert the item in https://github.com/wisdom-plus/wisdom-plus/projects/1 to an issue)

[comment]: <> (2. Assign yourself to the issue)

[comment]: <> (3. Author your component by generating new component command below)

[comment]: <> (4. Migrate tests and docs)

[comment]: <> (5. Open a new pull request, fill in the component issue link in 1)

## Generate new component

[comment]: <> (With command)

[comment]: <> (```bash)

[comment]: <> ($ pnpm gen component-name)

[comment]: <> (```)

[comment]: <> (Note the `component-name` must be in `kebab-case`, combining words by replacing each space with a dash.)

[comment]: <> (And component type must be added to `typings/global.d.ts`.)

## Commit template

[comment]: <> (With command)

[comment]: <> (```bash)

[comment]: <> (pnpm cz)

[comment]: <> (```)

[comment]: <> (Example)

[comment]: <> (```)

[comment]: <> (# [TYPE]&#40;SCOPE&#41;: [el-component-name] DESCRIPTION#[ISSUE])

[comment]: <> (# example: feat&#40;components&#41;: [el-button] add type for form usage #1234)

[comment]: <> (```)

## Licence

[comment]: <> (Element Plus is open source software licensed as)

[comment]: <> ([MIT]&#40;https://github.com/wisdom-plus/wisdom-plus/blob/master/LICENSE&#41;.)

## Contributors

This project wouldn't exist without our amazing contributors

[comment]: <> (<a href="https://github.com/wisdom-plus/wisdom-plus/graphs/contributors">)

[comment]: <> (  <img src="https://contrib.rocks/image?repo=wisdom-plus/wisdom-plus" />)

[comment]: <> (</a>)
