<script lang="ts">
  import type { Standee } from '../stores/store';

  export let selectedStandee: Standee;
  export let onUpdateTokenSettings: (mode: 'numeric' | 'alphabetic', startValue: string) => void;
  export let onUpdateTokenPosition: (axis: 'x' | 'y', value: number) => void;
  export let onUpdateTokenStyle: (prop: string, value: any) => void;
</script>

<div class="token-settings sub-controls">
  <span class="control-label">Sequence</span>
  <div class="grid-2">
    <select
      value={selectedStandee.tokenSettings?.mode || 'alphabetic'}
      on:change={(e) => {
        const newMode = e.currentTarget.value as 'numeric' | 'alphabetic';
        let newStart = selectedStandee.tokenSettings?.startValue;
        if (newMode === 'alphabetic' && (!newStart || !isNaN(Number(newStart)))) newStart = 'A';
        if (newMode === 'numeric' && (!newStart || isNaN(Number(newStart)))) newStart = '1';
        onUpdateTokenSettings(newMode, newStart || '1');
      }}
    >
      <option value="numeric">1, 2, 3...</option>
      <option value="alphabetic">A, B, C...</option>
    </select>
    <input
      type="text"
      title="Start Value"
      value={selectedStandee.tokenSettings?.startValue || 'A'}
      on:change={(e) =>
        onUpdateTokenSettings(
          selectedStandee.tokenSettings?.mode || 'alphabetic',
          e.currentTarget.value,
        )}
    />
  </div>

  <span class="control-label">Position Offset (px)</span>
  <div class="grid-2">
    <label class="control-label" style="font-size: 0.8em;"
      >X <input
        type="number"
        value={selectedStandee.instances[0]?.token?.position?.x || 0}
        on:input={(e) => onUpdateTokenPosition('x', +e.currentTarget.value)}
      /></label
    >
    <label class="control-label" style="font-size: 0.8em;"
      >Y <input
        type="number"
        value={selectedStandee.instances[0]?.token?.position?.y || 0}
        on:input={(e) => onUpdateTokenPosition('y', +e.currentTarget.value)}
      /></label
    >
  </div>

  <span class="control-label">Color</span>
  <div class="grid-2">
    <div class="color-control">
      <label class="control-label" style="font-size: 0.7em;" for="token-bg-{selectedStandee.id}"
        >BG</label
      >
      <input
        id="token-bg-{selectedStandee.id}"
        type="color"
        value={selectedStandee.instances[0]?.token?.bgColor}
        on:input={(e) => onUpdateTokenStyle('bgColor', e.currentTarget.value)}
        title="Background Color"
      />
    </div>
    <div class="color-control">
      <label class="control-label" style="font-size: 0.7em;" for="token-text-{selectedStandee.id}"
        >Text</label
      >
      <input
        id="token-text-{selectedStandee.id}"
        type="color"
        value={selectedStandee.instances[0]?.token?.textColor}
        on:input={(e) => onUpdateTokenStyle('textColor', e.currentTarget.value)}
        title="Text Color"
      />
    </div>
  </div>

  <label class="control-label" for="token-size">Size</label>
  <select
    id="token-size"
    value={selectedStandee.instances[0]?.token?.size}
    on:change={(e) => onUpdateTokenStyle('size', e.currentTarget.value)}
  >
    <option value="small">Small</option>
    <option value="medium">Medium</option>
    <option value="large">Large</option>
  </select>
</div>

<style>
  .color-control {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #f8f8f8;
    padding: 4px 8px;
    border-radius: 4px;
  }

  input[type='color'] {
    width: 30px;
    height: 30px;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }
</style>
