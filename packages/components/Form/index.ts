import { withInstall, withNoopInstall } from '@wisdom-plus/utils/with-install'
import Form from './src/form'
import FormItem from './src/formItem'

export const WpForm = withInstall(Form, {
  FormItem,
})

export default WpForm

export const WpFormItem = withNoopInstall(FormItem)
