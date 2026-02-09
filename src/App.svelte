<script lang="ts">
  import Canvas from './lib/components/Canvas.svelte';
  import Controls from './lib/components/Controls.svelte';
</script>

<main class="app-container">
  <Controls />
  <Canvas />
</main>

<style>
  .app-container {
    display: flex;
    flex-direction: row;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }
</style>
