<script lang="ts">
  import { paperSettings, uiState } from '../stores/store';

  export let efficiencyPortrait: { numPages: number; ratio: string };
  export let efficiencyLandscape: { numPages: number; ratio: string };
  export let onOrientationChange: (o: 'p' | 'l') => void;

  const paperSizes = ['A4'];
</script>

<div class="setup-tab">
  <h3>Paper Settings</h3>

  <div class="control-group">
    <label for="paper-size">Format</label>
    <select id="paper-size" bind:value={$paperSettings.size}>
      {#each paperSizes as size}
        <option value={size}>{size}</option>
      {/each}
    </select>
  </div>

  <div class="control-group">
    <span class="control-label">Orientation</span>
    <div class="btn-group">
      <button
        class="btn-toggle"
        class:selected={$paperSettings.orientation === 'p' ||
          (!$paperSettings.orientation && $paperSettings.height > $paperSettings.width)}
        on:click={() => onOrientationChange('p')}
      >
        <div>Portrait</div>
        <div class="efficiency-stat">
          {efficiencyPortrait.numPages} pgs ({efficiencyPortrait.ratio}/pg)
        </div>
      </button>
      <button
        class="btn-toggle"
        class:selected={$paperSettings.orientation === 'l' ||
          (!$paperSettings.orientation && $paperSettings.width > $paperSettings.height)}
        on:click={() => onOrientationChange('l')}
      >
        <div>Landscape</div>
        <div class="efficiency-stat">
          {efficiencyLandscape.numPages} pgs ({efficiencyLandscape.ratio}/pg)
        </div>
      </button>
    </div>
  </div>

  <div class="control-group">
    <span class="control-label">Margins (mm)</span>
    <div class="grid-2">
      <label class="control-label"
        >Top <input type="number" bind:value={$paperSettings.margins.top} /></label
      >
      <label class="control-label"
        >Bottom <input type="number" bind:value={$paperSettings.margins.bottom} /></label
      >
      <label class="control-label"
        >Left <input type="number" bind:value={$paperSettings.margins.left} /></label
      >
      <label class="control-label"
        >Right <input type="number" bind:value={$paperSettings.margins.right} /></label
      >
    </div>
  </div>

  <div class="control-group">
    <label
      class="control-label"
      style="display: flex; align-items: center; gap: 8px; cursor: pointer;"
    >
      <input type="checkbox" bind:checked={$paperSettings.gridEnabled} /> Show Grid
    </label>
  </div>

  <div class="control-group">
    <label class="control-label" for="zoom-range"
      >Zoom ({Math.round($uiState.zoomLevel * 100)}%)</label
    >
    <input
      id="zoom-range"
      type="range"
      min="0.5"
      max="2"
      step="0.1"
      bind:value={$uiState.zoomLevel}
    />
  </div>
</div>

<style>
</style>
