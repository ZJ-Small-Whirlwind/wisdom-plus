---
title: Popover
lang: en-US
---

# Popover

## Basic usage

Similar to Tooltip, Popover is also built with `Vue-popper`. So for some duplicated attributes, please refer to the documentation of Tooltip.

:::demo The `trigger` attribute is used to define how popover is triggered: `hover`, `click`, `focus` or `manual`. As for the triggering element, you can write it in two different ways: use the `#reference` named slot, or use the `v-popover` directive and set it to Popover's `ref`.

popover/basic-usage

:::

## Nested information

Other components can be nested in popover. Following is an example of nested table.

:::demo replace the `content` attribute with a default `slot`.

popover/nested-information

:::

## Nested operation

Of course, you can nest other operations. It's more light-weight than using a dialog.

:::demo

popover/nested-operation

:::

## Attributes

| Attribute                 | Description                                                                                                                               | Type            | Accepted Values                                                                                           | Default                                                 |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| trigger                   | how the popover is triggered                                                                                                              | string          | click/focus/hover/manual                                                                                  | click                                                   |
| title                     | popover title                                                                                                                             | string          | —                                                                                                         | —                                                       |
| content                   | popover content, can be replaced with a default `slot`                                                                                    | string          | —                                                                                                         | —                                                       |
| width                     | popover width                                                                                                                             | string / number | —                                                                                                         | Min width 150px                                         |
| placement                 | popover placement                                                                                                                         | string          | top/top-start/top-end/bottom/bottom-start/bottom-end/left/left-start/left-end/right/right-start/right-end | bottom                                                  |
| disabled                  | whether Popover is disabled                                                                                                               | boolean         | —                                                                                                         | false                                                   |
| visible / v-model:visible | whether popover is visible                                                                                                                | Boolean         | —                                                                                                         | false                                                   |
| offset                    | popover offset                                                                                                                            | number          | —                                                                                                         | 0                                                       |
| transition                | popover transition animation                                                                                                              | string          | —                                                                                                         | el-fade-in-linear                                       |
| show-arrow                | whether a tooltip arrow is displayed or not. For more info, please refer to [Vue-popper](https://github.com/element-component/vue-popper) | boolean         | —                                                                                                         | true                                                    |
| popper-options            | parameters for [popper.js](https://popper.js.org/docs/v2/)                                                                                | object          | please refer to [popper.js](https://popper.js.org/docs/v2/)                                               | `{ boundariesElement: 'body', gpuAcceleration: false }` |
| popper-class              | custom class name for popover                                                                                                             | string          | —                                                                                                         | —                                                       |
| show-after                | delay of appearance, in millisecond                                                                                                       | number          | —                                                                                                         | 0                                                       |
| hide-after                | delay of disappear, in millisecond                                                                                                        | number          | —                                                                                                         | 200                                                     |
| auto-close                | timeout in milliseconds to hide tooltip                                                                                                   | number          | —                                                                                                         | 0                                                       |
| tabindex                  | [tabindex](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/tabindex) of Popover                                       | number          | —                                                                                                         | —                                                       |

## Slots

| Name      | Description                        |
| --------- | ---------------------------------- |
| —         | text content of popover            |
| reference | HTML element that triggers popover |

## Events

| Event Name  | Description                                | Parameters |
| ----------- | ------------------------------------------ | ---------- |
| show        | triggers when popover shows                | —          |
| after-enter | triggers when the entering transition ends | —          |
| hide        | triggers when popover hides                | —          |
| after-leave | triggers when the leaving transition ends  | —          |
