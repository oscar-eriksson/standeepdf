export const MM_TO_PX = 3.7795275591; // at 96 DPI.

export function mmToPx(mm: number): number {
    return mm * MM_TO_PX;
}

export function pxToMm(px: number): number {
    return px / MM_TO_PX;
}
