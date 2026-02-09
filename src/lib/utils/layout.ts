import type { Standee, PaperSettings, StandeeInstance } from '../stores/store';
import { v4 as uuidv4 } from 'uuid';

/**
 * simple bin packing for a single page.
 * Repopulates the instances array for each standee based on quantity.
 */
export function autoLayout(standees: Standee[], paper: PaperSettings): Standee[] {
    const newStandees = JSON.parse(JSON.stringify(standees)); // Deep copy to avoid mutation issues during calcs

    const contentWidth = paper.width - paper.margins.left - paper.margins.right;
    const contentHeight = paper.height - paper.margins.top - paper.margins.bottom;

    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;

    // We want to flatten all instances we need to create
    // But we need to keep them grouped by standee to assign them back
    // Actually, we can just iterate through standees and their quantities

    // Optional: Sort standees by height to pack better?
    // newStandees.sort((a: Standee, b: Standee) => b.height - a.height); 
    // Only sort if we want to reorder the standee list itself. 
    // If we want to keep user order, we shouldn't sort the main array, 
    // but maybe we can place them in order.

    // Let's just place them in order for now.

    for (const standee of newStandees) {
        const instances: StandeeInstance[] = [];

        // Calculate dimensions of this standee
        const aspectRatio = standee.originalWidth / standee.originalHeight;
        const width = standee.height * aspectRatio;
        const totalHeight = (standee.height * 2) + (standee.imageMargin * 2) + (standee.feetMargin * 2);
        const totalWidth = width + (standee.imageMargin * 2);

        // Padding between items
        const itemPadding = 0; // mm - User requested no space

        for (let i = 0; i < standee.quantity; i++) {
            // Check if fits in current row
            if (currentX + totalWidth > contentWidth) {
                // Move to next row
                currentX = 0;
                currentY += rowHeight + itemPadding;
                rowHeight = 0;
            }

            // Check if fits on page vertical
            if (currentY + totalHeight > contentHeight) {
                // Overflow! 
                // For now, let's just place it off-canvas or stop?
                // Or maybe just place it anyway and let user see it's outside
            }

            // Create instance
            // Preserve existing token info if it exists for this index?
            // For now, simpler to just regenerate or try to match by index if we want preservation.
            // Let's try to preserve if possible.
            const existingInstance = standee.instances[i];
            // Try to look up the "template" token style from the first instance if available
            // to ensure consistency when quantity increases.
            const templateToken = standee.instances[0]?.token;

            // Calculate Token Text based on settings
            let tokenText = String(i + 1);
            if (standee.tokenSettings) {
                if (standee.tokenSettings.mode === 'alphabetic') {
                    // Alphabetic: A, B, C... Z, AA, AB... 
                    // Or simple A-Z? User asked for "start the array from E".
                    // Let's assume sequential char codes for start.
                    // If complex excel style is needed, we'd need a helper.
                    // Simple char code offset:
                    const startChar = standee.tokenSettings.startValue.toUpperCase();
                    const startCode = startChar.charCodeAt(0) || 65; // default A
                    tokenText = String.fromCharCode(startCode + i);
                } else {
                    // Numeric: Start + i
                    const startNum = parseInt(standee.tokenSettings.startValue) || 1;
                    tokenText = String(startNum + i);
                }
            }

            const token = existingInstance?.token || {
                enabled: templateToken?.enabled ?? false, // Default off
                text: tokenText,
                size: templateToken?.size || 'medium',
                bgColor: templateToken?.bgColor || '#000000', // Black BG default
                textColor: templateToken?.textColor || '#ffffff', // White text default
                position: templateToken?.position || { x: 0, y: 0 } // Inherit position too!
            };

            // Force update text if we are re-layouting (e.g. settings changed)
            // The existing instance might have old text.
            token.text = tokenText;

            instances.push({
                id: existingInstance?.id || uuidv4(),
                x: currentX + paper.margins.left, // Absolute position on paper
                y: currentY + paper.margins.top,
                token
            });

            // Advance X
            currentX += totalWidth + itemPadding;

            // Update row height
            if (totalHeight > rowHeight) {
                rowHeight = totalHeight;
            }
        }

        standee.instances = instances;
    }

    return newStandees;
}
