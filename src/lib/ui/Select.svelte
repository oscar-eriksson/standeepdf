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
    gap: 0.5rem;
    width: 100%;
  }

  .label {
    display: block;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-slate-500);
    margin-bottom: 0.25rem;
  }

  .select-container {
    position: relative;
    width: 100%;
  }

  select {
    width: 100%;
    padding: 0.75rem 1rem;
    padding-right: 2.5rem;
    background: var(--color-slate-900);
    border: 2px solid var(--color-slate-800);
    color: var(--color-slate-100);
    border-radius: 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    font-family: inherit;
    appearance: none;
    -webkit-appearance: none;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    box-sizing: border-box;
  }

  select:focus {
    outline: none;
    border-color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary), transparent 95%);
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
    transform: translateY(-1px);
  }

  select:hover:not(:focus):not(:disabled) {
    border-color: var(--color-slate-700);
    background: var(--color-slate-800);
  }

  select:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--color-slate-950);
  }

  .chevron {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--color-slate-500);
    display: flex;
    align-items: center;
    transition: color 0.2s;
  }

  .select-container:hover .chevron {
    color: var(--color-slate-300);
  }
</style>
