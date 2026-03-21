<script lang="ts">
  import { uiState } from '../stores/store';

  function setPage(page: 'home' | 'guide') {
    uiState.update((s) => ({ ...s, page }));
  }
</script>

<header
  class="p-8 lg:px-12 flex items-center justify-between border-b border-slate-900 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50"
>
  <button
    onclick={() => setPage('home')}
    class="flex items-center gap-4 text-left border-none bg-transparent p-0 cursor-pointer"
  >
    <div
      class="w-10 h-10 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 rotate-3 transition-transform hover:rotate-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="white"
      >
        <path d="M3 19h18v3H3z" />
        <path d="M8 12h3v7H8z" />
        <path d="M13 12h3v7h-3z" />
      </svg>
    </div>
    <div>
      <h1
        class="text-2xl font-black italic tracking-tighter uppercase text-transparent bg-clip-text bg-linear-to-r from-white to-slate-400"
      >
        Standees
      </h1>
      <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        Create print-ready paper standees for your RPG.
      </p>
    </div>
  </button>
  <nav class="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest uppercase">
    <button
      onclick={() => setPage('home')}
      class="nav-link {$uiState.page === 'home' ? 'active' : ''}"
    >
      Editor
    </button>
    <button
      onclick={() => setPage('guide')}
      class="nav-link {$uiState.page === 'guide' ? 'active' : ''}"
    >
      Assembly Guide
    </button>
    <span class="text-slate-800">|</span>
    <span class="text-slate-600">GM Utility</span>
  </nav>
</header>

<style>
  .nav-link {
    background: none;
    border: none;
    padding: 0;
    color: var(--color-slate-500);
    transition: color 0.2s;
    cursor: pointer;
    font: inherit;
  }

  .nav-link:hover {
    color: var(--color-slate-300);
  }

  .nav-link.active {
    color: var(--color-primary);
  }
</style>
