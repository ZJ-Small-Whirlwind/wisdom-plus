import { PropType } from 'vue'
import Modal from './modal'

const DrawerModal = { ...Modal }

DrawerModal.name = 'WpDrawer'
DrawerModal.props = { ...DrawerModal.props }
DrawerModal.props.type = {
    type: String as PropType<'dialog' | 'drawer'>,
    default: 'drawer'
}

export default DrawerModal