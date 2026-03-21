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
    transition: color 0.2s;
  }

  .input-wrapper:hover .label {
    color: var(--color-slate-400);
  }

  input {
    width: 100%;
    background: var(--color-slate-900);
    border: 2px solid var(--color-slate-800);
    color: var(--color-slate-100);
    padding: 0.75rem 1rem;
    border-radius: 1.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    box-sizing: border-box;
  }

  input:focus {
    outline: none;
    border-color: var(--color-primary);
    background: color-mix(in srgb, var(--color-primary), transparent 95%);
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
    transform: translateY(-1px);
  }

  input:hover:not(:focus):not(:disabled) {
    border-color: var(--color-slate-700);
    background: var(--color-slate-800);
  }

  input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--color-slate-950);
  }

  input.has-error {
    border-color: var(--color-danger);
  }

  input.has-error:focus {
    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1);
  }

  .error-msg {
    color: var(--color-danger);
    font-size: 0.75rem;
    font-weight: 600;
    margin-top: 0.25rem;
  }
</style>
