<script lang="ts">
  import type { Standee, StandeeInstance } from '../stores/store';
  import { mmToPx, pxToMm } from '../utils/units';
  import { createEventDispatcher } from 'svelte';
  import { standees, uiState } from '../stores/store';

  export let standee: Standee;
  export let instance: StandeeInstance;

  const dispatch = createEventDispatcher();

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
  
  $: totalHeightPx = (heightPx * 2) + (imageMarginPx * 2) + feetMarginPx;
  $: totalWidthPx = widthPx + (imageMarginPx * 2);

  // Position
  $: leftPx = mmToPx(instance.x);
  $: topPx = mmToPx(instance.y);

  function handleTokenMouseDown(e: MouseEvent, inst: StandeeInstance) {
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const initialPoss = inst.token?.position || {x: 0, y: 0};
      
      function onMouseMove(e: MouseEvent) {
          const dxPx = e.clientX - startX;
          const dyPx = e.clientY - startY;
          
          standees.update(all => all.map(s => {
              if (s.id === standee.id) {
                  // Update ALL instances for now as per "do this on the first one" assumption of template behavior, 
                  // or just THIS instance? 
                  // User said "move the tokens around, should be able to do this on the first one". 
                  // Let's update ALL instances of this standee to keep them consistent.
                  const newInstances = s.instances.map(i => ({
                      ...i,
                      token: i.token ? {
                          ...i.token,
                          position: {
                              x: initialPoss.x + dxPx, // Keep as PX for relative overlay? Or Convert to MM?
                              // The token overlay is absolute positioned in pixels within the standee-half.
                              // Let's stick to pixels for the overlay offset since it's visual.
                              y: initialPoss.y + dyPx
                          }
                      } : undefined
                  }));
                  return { ...s, instances: newInstances };
              }
              return s;
          }));
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
  on:mousedown={handleMouseDown}
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
            on:mousedown={(e) => handleTokenMouseDown(e, instance)}
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
</div>

<style>
  .standee-wrapper * {
    box-sizing: border-box;
  }

  .standee-wrapper {
    position: absolute;
    border: 1px dashed #ccc; /* Thin border at the margin (cut line) */
    display: flex;
    flex-direction: column;
    user-select: none;
    cursor: grab;
  }
  
  .standee-wrapper:active {
      cursor: grabbing;
      outline: 2px solid var(--primary-color);
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
      background: rgba(0,0,0,0.05);
      position: relative;
      display: flex;
      align-items: center;
  }

  .fold-line {
      width: 100%;
      height: 1px;
      border-top: 1px dashed #999;
  }
  
  .token-overlay {
      position: absolute;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      z-index: 10;
  }
  
  .token-overlay.small { width: 15px; height: 15px; font-size: 10px; }
  .token-overlay.medium { width: 25px; height: 25px; font-size: 14px; }
  .token-overlay.large { width: 35px; height: 35px; font-size: 18px; }

</style>
