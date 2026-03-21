<script lang="ts">
  import Canvas from './lib/components/Canvas.svelte';
  import Controls from './lib/components/Controls.svelte';
  import Header from './lib/components/Header.svelte';
  import Footer from './lib/components/Footer.svelte';
  import AssemblyGuide from './lib/components/AssemblyGuide.svelte';
  import { uiState } from './lib/stores/store';
</script>

<div
  class="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200 flex flex-col"
>
  <Header />

  {#if $uiState.page === 'home'}
    <main
      class="flex-1 p-4 lg:p-10 w-full grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 lg:gap-10 min-h-0 overflow-y-auto lg:overflow-hidden"
    >
      <aside class="space-y-6 lg:overflow-y-auto lg:pr-2">
        <Controls />
      </aside>

      <section
        class="space-y-6 min-w-0 lg:overflow-auto bg-slate-900/30 rounded-3xl border border-slate-800/50 flex flex-col p-4 lg:p-0"
      >
        <Canvas />
      </section>
    </main>
  {:else}
    <AssemblyGuide />
  {/if}

  <Footer />
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: var(--color-slate-950);
  }
</style>
