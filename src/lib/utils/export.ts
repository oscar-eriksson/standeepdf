import { jsPDF } from 'jspdf';
import type { Standee, PaperSettings } from '../stores/store';
import { mmToPx } from './units'; // Actually we need mm values for PDF

export async function generatePDF(standees: Standee[], paper: PaperSettings, action: 'download' | 'print' = 'download') {
    const doc = new jsPDF({
        orientation: paper.orientation || 'p',
        unit: 'mm',
        format: 'a4' // Assume A4 for now as per key requirement
    });

    const width = paper.width;
    const height = paper.height;

    // Debug: Draw margins?
    // doc.rect(paper.margins.left, paper.margins.top, width - paper.margins.left - paper.margins.right, height - paper.margins.top - paper.margins.bottom);

    const pageHeight = paper.height;

    for (const standee of standees) {
        // Load image once per standee type
        const imgParams = await loadImage(standee.imageSrc);

        for (const instance of standee.instances) {
            // Draw logic must match Standee.svelte

            // instance.x and instance.y are top-left of the wrapper
            // instance.y includes page offset (e.g. 0, 297, 594...)

            // Determine Page
            const pageIndex = Math.floor(instance.y / pageHeight);

            // Ensure we have enough pages
            // jsPDF pages are 1-indexed. getNumberOfPages() returns current count.
            while (doc.getNumberOfPages() <= pageIndex) {
                doc.addPage();
            }
            doc.setPage(pageIndex + 1);

            const x = instance.x;
            const y = instance.y % pageHeight; // Local Y on the specific page

            // Dimensions
            const heightMm = standee.height;
            const imageMarginMm = standee.imageMargin;
            const feetMarginMm = standee.feetMargin * 2; // x2 - margin is per side
            const aspectRatio = standee.originalWidth / standee.originalHeight;
            const widthMm = heightMm * aspectRatio;

            // 1. Mirror Image (Top)
            // PDF doesn't support easy mirroring of images directly without canvas manipulation usually.
            // But we can use scale? jsPDF .addImage doesn't support transform easily in basic API.
            // We might need to render to a canvas first then add that canvas to PDF.
            // OR use context2d if advanced API is available?

            // Let's use a helper to create a flipped canvas data url
            const flippedDataUrl = await getFlippedImageDataUrl(imgParams.img);

            // NEW LAYOUT: Feet-to-Feet
            // Top: Upright Image (Feet at bottom of Top Half)
            // Mid: Fold Area
            // Bot: Mirrored Image (Feet at top of Bottom Half)

            const contentX = x + imageMarginMm;

            // 1. Upright Image (Top)
            const format = getImageFormat(imgParams.dataUrl);
            doc.addImage(imgParams.dataUrl, format, contentX, y + imageMarginMm, widthMm, heightMm, undefined, 'FAST');

            // 2. Mirror Image (Bottom)
            // Starts at foldBottomY.
            // Calculate fold lines Y first
            const foldTopY = y + heightMm + imageMarginMm;
            const foldBottomY = foldTopY + feetMarginMm;

            doc.addImage(flippedDataUrl, 'PNG', contentX, foldBottomY, widthMm, heightMm);

            // 3. Borders & Fold Lines (Draw LAST so they are on top of images)
            const totalWidth = widthMm + (imageMarginMm * 2);
            const totalHeight = (heightMm * 2) + (imageMarginMm * 2) + feetMarginMm;

            // Main Cut Line (Dashed)
            doc.setDrawColor(200, 200, 200);
            doc.setLineDashPattern([2, 2], 0);
            doc.rect(x, y, totalWidth, totalHeight);

            // Feet Lines (Solid) - The boundary between image and fold area
            doc.setLineDashPattern([], 0); // Solid
            doc.line(x, foldTopY, x + totalWidth, foldTopY);
            if (feetMarginMm > 0) {
                doc.line(x, foldBottomY, x + totalWidth, foldBottomY);

                // Center Fold Line (Dashed)
                const centerFoldY = foldTopY + (feetMarginMm / 2);
                doc.setLineDashPattern([2, 2], 0);
                doc.line(x, centerFoldY, x + totalWidth, centerFoldY);
            } else {
                // If no feet margin, the solid line above is effectively the fold line.
                // But usually there is a margin.
            }

            // 4. Token
            if (instance.token?.enabled) {
                // Position logic matches Standee.svelte drag
                // CSS: top: 5 + pos.y; right: 5 - pos.x
                const pxToMmConst = 1 / 3.7795275591;
                function pxToMmLocal(px: number) { return px * pxToMmConst; }

                const offsetX = pxToMmLocal(instance.token.position?.x || 0);
                const offsetY = pxToMmLocal(instance.token.position?.y || 0);
                const baseOffset = pxToMmLocal(5);

                // --- Token Generation (Image based) ---
                // We render the token to a canvas first to ensure perfect alignment and style.
                const tokenImgData = await createTokenImage(instance.token);

                // Image dimensions in PDF units (mm)
                let diameter = 6.6;
                if (instance.token.size === 'small') diameter = 4;
                if (instance.token.size === 'large') diameter = 9;

                // --- Upright Token ---
                // css right: 5px -> 5 * pxToMmConst
                // css top: 5px -> 5 * pxToMmConst
                // position: relative to box

                // Box Top Left: (x, y)
                // Box Width: totalWidth

                const cssOffset = 5 / 3.7795; // 5px in mm approx 1.32mm
                const customOffsetX = pxToMmLocal(instance.token.position?.x || 0);
                const customOffsetY = pxToMmLocal(instance.token.position?.y || 0);

                // Right Edge position: x + totalWidth - cssOffset + customOffsetX
                // Note: In UI (Svelte), right: 5 - x. Moving X pos (right) reduces 'right' value, pushing element Right.
                // In PDF, we calc absolute Left X.
                // Base Right Edge = (x + totalWidth) - cssOffset
                // We ADD customOffsetX to move Right.
                const tokenX = (x + totalWidth) - cssOffset + customOffsetX - diameter;

                // Top Edge position: y + cssOffset + customOffsetY
                const tokenY = y + cssOffset + customOffsetY;

                doc.addImage(tokenImgData.normal, 'PNG', tokenX, tokenY, diameter, diameter);

                // --- Mirror Token ---
                // Mirror Box starts at foldBottomY.
                // We want to mirror the position on the other side.
                // It should be at the "Head" (Bottom of page).
                // Distance from Bottom of Mirror Box should be equal to Distance from Top of Upright Box.
                // Dist = cssOffset + customOffsetY.
                // Mirror Box Bottom = foldBottomY + heightMm + imageMarginMm.
                // Token Bottom Edge = Mirror Box Bottom - Dist.
                // Token Top Edge = Token Bottom Edge - diameter.

                const mirrorBoxBottom = foldBottomY + heightMm + imageMarginMm;
                const mirrorTokenTopY = mirrorBoxBottom - cssOffset - customOffsetY - diameter;

                // For the mirror token, we use the ROTATED image so it appears "flipped" (backwards/upside down).
                doc.addImage(tokenImgData.rotated, 'PNG', tokenX, mirrorTokenTopY, diameter, diameter);
            }
        }
    }

    if (action === 'print') {
        doc.autoPrint();
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    } else {
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-').slice(0, 5);
        const filename = `standees_${dateStr}_${timeStr}.pdf`;
        doc.save(filename);
    }
}

function getImageFormat(dataUrl: string): 'PNG' | 'JPEG' {
    if (dataUrl.startsWith('data:image/jpeg') || dataUrl.startsWith('data:image/jpg')) return 'JPEG';
    return 'PNG';
}

function loadImage(src: string): Promise<{ img: HTMLImageElement, dataUrl: string }> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            resolve({ img, dataUrl: src });
        };
        img.src = src;
    });
}

function getFlippedImageDataUrl(img: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.translate(0, img.height);
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL();
}

async function createTokenImage(token: any): Promise<{ normal: string, rotated: string }> {
    // High res canvas for crisp text
    const size = 64; // px
    const radius = size / 2;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return { normal: '', rotated: '' };

    function draw() {
        // Bg
        ctx.fillStyle = token.bgColor;
        ctx.beginPath();
        ctx.arc(radius, radius, radius, 0, Math.PI * 2);
        ctx.fill();

        // Border (Match app? app has no border usually, but let's add thin one if needed? No.)

        // Text
        ctx.fillStyle = token.textColor;
        ctx.font = 'bold 32px Helvetica, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Optical center often needs slight Y adjustment
        ctx.fillText(token.text, radius, radius + 2);
    }

    draw();
    const normal = canvas.toDataURL();

    // Rotate 180
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(Math.PI);
    ctx.translate(-size / 2, -size / 2);
    draw();
    ctx.restore();

    const rotated = canvas.toDataURL();

    return { normal, rotated };
}
