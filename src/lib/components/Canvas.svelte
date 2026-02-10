<script lang="ts">
  import { paperSettings, standees, uiState } from '../stores/store';
  import { onMount } from 'svelte';
  import { mmToPx } from '../utils/units';
  import Standee from './Standee.svelte';

  let canvasContainer: HTMLDivElement;

  $: widthPx = mmToPx($paperSettings.width);
  $: heightPx = mmToPx($paperSettings.height);
  
  $: zoom = $uiState.zoomLevel;

  $: marginLeftPx = mmToPx($paperSettings.margins.left);
  $: marginTopPx = mmToPx($paperSettings.margins.top);
  $: marginRightPx = mmToPx($paperSettings.margins.right);
  $: marginBottomPx = mmToPx($paperSettings.margins.bottom);

  $: numPages = (() => {
      let maxY = 0;
      $standees.forEach(s => {
          s.instances.forEach(i => {
              // Estimate bottom of the standee
              const bottom = i.y + s.height + s.imageMargin + s.feetMargin; 
              if (bottom > maxY) maxY = bottom;
          });
      });
      
      const h = $paperSettings.height;
      if (h <= 0) return 1;
      return Math.max(1, Math.ceil(maxY / h));
  })();

  $: totalHeightPx = numPages * heightPx;

</script>

<div class="canvas-viewport">
  <div 
    class="paper-sheet"
    style="
      width: {widthPx}px; 
      height: {totalHeightPx}px; 
      transform: scale({zoom});
      transform-origin: top center;
    "
  >
    <!-- Render Page Breaks -->
    {#if numPages > 1}
        {#each Array(numPages - 1) as _, i}
            <div 
                class="page-break" 
                style="top: {(i + 1) * heightPx}px; width: {widthPx}px;"
            >
                <span>Page {i + 2}</span>
            </div>
        {/each}
    {/if}

    <!-- Printer Margins Overlay (Repeated for each page? Or just one big one?) -->
    <!-- Ideally we show margins per page. -->
    {#each Array(numPages) as _, i}
        <div 
            class="printable-area"
            style="
                left: {marginLeftPx}px;
                top: {(i * heightPx) + marginTopPx}px;
                width: {widthPx - marginLeftPx - marginRightPx}px;
                height: {heightPx - marginTopPx - marginBottomPx}px;
                border: {$paperSettings.gridEnabled ? '1px dashed #ccc' : 'none'};
            "
        >
        </div>
    {/each}

    <!-- Standees Layer (Z-index high) -->
    <!-- We render standees in a single layer as they have absolute positions -->
    {#each $standees as standeeType (standeeType.id)}
    {#each standeeType.instances as instance (instance.id)}
        <Standee 
            standee={standeeType} 
            {instance} 
        />
    {/each}
    {/each}

    <!-- Grid Lines (Optional visual) -->
    {#if $paperSettings.gridEnabled}
         <!-- Maybe a background pattern or SVG overlay -->
    {/if}
  </div>
</div>

<style>
  .canvas-viewport {
    flex: 1;
    background-color: #333;
    overflow: auto;
    display: flex;
    justify-content: center;
    padding: 2rem;
  }

  .paper-sheet {
    background-color: white;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    position: relative;
    transition: width 0.2s, height 0.2s, transform 0.2s;
  }

  .printable-area {
    position: absolute;
    /* Optional: hatch pattern for margins outside this area could be on parent */
    pointer-events: none; /* Let clicks pass through if empty */
    /* border: 1px dashed red; debug */
  }

  .page-break {
      position: absolute;
      left: 0;
      border-top: 2px dashed #ccc;
      height: 0;
      pointer-events: none;
      display: flex;
      justify-content: flex-end;
  }

  .page-break span {
      background: #ccc;
      color: #666;
      font-size: 0.8rem;
      padding: 2px 6px;
      margin-top: -10px;
      margin-right: 10px;
      border-radius: 4px;
  }
</style>
