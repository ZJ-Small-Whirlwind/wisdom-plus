const startZIndex = 3000
let zIndexRecorder = startZIndex

export const getMaxZIndex = () => {
    zIndexRecorder += 1
    return zIndexRecorder
}

export const resetZIndex = () => {
    zIndexRecorder = startZIndex
}