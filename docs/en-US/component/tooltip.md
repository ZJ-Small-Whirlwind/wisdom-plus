---
title: Tooltip
lang: en-US
---

# Tooltip

Display prompt information for mouse hover.

## Basic usage

Tooltip has 9 placements.

:::demo Use attribute `content` to set the display content when hover. The attribute `placement` determines the position of the tooltip. Its value is `[orientation]-[alignment]` with four orientations `top`, `left`, `right`, `bottom` and three alignments `start`, `end`, `null`, and the default alignment is null. Take `placement="left-end"` for example, Tooltip will display on the left of the element which you are hovering and the bottom of the tooltip aligns with the bottom of the element.

tooltip/basic

:::

## Theme

Tooltip has two themes: `dark` and `light`。

:::demo Set `effect` to modify theme, and the default value is `dark`.

tooltip/theme

:::

## More Content

Display multiple lines of text and set their format.

:::demo Override attribute `content` of `el-tooltip` by adding a slot named `content`.

tooltip/rich-content

:::

## Advanced usage

In addition to basic usages, there are some attributes that allow you to customize your own:

`transition` attribute allows you to customize the animation in which the tooltip shows or hides, and the default value is el-fade-in-linear.

`disabled` attribute allows you to disable `tooltip`. You just need set it to `true`.

In fact, Tooltip is an extension based on [Vue-popper](https://github.com/element-component/vue-popper), you can use any attribute that are allowed in Vue-popper.

:::demo

tooltip/advanced-usage

:::

:::tip

The `router-link` component is not supported in tooltip, please use `vm.$router.push`.

Disabled form elements are not supported for Tooltip, more information can be found at [MDN](https://developer.mozilla.org/en-US/docs/Web/Events/mouseenter). You need to wrap the disabled form element with a container element for Tooltip to work.

:::

## Attributes

| Attribute             | Description                                                                                                                   | Type    | Accepted Values                                                                                           | Default                                                 |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| append-to-body        | whether to append Dialog itself to body. A nested Dialog should have this attribute set to `true`                             | boolean | —                                                                                                         | true                                                    |
| effect                | Tooltip theme                                                                                                                 | string  | dark/light                                                                                                | dark                                                    |
| content               | display content, can be overridden by `slot#content`                                                                          | String  | —                                                                                                         | —                                                       |
| placement             | position of Tooltip                                                                                                           | string  | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom                                                  |
| model-value / v-model | visibility of Tooltip                                                                                                         | boolean | —                                                                                                         | false                                                   |
| disabled              | whether Tooltip is disabled                                                                                                   | boolean | —                                                                                                         | false                                                   |
| offset                | offset of the Tooltip                                                                                                         | number  | —                                                                                                         | 0                                                       |
| transition            | animation name                                                                                                                | string  | —                                                                                                         | el-fade-in-linear                                       |
| visible-arrow         | whether an arrow is displayed. For more information, check [Vue-popper](https://github.com/element-component/vue-popper) page | boolean | —                                                                                                         | true                                                    |
| popper-options        | [popper.js](https://popper.js.org/documentation.html) parameters                                                              | Object  | refer to [popper.js](https://popper.js.org/documentation.html) doc                                        | `{ boundariesElement: 'body', gpuAcceleration: false }` |
| show-after            | delay of appearance, in millisecond                                                                                           | number  | —                                                                                                         | 0                                                       |
| hide-after            | delay of disappear, in millisecond                                                                                            | number  | —                                                                                                         | 0                                                       |
| auto-close            | timeout in milliseconds to hide tooltip                                                                                       | number  | —                                                                                                         | 0                                                       |
| manual                | whether to control Tooltip manually. `mouseenter` and `mouseleave` won't have effects if set to `true`                        | boolean | —                                                                                                         | false                                                   |
| popper-class          | custom class name for Tooltip's popper                                                                                        | string  | —                                                                                                         | —                                                       |
| enterable             | whether the mouse can enter the tooltip                                                                                       | Boolean | —                                                                                                         | true                                                    |
| tabindex              | [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of Tooltip                           | number  | —                                                                                                         | 0                                                       |

## Slots

| Name | Description               |
| ---- | ------------------------- |
| —    | customize default content |
