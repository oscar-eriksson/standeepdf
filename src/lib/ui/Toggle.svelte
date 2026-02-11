<script lang="ts">
  export let options: { value: string; label: string; icon?: string }[] = [];
  export let value: string;
  export let label: string = '';

  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  function select(val: string) {
    if (value !== val) {
      value = val;
      dispatch('change', val);
    }
  }
</script>

<div class="toggle-wrapper">
  {#if label}
    <span class="label">{label}</span>
  {/if}

  <div class="toggle-container" role="radiogroup">
    {#each options as option (option.value)}
      <button
        type="button"
        class="toggle-option"
        class:selected={value === option.value}
        role="radio"
        aria-checked={value === option.value}
        on:click={() => select(option.value)}
      >
        {#if option.icon}
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          <span class="icon">{@html option.icon}</span>
        {/if}
        <span>{option.label}</span>
      </button>
    {/each}
  </div>
</div>

<style>
  .toggle-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .label {
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    color: var(--color-text-muted);
  }

  .toggle-container {
    display: flex;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: 2px;
    gap: 2px;
  }

  .toggle-option {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-2);
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--color-text-muted);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
  }

  .toggle-option:hover:not(.selected) {
    background: rgba(0, 0, 0, 0.03);
    color: var(--color-text);
  }

  .toggle-option.selected {
    background: var(--color-surface);
    color: var(--color-primary);
    box-shadow: var(--shadow-sm);
    font-weight: var(--font-weight-bold);
  }

  .icon {
    display: flex;
    align-items: center;
  }
</style>
