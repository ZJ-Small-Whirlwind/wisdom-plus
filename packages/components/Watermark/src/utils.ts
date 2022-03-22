export function getRatio(context: any): number {
    if (!context) {
        return 1
    }
    const backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1
    return (window.devicePixelRatio || 1) / backingStore
}