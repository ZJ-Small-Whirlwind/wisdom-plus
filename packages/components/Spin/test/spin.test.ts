import Spin from '../src/spin'
import { mount } from '@vue/test-utils'

describe('Attrs', () => {
    test('Add class', () => {
        const wrapper = mount(Spin, {
            props: {
                class: "test"
            }
        })

        expect(wrapper.find('.wp-spin').classes()).toContain('test')
    })
})

describe('Props', () => {
    test('Vertical', () => {
        const wrapper = mount(Spin, {
            props: {
                vertical: true
            }
        })

        expect(wrapper.find('.wp-spin').classes()).toContain('wp-spin--vertical')
    })
})