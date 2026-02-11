<script lang="ts">
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let title: string = '';
</script>

<button {type} class="btn {variant} {size}" {disabled} {title} on:click>
  <slot />
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    font-family: inherit;
    font-weight: var(--font-weight-medium);
    cursor: pointer;
    transition: all var(--transition-fast);
    line-height: 1;
    gap: var(--space-2);
  }

  .btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(100, 108, 255, 0.3);
  }

  .btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Sizes */
  .sm {
    padding: var(--space-1) var(--space-2);
    font-size: var(--font-size-sm);
  }

  .md {
    padding: var(--space-2) var(--space-4);
    font-size: var(--font-size-sm);
  }

  .lg {
    padding: var(--space-3) var(--space-5);
    font-size: var(--font-size-base);
  }

  /* Variants */
  .primary {
    background-color: var(--color-primary);
    color: var(--color-primary-text);
  }
  .primary:hover:not(:disabled) {
    background-color: var(--color-primary-hover);
  }

  .secondary {
    background-color: var(--color-surface);
    color: var(--color-text);
    border-color: var(--color-border);
  }
  .secondary:hover:not(:disabled) {
    background-color: var(--color-surface-hover);
    border-color: var(--color-border-hover);
  }

  .danger {
    background-color: var(--color-danger);
    color: var(--color-danger-text);
  }
  .danger:hover:not(:disabled) {
    background-color: var(--color-danger-hover);
  }

  .ghost {
    background-color: transparent;
    color: var(--color-text-muted);
  }
  .ghost:hover:not(:disabled) {
    background-color: rgba(0, 0, 0, 0.05);
    color: var(--color-text);
  }
</style>
