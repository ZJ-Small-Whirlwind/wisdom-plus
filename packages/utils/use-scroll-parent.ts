import { ref, Ref, onMounted } from 'vue';

type ScrollElement = HTMLElement | HTMLBodyElement;

const overflowScrollReg = /scroll|auto/i;

function isElement(node: Element) {
    const ELEMENT_NODE_TYPE = 1;
    return (
        node.tagName !== 'HTML' &&
        node.tagName !== 'BODY' &&
        node.nodeType === ELEMENT_NODE_TYPE
    );
}

export function getScrollParent(
    el: HTMLElement,
    root: ScrollElement | undefined
) {
    let node = el;
    if (!root) root = document.body || undefined

    while (node && node !== root && isElement(node)) {
        const { overflowY } = window.getComputedStyle(node);
        if (overflowScrollReg.test(overflowY)) {
            return node;
        }
        node = node.parentNode as HTMLElement;
    }

    return root;
}

export function useScrollParent(
    el: Ref<HTMLElement | HTMLBodyElement | undefined>,
    root: ScrollElement | undefined
) {
    const scrollParent = ref<HTMLElement | HTMLBodyElement>()
    if (!root) root = document.body || undefined

    onMounted(() => {
        if (el.value) {
            scrollParent.value = getScrollParent(el.value, root)
        }
    })

    return scrollParent;
}