<script lang="ts">
  export let value: string | number;
  export let label: string = '';
  export let id: string = '';
  export let options: { value: string | number; label: string }[] = [];
  export let disabled: boolean = false;

  $: selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div class="select-wrapper">
  {#if label}
    <label for={selectId} class="label">{label}</label>
  {/if}

  <div class="select-container">
    <select id={selectId} bind:value {disabled} on:change on:blur>
      <slot>
        {#each options as option (option.value)}
          <option value={option.value}>{option.label}</option>
        {/each}
      </slot>
    </select>
    <div class="chevron">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg
      >
    </div>
  </div>
</div>

<style>
  .select-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
    width: 100%;
  }

  .label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-muted);
  }

  .select-container {
    position: relative;
    width: 100%;
  }

  select {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    padding-right: var(--space-6);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    font-family: inherit;
    appearance: none;
    -webkit-appearance: none;
    transition: all var(--transition-fast);
    cursor: pointer;
    box-sizing: border-box;
  }

  select:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.1);
  }

  select:disabled {
    background-color: var(--color-bg);
    cursor: not-allowed;
    opacity: 0.7;
  }

  .chevron {
    position: absolute;
    right: var(--space-2);
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--color-text-muted);
    display: flex;
    align-items: center;
  }
</style>
