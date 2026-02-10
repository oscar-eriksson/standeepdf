<script lang="ts">
  import type { Standee } from '../stores/store';
  import TokenSettings from './TokenSettings.svelte';

  export let selectedStandee: Standee;
  export let onEditImage: () => void;
  export let onRemove: () => void;
  export let onUpdateStandee: (prop: string, value: any) => void;
  export let onUpdateInstances: (quantity: number) => void;
  export let onToggleToken: (enabled: boolean) => void;
  export let onUpdateTokenSettings: (mode: 'numeric' | 'alphabetic', startValue: string) => void;
  export let onUpdateTokenPosition: (axis: 'x' | 'y', value: number) => void;
  export let onUpdateTokenStyle: (prop: string, value: any) => void;
</script>

<div class="controls-tab">
  <h3>Standee Settings</h3>

  <div class="control-group">
    <div class="grid-2">
      <button on:click={onEditImage}>Edit Image</button>
      <button class="danger" on:click={onRemove}>Delete</button>
    </div>
  </div>

  <div class="control-group">
    <label class="control-label" for="height-input">Height (mm)</label>
    <input
      id="height-input"
      type="number"
      value={selectedStandee.height}
      on:input={(e) => onUpdateStandee('height', +e.currentTarget.value)}
    />
    <div class="btn-group" style="margin-top: 8px;">
      <button
        class="btn-toggle"
        class:selected={selectedStandee.height === 25}
        on:click={() => onUpdateStandee('height', 25)}>Tiny</button
      >
      <button
        class="btn-toggle"
        class:selected={selectedStandee.height === 38}
        on:click={() => onUpdateStandee('height', 38)}>Small</button
      >
      <button
        class="btn-toggle"
        class:selected={selectedStandee.height === 50}
        on:click={() => onUpdateStandee('height', 50)}>Med</button
      >
      <button
        class="btn-toggle"
        class:selected={selectedStandee.height === 75}
        on:click={() => onUpdateStandee('height', 75)}>Lrg</button
      >
    </div>
  </div>

  <div class="control-group">
    <label class="control-label" for="quantity-input">Quantity</label>
    <input
      id="quantity-input"
      type="number"
      min="1"
      value={selectedStandee.quantity}
      on:input={(e) => onUpdateInstances(+e.currentTarget.value)}
    />
  </div>

  <div class="control-group">
    <span class="control-label">Base Margins (mm)</span>
    <div class="grid-2">
      <label class="control-label"
        >Image <input
          type="number"
          value={selectedStandee.imageMargin}
          on:input={(e) => onUpdateStandee('imageMargin', +e.currentTarget.value)}
        /></label
      >
      <label class="control-label"
        >Feet <input
          type="number"
          value={selectedStandee.feetMargin}
          on:input={(e) => onUpdateStandee('feetMargin', +e.currentTarget.value)}
        /></label
      >
    </div>
  </div>

  <div class="control-group">
    <label
      class="control-label"
      style="display: flex; align-items: center; gap: 8px; cursor: pointer;"
    >
      <input
        type="checkbox"
        checked={selectedStandee.rulerEnabled}
        on:change={(e) => onUpdateStandee('rulerEnabled', e.currentTarget.checked)}
      />
      Show Ruler
    </label>

    {#if selectedStandee.rulerEnabled}
      <div class="btn-group" style="margin-top: 8px;">
        <button
          class="btn-toggle"
          class:selected={(selectedStandee.rulerOrientation || 'vertical') === 'vertical'}
          on:click={() => onUpdateStandee('rulerOrientation', 'vertical')}
        >
          Height (V)
        </button>
        <button
          class="btn-toggle"
          class:selected={selectedStandee.rulerOrientation === 'horizontal'}
          on:click={() => onUpdateStandee('rulerOrientation', 'horizontal')}
        >
          Width (H)
        </button>
      </div>
      {#if selectedStandee.rulerOrientation === 'horizontal'}
        <label
          class="control-label"
          style="display: flex; align-items: center; gap: 8px; cursor: pointer; margin-top: 8px; font-size: 0.8rem;"
        >
          <input
            type="checkbox"
            checked={selectedStandee.rulerFullWidth}
            on:change={(e) => onUpdateStandee('rulerFullWidth', e.currentTarget.checked)}
          />
          Measure Full Width (incl. margins)
        </label>
      {/if}
    {/if}
  </div>

  <div class="control-group">
    <label
      class="control-label"
      style="display: flex; align-items: center; gap: 8px; cursor: pointer;"
    >
      <input
        type="checkbox"
        checked={selectedStandee.instances[0]?.token?.enabled}
        on:change={(e) => onToggleToken(e.currentTarget.checked)}
      />
      Enable Numbering Tokens
    </label>

    {#if selectedStandee.instances[0]?.token?.enabled}
      <TokenSettings
        {selectedStandee}
        {onUpdateTokenSettings}
        {onUpdateTokenPosition}
        {onUpdateTokenStyle}
      />
    {/if}
  </div>
</div>

<style>
</style>
