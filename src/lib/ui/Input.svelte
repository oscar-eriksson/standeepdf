<script lang="ts">
  export let value: string | number;
  export let type: 'text' | 'number' | 'password' | 'email' = 'text';
  export let label: string = '';
  export let id: string = '';
  export let placeholder: string = '';
  export let min: string | number | undefined = undefined;
  export let max: string | number | undefined = undefined;
  export let step: string | number | undefined = undefined;
  export let disabled: boolean = false;
  export let error: string = '';

  $: inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div class="input-wrapper">
  {#if label}
    <label for={inputId} class="label">{label}</label>
  {/if}

  <input
    {id}
    {type}
    bind:value
    {placeholder}
    {min}
    {max}
    {step}
    {disabled}
    class:has-error={!!error}
    on:input
    on:change
    on:focus
    on:blur
  />

  {#if error}
    <div class="error-msg">{error}</div>
  {/if}
</div>

<style>
  .input-wrapper {
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

  input {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-surface);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    font-family: inherit;
    transition: all var(--transition-fast);
    box-sizing: border-box;
  }

  input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.1);
  }

  input:disabled {
    background-color: var(--color-bg);
    cursor: not-allowed;
    opacity: 0.7;
  }

  input.has-error {
    border-color: var(--color-danger);
  }

  input.has-error:focus {
    box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1);
  }

  .error-msg {
    color: var(--color-danger);
    font-size: 0.75rem;
  }
</style>
