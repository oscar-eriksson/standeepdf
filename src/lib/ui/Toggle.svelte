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
    gap: 0.5rem;
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

  .toggle-container {
    display: flex;
    background: var(--color-slate-950);
    border: 2px solid var(--color-slate-800);
    border-radius: 1.25rem;
    padding: 0.25rem;
    gap: 0.25rem;
    transition: all 0.2s;
  }

  .toggle-container:hover {
    border-color: var(--color-slate-700);
  }

  .toggle-option {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.625rem 1rem;
    border: none;
    border-radius: 1rem;
    background: transparent;
    color: var(--color-slate-500);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toggle-option:hover:not(.selected) {
    color: var(--color-slate-300);
    background: var(--color-slate-900);
  }

  .toggle-option.selected {
    background: var(--color-slate-800);
    color: white;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  /* Specifically for the paper orientation toggle which might use icons */
  .icon {
    display: flex;
    align-items: center;
    opacity: 0.6;
    transition: opacity 0.2s;
  }

  .toggle-option.selected .icon {
    opacity: 1;
    color: var(--color-primary);
  }
</style>
