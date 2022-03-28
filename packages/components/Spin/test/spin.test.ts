import Spin from '../src/spin'
import { mount } from '@vue/test-utils'

describe('Attrs', () => {
    test('Add class', () => {
        const wrapper = mount(Spin, {
            props: {
                class: "test"
            }
        })
        const fullscreenWrapper = mount(Spin, {
            props: {
                fullscreen: true,
                class: "test"
            },
            global: {
                stubs: {
                    teleport: true
                }
            }
        })
        const fullscreenWrapperWithChild = mount(Spin, {
            props: {
                class: "test"
            },
            slots: {
                default: 'spinner'
            },
            global: {
                stubs: {
                    teleport: true
                }
            }
        })

        expect(wrapper.find('.wp-spin').classes()).toContain('test')
        expect(fullscreenWrapper.html()).toMatchSnapshot('class="test"')
        expect(fullscreenWrapperWithChild.html()).toMatchSnapshot('class="test"')
    })
})