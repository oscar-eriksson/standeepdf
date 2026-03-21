<script lang="ts">
  import type { Standee } from '../stores/store';

  export let selectedStandee: Standee;
  export let onUpdateTokenSettings: (mode: 'numeric' | 'alphabetic', startValue: string) => void;
  export let onUpdateTokenPosition: (axis: 'x' | 'y', value: number) => void;
  export let onUpdateTokenStyle: (prop: string, value: any) => void;
</script>

<div class="token-settings sub-controls">
  <div class="control-section">
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
  </div>

  <div class="control-section">
    <span class="control-label">Position Offset (px)</span>
    <div class="grid-2">
      <div class="input-with-label">
        <label for="pos-x">X</label>
        <input
          id="pos-x"
          type="number"
          value={selectedStandee.instances[0]?.token?.position?.x || 0}
          on:input={(e) => onUpdateTokenPosition('x', +e.currentTarget.value)}
        />
      </div>
      <div class="input-with-label">
        <label for="pos-y">Y</label>
        <input
          id="pos-y"
          type="number"
          value={selectedStandee.instances[0]?.token?.position?.y || 0}
          on:input={(e) => onUpdateTokenPosition('y', +e.currentTarget.value)}
        />
      </div>
    </div>
  </div>

  <div class="control-section">
    <span class="control-label">Style</span>
    <div class="grid-2">
      <div class="color-control">
        <label for="token-bg-{selectedStandee.id}">BG</label>
        <div
          class="color-swatch"
          style="background: {selectedStandee.instances[0]?.token?.bgColor}"
        >
          <input
            id="token-bg-{selectedStandee.id}"
            type="color"
            value={selectedStandee.instances[0]?.token?.bgColor}
            on:input={(e) => onUpdateTokenStyle('bgColor', e.currentTarget.value)}
          />
        </div>
      </div>
      <div class="color-control">
        <label for="token-text-{selectedStandee.id}">Text</label>
        <div
          class="color-swatch"
          style="background: {selectedStandee.instances[0]?.token?.textColor}"
        >
          <input
            id="token-text-{selectedStandee.id}"
            type="color"
            value={selectedStandee.instances[0]?.token?.textColor}
            on:input={(e) => onUpdateTokenStyle('textColor', e.currentTarget.value)}
          />
        </div>
      </div>
    </div>
    <div style="margin-top: 0.75rem;">
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
  </div>
</div>

<style>
  .token-settings {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-top: 0.5rem;
    padding-top: 1.25rem;
    border-top: 1px solid var(--color-slate-800);
  }

  .control-section {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .input-with-label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .input-with-label label {
    font-size: 9px;
    margin-bottom: 0;
    color: var(--color-slate-500);
  }

  .color-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--color-slate-900);
    padding: 0.5rem 0.75rem;
    border-radius: 1rem;
    border: 1px solid var(--color-slate-800);
    transition: var(--transition-normal);
  }

  .color-control label {
    font-size: 10px;
    margin-bottom: 0;
    font-weight: 700;
  }

  .color-control:hover {
    border-color: var(--color-slate-700);
    background: var(--color-slate-800);
  }

  .color-swatch {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: 1px solid var(--color-slate-700);
    position: relative;
    overflow: hidden;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
  }

  .color-swatch input[type='color'] {
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    opacity: 0;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
</style>
