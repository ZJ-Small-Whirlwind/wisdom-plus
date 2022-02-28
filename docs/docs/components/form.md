---
title: Form
lang: en-US
---

# Form

Form consists of `input`, `radio`, `select`, `checkbox` and so on. With form, you can collect, verify and submit data.

:::tip

The component has been upgraded with a flex layout to replace the old float layout.

:::

<style lang="scss" scoped>
.example-showcase {
  .wp-select .wp-input {
    width: 380px;
  }
  .wp-form {
    width: 460px;
  }

  .wp-checkbox-group {
    width: 320px;
    margin: 0;
    padding: 0;
    list-style: none;

    &:after,
    &:before {
      content: ' ';
      display: table;
    }
    &:after {
      clear: both;
      visibility: hidden;
      font-size: 0;
      height: 0;
    }

    .wp-checkbox {
      float: left;
      width: 160px;
      padding-right: 20px;
      margin: 0;
      padding: 0;

      + .wp-checkbox {
        margin-left: 0;
      }
    }
  }
  .demo-form-normal {
    width: 460px;
  }
  .demo-form-inline {
    width: auto;

    .wp-input {
      width: 150px;
    }
    > * {
      margin-right: 10px;
    }
  }
  .demo-ruleForm {
    width: 460px;

    .wp-select .wp-input {
      width: 360px;
    }
  }
  .demo-dynamic {
    .wp-input {
      margin-right: 10px;
      width: 270px;
      vertical-align: top;
    }
  }
  .fr {
    float: right;
  }
}
</style>

## Basic form

It includes all kinds of input items, such as `input`, `select`, `radio` and `checkbox`.

In each `form` component, you need a `form-item` field to be the container of your input item.

<!-- /Users/chentao/Desktop/zj/wisdom-plus/docs/compoents/examples/form/basic-form.vue -->

:::demo
```vue
<template>
  <wp-form ref="formRef" :model="form" label-width="120px">
    <wp-form-item label="Activity name">
      <wp-input v-model="form.name"></wp-input>
    </wp-form-item>
    <wp-form-item>
      <wp-button type="primary" @click="onSubmit">Create</wp-button>
      <wp-button>Cancel</wp-button>
    </wp-form-item>
  </wp-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

// do not use same name with ref
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const onSubmit = () => {
  console.log('submit!')
}
</script>
```
:::

:::tip

[W3C](https://www.w3.org/MarkUp/html-spec/html-spec_8.html#SEC8.2) regulates that

> <i>When there is only one single-line text input field in a form, the user agent should accept Enter in that field as a request to submit the form.</i>

To prevent this behavior, you can add `@submit.prevent` on `<wp-form>`.

:::

## Inline form

When the vertical space is limited and the form is relatively simple, you can put it in one line.
Set the `inline` attribute to `true` and the form will be inline.

:::demo
```vue
<template>
  <wp-form :inline="true" :model="formInline" class="demo-form-inline">
    <wp-form-item label="Approved by">
      <wp-input v-model="formInline.user" placeholder="Approved by"></wp-input>
    </wp-form-item>
    <wp-form-item>
      <wp-button type="primary" @click="onSubmit">Query</wp-button>
    </wp-form-item>
  </wp-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const formInline = reactive({
  user: '',
  region: '',
})

const onSubmit = () => {
  console.log('submit!')
}
</script>
```
:::

## Alignment

Depending on your design, there are several different ways to align your label element.

The `labwp-position` attribute decides how labels align, it can be `top` or `left`. When set to `top`, labels will be placed at the top of the form field.

:::demo

```vue
<template>
  <wp-radio-group v-model="labelPosition">
    <wp-radio value="left">Left</wp-radio>
    <wp-radio value="right">Right</wp-radio>
    <wp-radio value="top">Top</wp-radio>
  </wp-radio-group>
  <div style="margin: 20px"></div>
  <wp-form
    :label-position="labelPosition"
    label-width="100px"
    :model="formLabelAlign"
    style="max-width: 460px"
  >
    <wp-form-item label="Name">
      <wp-input v-model="formLabelAlign.name"></wp-input>
    </wp-form-item>
    <wp-form-item label="Activity zone">
      <wp-input v-model="formLabelAlign.region"></wp-input>
    </wp-form-item>
    <wp-form-item label="Activity form">
      <wp-input v-model="formLabelAlign.type"></wp-input>
    </wp-form-item>
  </wp-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'

const labelPosition = ref('right')

const formLabelAlign = reactive({
  name: '',
  region: '',
  type: '',
})
</script>
```

:::

## Validation

Form component allows you to verify your data, helping you find and correct errors.

Just add the `rules` attribute for `Form` component, pass validation rules, and set `prop` attribute for `Form-Item` as a specific key that needs to be validated. See more information at [async-validator](https://github.com/yiminghe/async-validator).

:::demo
```vue
<template>
  <wp-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
  >
    <wp-form-item label="Activity name" prop="name">
      <wp-input v-model="ruleForm.name"></wp-input>
    </wp-form-item>
    <wp-form-item label="Activity form" prop="desc">
      <wp-input v-model="ruleForm.desc" type="textarea"></wp-input>
    </wp-form-item>
    <wp-form-item>
      <wp-button type="primary" @click="submitForm">Create</wp-button>
    </wp-form-item>
  </wp-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
// More info see https://github.com/element-plus/element-plus/blob/dev/docs/examples/form/utils.ts

const formSize = ref('')

const ruleFormRef = ref()
const ruleForm = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

const rules = reactive({
  name: [
    {
      required: true,
      message: 'Please input Activity name',
      trigger: 'blur',
    },
    {
      min: 3,
      max: 5,
      message: 'Length should be 3 to 5',
      trigger: 'blur',
    },
  ],
  desc: [
    {
      required: true,
      message: 'Please input activity form',
      trigger: 'blur',
    },
  ],
})

const submitForm = () => {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!')
      return false
    }
  })
}
</script>
```
:::

## Form Attributes

| Attribute               | Description                                                                                                                       | Type            | Accepted Values         | Default |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------- | ------- |
| model                   | data of form component                                                                                                            | object          | —                       | —       |
| rules                   | validation rules of form                                                                                                          | object          | —                       | —       |
| inline                  | whether the form is inline                                                                                                        | boolean         | —                       | false   |
| labwp-position          | position of label. If set to 'left' or 'right', `labwp-width` prop is also required                                               | string          | left / right / top      | right   |
| labwp-width             | width of label, e.g. '50px'. All its direct child form items will inherit this value. Width `auto` is supported.                  | string / number | —                       | —       |
| labwp-suffix            | suffix of the label                                                                                                               | string          | —                       | —       |
| hide-required-asterisk  | whether required fields should have a red asterisk (star) beside their labels                                                     | boolean         | —                       | false   |
| show-message            | whether to show the error message                                                                                                 | boolean         | —                       | true    |
| inline-message          | whether to display the error message inline with the form item                                                                    | boolean         | —                       | false   |
| status-icon             | whether to display an icon indicating the validation result                                                                       | boolean         | —                       | false   |
| validate-on-rule-change | whether to trigger validation when the `rules` prop is changed                                                                    | boolean         | —                       | true    |
| size                    | control the size of components in this form                                                                                       | string          | large / default / small | —       |
| disabled                | whether to disabled all components in this form. If set to true, it cannot be overridden by its inner components' `disabled` prop | boolean         | —                       | false   |

## Form Methods

| Method        | Description                                                                                                                                                                                                                                                                      | Parameters                                                                 |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| validate      | validate the whole form. Takes a callback as a param. After validation, the callback will be executed with two params: a boolean indicating if the validation has passed, and an object containing all fields that fail the validation. Returns a promise if callback is omitted | Function(callback: Function(boolean, object))                              |
| validateField | validate one or several form items                                                                                                                                                                                                                                               | Function(props: string \| array, callback: Function(errorMessage: string)) |
| resetFields   | reset all the fields and remove validation result                                                                                                                                                                                                                                | —                                                                          |
| scrollToField | Scroll to the specified form field                                                                                                                                                                                                                                               | Function(prop: string)                                                     |
| clearValidate | clear validation message for certain fields. The parameter is prop name or an array of prop names of the form items whose validation messages will be removed. When omitted, all fields' validation messages will be cleared                                                     | Function(props: string \| array)                                           |

## Form Events

| Event Name | Description                             | Parameters                                                                                            |
| ---------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| validate   | triggers after a form item is validated | prop name of the form item being validated, whether validation is passed and the error message if not |

## Form Slots

| Name | Description                | Subtags   |
| ---- | -------------------------- | --------- |
| —    | customize of Dropdown Item | Form-Item |

## Form-Item Attributes

| Attribute      | Description                                                                                                                              | Type            | Accepted Values                     | Default |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------------- | ------- |
| prop           | a key of `model`. In the use of validate and resetFields method, the attribute is required                                               | string          | keys of model that passed to `form` |
| label          | label                                                                                                                                    | string          | —                                   | —       |
| labwp-width    | width of label, e.g. '50px'. Width `auto` is supported.                                                                                  | string / number | —                                   | —       |
| required       | whether the field is required or not, will be determined by validation rules if omitted                                                  | boolean         | —                                   | false   |
| rules          | validation rules of form, see the following table, more advanced usage at [async-validator](https://github.com/yiminghe/async-validator) | object / array  | —                                   | —       |
| error          | field error message, set its value and the field will validate error and show this message immediately                                   | string          | —                                   | —       |
| show-message   | whether to show the error message                                                                                                        | boolean         | —                                   | true    |
| inline-message | inline style validate message                                                                                                            | boolean         | —                                   | false   |
| size           | control the size of components in this form-item                                                                                         | string          | large / default / small             | default |

## Rules

| Attribute | Description                    | Type   | Accepted Values | Default |
| --------- | ------------------------------ | ------ | --------------- | ------- |
| trigger   | how the validator is triggered | string | blur / change   | —       |

## Form-Item Slots

| Name  | Description                                                                    |
| ----- | ------------------------------------------------------------------------------ |
| —     | content of Form Item                                                           |
| label | Custom content to display on label. The scope parameter is { label }           |
| error | Custom content to display validation message. The scope parameter is { error } |

## Form-Item Methods

| Method        | Description                                      | Parameters |
| ------------- | ------------------------------------------------ | ---------- |
| resetField    | reset current field and remove validation result | —          |
| clearValidate | remove validation status of the field            | —          |