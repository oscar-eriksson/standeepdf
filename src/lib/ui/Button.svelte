<script lang="ts">
  let {
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    title = '',
    onclick,
    children,
  } = $props<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    title?: string;
    onclick?: (e: MouseEvent) => void;
    children?: import('svelte').Snippet;
  }>();
</script>

<button {type} class="btn {variant} {size}" {disabled} {title} {onclick}>
  {#if children}
    {@render children()}
  {/if}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid transparent;
    border-radius: 1.25rem;
    font-family: inherit;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    line-height: 1;
    gap: 0.5rem;
    position: relative;
    overflow: hidden;
  }

  .btn:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
  }

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none !important;
  }

  /* Sizes */
  .sm {
    padding: 0.625rem 1.25rem;
    font-size: 10px;
  }

  .md {
    padding: 0.875rem 1.75rem;
    font-size: 12px;
  }

  .lg {
    padding: 1.125rem 2.25rem;
    font-size: 14px;
  }

  /* Variants */
  .primary {
    background: linear-gradient(135deg, var(--color-purple-600), var(--color-pink-600));
    color: white;
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    border: none;
  }
  .primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.4);
    filter: brightness(1.1);
  }
  .primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .secondary {
    background-color: var(--color-slate-900);
    color: var(--color-slate-200);
    border-color: var(--color-slate-800);
  }
  .secondary:hover:not(:disabled) {
    background-color: var(--color-slate-800);
    border-color: var(--color-slate-700);
    color: white;
    transform: translateY(-1px);
  }

  .danger {
    background-color: var(--color-rose-600);
    color: white;
    box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2);
  }
  .danger:hover:not(:disabled) {
    background-color: var(--color-rose-500);
    transform: translateY(-1px);
  }

  .ghost {
    background-color: transparent;
    color: var(--color-slate-500);
    border-color: transparent;
  }
  .ghost:hover:not(:disabled) {
    background-color: var(--color-slate-900);
    color: var(--color-slate-200);
  }
</style>
