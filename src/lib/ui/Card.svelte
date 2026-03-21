<script lang="ts">
  export let padding: 'none' | 'sm' | 'md' | 'lg' = 'md';
</script>

<div class="card padding-{padding}">
  <slot />
</div>

<style>
  .card {
    background-color: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 2rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card:hover {
    border-color: rgba(255, 255, 255, 0.1);
    background-color: rgba(15, 23, 42, 0.7);
    transform: translateY(-2px);
  }

  .padding-none {
    padding: 0;
  }
  .padding-sm {
    padding: 1rem;
  }
  .padding-md {
    padding: 2rem;
  }
  .padding-lg {
    padding: 3rem;
  }
</style>
