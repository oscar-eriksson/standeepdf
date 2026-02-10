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
  {#each tabs as tab}
    <button class:active={activeTab === tab.id} on:click={() => selectTab(tab.id)}>
      {tab.label}
    </button>
  {/each}
</div>

<style>
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
  }

  .tabs button {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    font-size: 0.9em;
    padding: 1rem 0.5rem;
    color: #666;
    transition: all 0.2s;
  }

  .tabs button:hover {
    color: var(--primary-color);
    background: rgba(100, 108, 255, 0.05);
  }

  .tabs button:focus {
    outline: none;
  }

  .tabs button.active {
    border-bottom-color: var(--primary-color);
    color: var(--primary-color);
    font-weight: bold;
  }
</style>
