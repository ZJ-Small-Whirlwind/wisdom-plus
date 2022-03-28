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