---
title: Icon
lang: en-US
---

# Icon

Element Plus provides a set of common icons.

:::warning

Element Plus team is replacing all **Font Icon** in the previously built components to **SVG Icon**, please keep you eyes on [ChangeLog](/#/en-US/component/changelog), for getting latest updates, **Font Icon** will be deprecated after the first stable release.

:::

<script setup>
import { Edit, Share, Delete, Search, Loading } from '@element-plus/icons'
</script>

## SvgIcon Usage

- If you want to **use directly** like the example, you need to [globally register](https://v3.vuejs.org/guide/component-registration.html#global-registration) the components before using it.

- If you want to see all available SVG icons please check [@element-plus/icons](https://unpkg.com/browse/@element-plus/icons@latest/lib/) and the source [Github/ElementPlus/icons](https://github.com/wisdom-plus/wisdom-plus-icons) out or [SVG icons](/#/en-US/component/icon#svg-tu-biao-ji-he)

## Installation

The current icon is only targeted to [Vue3](https://v3.vuejs.org).

## Using packaging manager

```shell
$ yarn add @element-plus/icons
# or
$ npm install @element-plus/icons
```

## Simple usage

:::warning

Because HTML standard has already defined a tag named [menu](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu),
so you need to use an alias in order to render the icon, if you register `Menu` directly it will not work.

:::

```vue
<!-- Use el-icon to provide attributes to SVG icon -->
<template>
  <div>
    <el-icon :size="size" :color="color">
      <edit></edit>
    </el-icon>
    <!-- Or use it independently without derive attributes from parent -->
    <edit></edit>
  </div>
</template>
```

<ElRow>
  <div>
    <ElIcon :size="30">
      <Edit />
    </ElIcon>
    <Edit />
  </div>
</ElRow>

## Combined with el-icon

`el-icon` provides extra attributes for raw SVG icon, for more detail, please read to the end.

```vue
<template>
  <p>
    with extra class <b>is-loading</b>, your icon is able to rotate 360 deg in 2
    seconds, you can also override this
  </p>
  <el-icon :size="20">
    <edit />
  </el-icon>
  <el-icon color="#409EFC" class="no-inherit">
    <share />
  </el-icon>
  <el-icon>
    <delete />
  </el-icon>
  <el-icon class="is-loading">
    <loading />
  </el-icon>
  <el-button type="primary">
    <el-icon style="vertical-align: middle;">
      <search />
    </el-icon>
    <span style="vertical-align: middle;"> Search </span>
  </el-button>
</template>
```

<ElRow>
  <p>
    with extra class <b>is-loading</b>, your icon is able to rotate 360 deg in 2
    seconds, you can also override this
  </p>
  <div style="display: flex; align-items: center; justify-content: space-between; width: 100%;">
    <ElIcon :size="20">
      <Edit />
    </ElIcon>
    <ElIcon color="#409EFC" class="no-inherit">
      <Share />
    </ElIcon>
    <ElIcon>
      <Delete />
    </ElIcon>
    <ElIcon class="is-loading">
      <Loading />
    </ElIcon>
    <ElButton type="primary">
      <ElIcon style="vertical-align: middle; color: #fff;">
        <Search />
      </ElIcon>
      <span style="vertical-align: middle;"> Search </span>
    </ElButton>
  </div>
</ElRow>

## Using SVG icon directly

```vue
<template>
  <div style="font-size: 20px;">
    <!-- Since svg icons do not carry any attributes by default -->
    <!-- You need to provide attributes directly -->
    <edit style="width: 1em; height: 1em; margin-right: 8px;" />
    <share style="width: 1em; height: 1em; margin-right: 8px;" />
    <delete style="width: 1em; height: 1em; margin-right: 8px;" />
    <search style="width: 1em; height: 1em; margin-right: 8px;" />
  </div>
</template>
```

<ElRow>
  <div style="font-size: 20px;">
    <!-- Since svg icons do not carry any attributes by default -->
    <!-- You need to provide attributes directly -->
    <Edit style="width: 1em; height: 1em; margin-right: 8px;" />
    <Share style="width: 1em; height: 1em; margin-right: 8px;" />
    <Delete style="width: 1em; height: 1em; margin-right: 8px;" />
    <Search style="width: 1em; height: 1em; margin-right: 8px;" />
  </div>
</ElRow>

## SVG Icons collection <ElTag>Available >= 1.0.2-beta.66</ElTag>

:::tip

**You can use SVG icon in any version** as long as you install it

**You can click the icon to copy it**

:::

<IconList />

<!-- <ul class="icon-list">
  <li
    v-for="component in $svgIcons"
    :key="component"
    @click="$copySvgIcon(component)">
    <span class="demo-svg-icon">
      <el-icon color="#000">
        <component :is="component" />
      </el-icon>
      <span class="icon-name">{{component}}</span>
    </span>
  </li>
</ul> -->

## Icon Attributes

| Attribute | Description                | Type                           | Acceptable Value | Default                |
| --------- | -------------------------- | ------------------------------ | ---------------- | ---------------------- |
| color     | SVG tag's fill attribute   | Pick\<CSSProperties, 'color'\> | -                | inherit from color     |
| size      | SVG icon size, size x size | number \| string               | -                | inherit from font size |

## Icon Slots

| Name | Description               |
| ---- | ------------------------- |
| —    | customize default content |
