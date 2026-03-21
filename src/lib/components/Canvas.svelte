<script lang="ts">
  import { paperSettings, standees, uiState } from '../stores/store';
  import { mmToPx } from '../utils/units';
  import Standee from './Standee.svelte';

  $: widthPx = mmToPx($paperSettings.width);
  $: heightPx = mmToPx($paperSettings.height);

  $: zoom = $uiState.zoomLevel;

  $: marginLeftPx = mmToPx($paperSettings.margins.left);
  $: marginTopPx = mmToPx($paperSettings.margins.top);
  $: marginRightPx = mmToPx($paperSettings.margins.right);
  $: marginBottomPx = mmToPx($paperSettings.margins.bottom);

  $: numPages = (() => {
    let maxY = 0;
    $standees.forEach((s) => {
      s.instances.forEach((i) => {
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
      {#each Array(numPages - 1) as _, i (i)}
        <div class="page-break" style="top: {(i + 1) * heightPx}px; width: {widthPx}px;">
          <span>Page {i + 2}</span>
        </div>
      {/each}
    {/if}

    <!-- Printer Margins Overlay (Repeated for each page? Or just one big one?) -->
    <!-- Ideally we show margins per page. -->
    {#each Array(numPages) as _, i (i)}
      <div
        class="printable-area"
        style="
                left: {marginLeftPx}px;
                top: {i * heightPx + marginTopPx}px;
                width: {widthPx - marginLeftPx - marginRightPx}px;
                height: {heightPx - marginTopPx - marginBottomPx}px;
                border: {$paperSettings.gridEnabled ? '1px dashed var(--color-border)' : 'none'};
            "
      ></div>
    {/each}

    <!-- Standees Layer (Z-index high) -->
    <!-- We render standees in a single layer as they have absolute positions -->
    {#each $standees as standeeType (standeeType.id)}
      {#each standeeType.instances as instance, idx (instance.id)}
        <Standee
          standee={standeeType}
          {instance}
          showRuler={idx === 0 && standeeType.rulerEnabled}
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
    width: 100%;
    min-height: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Default to start for scrollability */
    padding: 3rem;
    box-sizing: border-box;
  }

  .paper-sheet {
    background-color: white;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    position: relative;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    margin: auto; /* This centers it vertically if there is space */
    flex-shrink: 0;
  }

  .printable-area {
    position: absolute;
    pointer-events: none;
  }

  .page-break {
    position: absolute;
    left: 0;
    border-top: 1px dashed var(--color-slate-300);
    height: 0;
    pointer-events: none;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    z-index: 50;
  }

  .page-break span {
    background: var(--color-slate-900);
    color: var(--color-slate-400);
    border: 1px solid var(--color-slate-800);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 4px 12px;
    margin-right: 24px;
    border-radius: 2rem;
  }
</style>
