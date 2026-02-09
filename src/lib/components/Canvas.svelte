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

</script>

<div class="canvas-viewport">
  <div 
    class="paper-sheet"
    style="
      width: {widthPx}px; 
      height: {heightPx}px; 
      transform: scale({zoom});
      transform-origin: top center;
    "
  >
    <!-- Printer Margins Overlay -->
    <div 
      class="printable-area"
      style="
        left: {marginLeftPx}px;
        top: {marginTopPx}px;
        width: {widthPx - marginLeftPx - marginRightPx}px;
        height: {heightPx - marginTopPx - marginBottomPx}px;
        border: {$paperSettings.gridEnabled ? '1px dashed #ccc' : 'none'};
      "
    >
      {#each $standees as standeeType (standeeType.id)}
        {#each standeeType.instances as instance (instance.id)}
            <Standee 
              standee={standeeType} 
              {instance} 
            />
        {/each}
      {/each}
    </div>

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
</style>
