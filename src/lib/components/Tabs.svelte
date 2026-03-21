<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let tabs: { id: string; label: string }[];
  export let activeTab: string;

  const dispatch = createEventDispatcher();

  function selectTab(id: string) {
    activeTab = id;
    dispatch('select', id);
  }
</script>

<div class="tabs">
  {#each tabs as tab (tab.id)}
    <button class:active={activeTab === tab.id} on:click={() => selectTab(tab.id)}>
      {tab.label}
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    border-bottom: 2px solid var(--color-slate-800);
    background: rgba(15, 23, 42, 0.4);
    padding: 0 1rem;
    gap: 1.5rem;
  }

  .tabs button {
    position: relative;
    background: transparent;
    border: none;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 1.25rem 0.5rem;
    color: var(--color-slate-500);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
  }

  .tabs button:hover {
    color: var(--color-slate-300);
  }

  .tabs button:focus {
    outline: none;
  }

  .tabs button.active {
    color: white;
  }

  .tabs button::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, var(--color-purple-600), var(--color-pink-500));
    border-radius: 99px 99px 0 0;
    opacity: 0;
    transform: scaleX(0.5);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .tabs button.active::after {
    opacity: 1;
    transform: scaleX(1);
    box-shadow: 0 -4px 12px rgba(139, 92, 246, 0.5);
  }
</style>
