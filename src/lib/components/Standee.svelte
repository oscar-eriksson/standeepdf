<script lang="ts">
  import type { Standee, StandeeInstance } from '../stores/store';
  import { mmToPx, pxToMm } from '../utils/units';
  import { standees } from '../stores/store';

  export let standee: Standee;
  export let instance: StandeeInstance;
  export let showRuler: boolean = false;

  // Dimensions in pixels
  $: heightPx = mmToPx(standee.height);
  // Calculate width based on aspect ratio
  $: aspectRatio = standee.originalWidth / standee.originalHeight;
  $: widthPx = heightPx * aspectRatio;

  $: imageMarginPx = mmToPx(standee.imageMargin);
  $: feetMarginPx = mmToPx(standee.feetMargin * 2); // x2 as it's now "per side" margin

  // Total dimensions of the component
  // Structure:
  // [Inverted Image (Mirror)]
  // [Fold Line / Feet Margin]
  // [Upright Image (Main)]

  $: totalHeightPx = heightPx * 2 + imageMarginPx * 2 + feetMarginPx;
  $: totalWidthPx = widthPx + imageMarginPx * 2;

  // Position
  $: leftPx = mmToPx(instance.x);
  $: topPx = mmToPx(instance.y);

  function handleTokenMouseDown(e: MouseEvent, inst: StandeeInstance) {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const initialPoss = inst.token?.position || { x: 0, y: 0 };

    function onMouseMove(e: MouseEvent) {
      const dxPx = e.clientX - startX;
      const dyPx = e.clientY - startY;

      standees.update((all) =>
        all.map((s) => {
          if (s.id === standee.id) {
            // Update ALL instances for now as per "do this on the first one" assumption of template behavior,
            // or just THIS instance?
            // User said "move the tokens around, should be able to do this on the first one".
            // Let's update ALL instances of this standee to keep them consistent.
            const newInstances = s.instances.map((i) => ({
              ...i,
              token: i.token
                ? {
                    ...i.token,
                    position: {
                      x: initialPoss.x + dxPx, // Keep as PX for relative overlay? Or Convert to MM?
                      // The token overlay is absolute positioned in pixels within the standee-half.
                      // Let's stick to pixels for the overlay offset since it's visual.
                      y: initialPoss.y + dyPx,
                    },
                  }
                : undefined,
            }));
            return { ...s, instances: newInstances };
          }
          return s;
        }),
      );
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }

  function updateRulerOffset(newOffset: number) {
    const isHorizontal = standee.rulerOrientation === 'horizontal';
    const maxDim = isHorizontal ? pxToMm(totalHeightPx) : pxToMm(totalWidthPx);
    const rulerThicknessMm = pxToMm(25); // Ruler thickness is 25px in CSS
    const constrainedOffset = Math.max(
      -10,
      Math.min(newOffset, maxDim - (isHorizontal ? 0 : rulerThicknessMm)),
    );

    standees.update((all) =>
      all.map((s) => {
        if (s.id === standee.id) {
          return { ...s, rulerOffset: constrainedOffset };
        }
        return s;
      }),
    );
  }

  function handleRulerMouseDown(e: MouseEvent) {
    e.stopPropagation();
    const isHorizontal = standee.rulerOrientation === 'horizontal';
    const startPos = isHorizontal ? e.clientY : e.clientX;
    const initialOffset = standee.rulerOffset ?? (isHorizontal ? 0 : -5);

    function onMouseMove(e: MouseEvent) {
      const currentPos = isHorizontal ? e.clientY : e.clientX;
      const dPx = currentPos - startPos;
      const dMm = pxToMm(dPx);
      updateRulerOffset(initialOffset + dMm);
    }

    function onMouseUp() {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
</script>

<div
  class="standee-wrapper"
  role="group"
  aria-label="Standee"
  style="
    width: {totalWidthPx}px;
    height: {totalHeightPx}px;
    left: {leftPx}px;
    top: {topPx}px;
    --image-margin: {imageMarginPx}px;
  "
>
  <!-- 
    New Layout: Feet-to-Feet
    Top Half: Upright Image (Feet at bottom)
    Fold Area
    Bottom Half: Mirrored/Inverted Image (Feet at top)
  -->

  <!-- Upright Top Half -->
  <div class="standee-half upright">
    <!-- Image aligned to bottom -->
    <img src={standee.imageSrc} alt="standee" style="height: {heightPx}px;" />

    {#if instance.token?.enabled}
      <div
        class="token-overlay {instance.token.size}"
        role="button"
        tabindex="0"
        on:mousedown={(e) => handleTokenMouseDown(e, instance)}
        on:keydown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleTokenMouseDown(e as unknown as MouseEvent, instance);
          }
        }}
        style="
                background-color: {instance.token.bgColor};
                color: {instance.token.textColor};
                top: {5 + (instance.token.position?.y || 0)}px; 
                right: {5 - (instance.token.position?.x || 0)}px; 
                cursor: move;
            "
      >
        {instance.token.text}
      </div>
    {/if}
  </div>

  <!-- Fold Line / Feet Base -->
  <div class="fold-area" style="height: {feetMarginPx}px;">
    <div class="fold-line"></div>
  </div>

  <!-- Mirrored Bottom Half -->
  <div class="standee-half mirror">
    <!-- Image aligned to top, flipped vertically -->
    <img src={standee.imageSrc} alt="standee" style="height: {heightPx}px;" />

    {#if instance.token?.enabled}
      <div
        class="token-overlay {instance.token.size}"
        style="
                background-color: {instance.token.bgColor};
                color: {instance.token.textColor};
                bottom: {5 + (instance.token.position?.y || 0)}px; 
                right: {5 - (instance.token.position?.x || 0)}px;
                transform: rotate(180deg);
            "
      >
        {instance.token.text}
      </div>
    {/if}
  </div>

  <!-- Visual Ruler -->
  {#if showRuler}
    <div
      class="visual-ruler {standee.rulerOrientation || 'vertical'}"
      role="button"
      aria-label="Move Ruler"
      tabindex="0"
      on:mousedown={handleRulerMouseDown}
      on:keydown={(e) => {
        if (standee.rulerOrientation === 'horizontal') {
          if (e.key === 'ArrowUp') updateRulerOffset((standee.rulerOffset || 0) - 1);
          if (e.key === 'ArrowDown') updateRulerOffset((standee.rulerOffset || 0) + 1);
        } else {
          if (e.key === 'ArrowLeft') updateRulerOffset((standee.rulerOffset || -5) - 1);
          if (e.key === 'ArrowRight') updateRulerOffset((standee.rulerOffset || -5) + 1);
        }
      }}
      style="
        {standee.rulerOrientation === 'horizontal'
        ? `width: ${standee.rulerFullWidth ? totalWidthPx : widthPx}px; height: 25px; top: ${mmToPx(standee.rulerOffset || 10)}px; left: ${standee.rulerFullWidth ? 0 : imageMarginPx}px; cursor: ns-resize;`
        : `height: ${heightPx}px; bottom: ${heightPx + feetMarginPx + imageMarginPx}px; left: ${mmToPx(standee.rulerOffset || -10)}px; cursor: ew-resize;`}
        background: {standee.rulerOrientation === 'horizontal'
        ? `linear-gradient(to bottom, transparent ${Math.max(0, -mmToPx(standee.rulerOffset || 10))}px, rgba(255, 255, 255, 0.6) ${Math.max(0, -mmToPx(standee.rulerOffset || 10))}px)`
        : `linear-gradient(to right, transparent ${Math.max(0, -mmToPx(standee.rulerOffset || -10))}px, rgba(255, 255, 255, 0.6) ${Math.max(0, -mmToPx(standee.rulerOffset || -10))}px)`};
      "
    >
      <div class="ruler-line"></div>
      <div class="ruler-ticks"></div>
      <div class="ruler-label">
        {standee.rulerOrientation === 'horizontal'
          ? Math.round(pxToMm(standee.rulerFullWidth ? totalWidthPx : widthPx))
          : standee.height}mm
      </div>
    </div>
  {/if}
</div>

<style>
  .standee-wrapper * {
    box-sizing: border-box;
  }

  .standee-wrapper {
    position: absolute;
    border: 1px dashed var(--color-border); /* Thin border at the margin (cut line) */
    display: flex;
    flex-direction: column;
    user-select: none;
    cursor: default;
    background: white; /* Ensure white background even in dark mode */
    z-index: 60; /* Ensure visual priority over page breaks (z=50) */
  }

  .standee-wrapper:active {
    outline: none;
    z-index: 70; /* Lift when active */
  }

  .standee-half {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .standee-half.upright {
    align-items: flex-end; /* Feet at bottom */
    padding: var(--image-margin) var(--image-margin) 0 var(--image-margin); /* Top, Right, Bottom-0, Left */
  }

  .standee-half.mirror {
    align-items: flex-start; /* Feet at top */
    padding: 0 var(--image-margin) var(--image-margin) var(--image-margin); /* Top-0, Right, Bottom, Left */
  }

  .standee-half.mirror img {
    transform: scaleY(-1); /* Flip vertically */
    opacity: 0.8;
  }

  /* 
     Clarification: 
     Mirror Top: needs to be upside down. The "feet" are at the bottom of this div.
     Fold Area: simple spacer.
     Upright Bottom: "feet" are at the top of this div.
  */

  img {
    display: block;
    /* object-fit: contain; */
  }

  .fold-area {
    width: 100%;
    background: rgba(0, 0, 0, 0.05);
    position: relative;
    display: flex;
    align-items: center;
  }

  .fold-line {
    width: 100%;
    height: 1px;
    border-top: 1px dashed var(--color-text-light);
  }

  .token-overlay {
    position: absolute;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 10;
  }

  .token-overlay.small {
    width: 15px;
    height: 15px;
    font-size: 10px;
  }
  .token-overlay.medium {
    width: 25px;
    height: 25px;
    font-size: 14px;
  }
  .token-overlay.large {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }

  .visual-ruler {
    position: absolute;
    display: flex;
    z-index: 100;
    border-radius: 2px;
  }

  .visual-ruler.vertical {
    width: 25px;
    flex-direction: column;
    justify-content: center;
  }

  .visual-ruler.horizontal {
    height: 25px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }

  .ruler-line {
    position: absolute;
    background: #333;
  }

  .vertical .ruler-line {
    right: 0;
    top: 0;
    bottom: 0;
    width: 2px;
  }

  .horizontal .ruler-line {
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
  }

  .ruler-ticks {
    position: absolute;
    background-repeat: repeat;
  }

  .vertical .ruler-ticks {
    right: 0;
    top: 0;
    bottom: 0;
    width: 10px;
    background-image:
      linear-gradient(to top, #000 2px, transparent 2px),
      linear-gradient(to top, #444 1px, transparent 1px);
    background-size:
      100% 1cm,
      100% 1mm;
    background-position: bottom;
    background-repeat: repeat-y;
  }

  .horizontal .ruler-ticks {
    bottom: 0;
    left: 0;
    right: 0;
    height: 10px;
    background-image:
      linear-gradient(to right, #000 2px, transparent 2px),
      linear-gradient(to right, #444 1px, transparent 1px);
    background-size:
      1cm 100%,
      1mm 100%;
    background-position: left;
    background-repeat: repeat-x;
  }

  /* Cap lines at top/bottom/left/right */
  .visual-ruler::before,
  .visual-ruler::after {
    content: '';
    position: absolute;
    background: #333;
  }

  .vertical::before {
    top: 0;
    right: 0;
    width: 12px;
    height: 2px;
  }
  .vertical::after {
    bottom: 0;
    right: 0;
    width: 12px;
    height: 2px;
  }

  .horizontal::before {
    left: 0;
    bottom: 0;
    width: 2px;
    height: 12px;
  }
  .horizontal::after {
    right: 0;
    bottom: 0;
    width: 2px;
    height: 12px;
  }

  .ruler-label {
    position: absolute;
    font-size: 12px;
    white-space: nowrap;
    font-weight: bold;
    color: #333;
    background: white;
    padding: 0 4px;
    border-radius: 2px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  }

  .vertical .ruler-label {
    top: 50%;
    right: 14px;
    transform: translateY(-50%);
  }

  .horizontal .ruler-label {
    left: 50%;
    bottom: 14px;
    transform: translateX(-50%);
  }
</style>
