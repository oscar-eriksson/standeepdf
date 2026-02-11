<script lang="ts">
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
</script>

<div class="card padding-{padding}">
  <slot />
</div>

<style>
  .card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  .padding-none {
    padding: 0;
  }

  .padding-sm {
    padding: var(--space-3);
  }

  .padding-md {
    padding: var(--space-5);
  }

  .padding-lg {
    padding: var(--space-6);
  }
</style>
