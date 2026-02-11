<script lang="ts">
  import { paperSettings, uiState } from '../stores/store';
  import Input from '../ui/Input.svelte';
  import Select from '../ui/Select.svelte';
  import Toggle from '../ui/Toggle.svelte';
  import Card from '../ui/Card.svelte';

  export let efficiencyPortrait: { numPages: number; ratio: string };
  export let efficiencyLandscape: { numPages: number; ratio: string };
  export let onOrientationChange: (o: 'p' | 'l') => void;

  const paperSizes = ['A4'];
  const paperOptions = paperSizes.map((s) => ({ value: s, label: s }));

  $: orientationOptions = [
    {
      value: 'p',
      label: `Portrait (${efficiencyPortrait.numPages} pgs)`,
      icon: `<svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor"><rect x="2" y="2" width="10" height="14" rx="1" stroke="currentColor" fill="none"/></svg>`,
    },
    {
      value: 'l',
      label: `Landscape (${efficiencyLandscape.numPages} pgs)`,
      icon: `<svg width="18" height="14" viewBox="0 0 18 14" fill="currentColor"><rect x="2" y="2" width="14" height="10" rx="1" stroke="currentColor" fill="none"/></svg>`,
    },
  ];

  function handleOrientationChange(e: CustomEvent<string>) {
    onOrientationChange(e.detail as 'p' | 'l');
  }
</script>

<div class="setup-tab">
  <Card padding="md">
    <h3 class="section-title">Paper Settings</h3>

    <div class="control-group">
      <Select label="Format" bind:value={$paperSettings.size} options={paperOptions} />
    </div>

    <div class="control-group">
      <Toggle
        label="Orientation"
        value={$paperSettings.orientation ||
          ($paperSettings.height > $paperSettings.width ? 'p' : 'l')}
        options={orientationOptions}
        on:change={handleOrientationChange}
      />
    </div>

    <div class="control-group">
      <span class="control-label">Margins (mm)</span>
      <div class="grid-2">
        <Input type="number" label="Top" bind:value={$paperSettings.margins.top} />
        <Input type="number" label="Bottom" bind:value={$paperSettings.margins.bottom} />
        <Input type="number" label="Left" bind:value={$paperSettings.margins.left} />
        <Input type="number" label="Right" bind:value={$paperSettings.margins.right} />
      </div>
    </div>
  </Card>

  <div class="spacer"></div>

  <Card padding="md">
    <div class="control-group checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" bind:checked={$paperSettings.gridEnabled} />
        <span>Show Grid</span>
      </label>
    </div>

    <div class="control-group">
      <label class="control-label" for="zoom-range">
        Zoom ({Math.round($uiState.zoomLevel * 100)}%)
      </label>
      <input
        id="zoom-range"
        type="range"
        min="0.5"
        max="2"
        step="0.1"
        bind:value={$uiState.zoomLevel}
        class="range-slider"
      />
    </div>
  </Card>
</div>

<style>
  .setup-tab {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .section-title {
    margin: 0 0 var(--space-4) 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }

  .spacer {
    height: var(--space-2);
  }

  /* Custom overrides for specific layouts not covered by components yet */
  .checkbox-group {
    margin-bottom: var(--space-4);
  }

  .checkbox-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    cursor: pointer;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }

  .range-slider {
    width: 100%;
    accent-color: var(--color-primary);
  }
</style>
