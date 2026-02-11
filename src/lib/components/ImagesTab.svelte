<script lang="ts">
  import { standees, uiState } from '../stores/store';
  import { createEventDispatcher } from 'svelte';

  import Card from '../ui/Card.svelte';
  const dispatch = createEventDispatcher();
  let fileInput: HTMLInputElement;

  function handleFileUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      dispatch('upload', Array.from(target.files));
      target.value = ''; // Reset for same file upload
    }
  }

  function selectStandee(id: string) {
    uiState.update((s) => ({ ...s, selectedStandeeId: id }));
  }
</script>

<div class="images-tab">
  <Card padding="md">
    <h3 class="section-title">Images</h3>

    <div
      class="upload-area"
      role="button"
      tabindex="0"
      on:click={() => fileInput.click()}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput.click()}
    >
      <div class="upload-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline
            points="17 8 12 3 7 8"
          ></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg
        >
      </div>
      <span class="upload-text">Click to Upload Images</span>
      <p class="upload-hint">or paste them anywhere</p>
      <input
        type="file"
        accept="image/*"
        multiple
        bind:this={fileInput}
        on:change={handleFileUpload}
        hidden
      />
    </div>

    {#if $standees.length === 0}
      <div class="empty-state">
        <p>No images uploaded yet.</p>
      </div>
    {:else}
      <div class="image-list">
        {#each $standees as item (item.id)}
          <div class="thumb-wrapper">
            <button
              class="image-thumb"
              class:selected={$uiState.selectedStandeeId === item.id}
              on:click={() => selectStandee(item.id)}
              title="Edit this standee"
            >
              <img src={item.imageSrc} alt="thumbnail" />
            </button>
            <button
              class="remove-btn"
              on:click|stopPropagation={() => dispatch('remove', item.id)}
              title="Remove standee"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"
                ></line></svg
              >
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </Card>
</div>

<style>
  .images-tab {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .section-title {
    margin: 0 0 var(--space-4) 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }

  .upload-area {
    border: 2px dashed var(--color-border);
    padding: var(--space-5);
    text-align: center;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    background: var(--color-bg);
    margin-bottom: var(--space-4);
  }

  .upload-area:hover {
    border-color: var(--color-primary);
    background: rgba(100, 108, 255, 0.05); /* Keep slight opacity for hover */
  }

  .upload-icon {
    margin-bottom: var(--space-2);
    color: var(--color-text-light);
  }

  .upload-text {
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }

  .upload-hint {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    margin: var(--space-1) 0 0 0;
  }

  .image-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2);
  }

  .empty-state {
    text-align: center;
    color: var(--color-text-muted);
    padding: var(--space-4);
    font-size: var(--font-size-sm);
    font-style: italic;
  }

  .thumb-wrapper {
    position: relative;
  }

  .image-thumb {
    aspect-ratio: 1;
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    overflow: hidden;
    padding: 0;
    background: var(--color-surface);
    cursor: pointer;
    transition: all var(--transition-fast);
    width: 100%;
    display: block;
  }

  .remove-btn {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--color-danger);
    color: var(--color-danger-text);
    border: 2px solid var(--color-surface);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    box-shadow: var(--shadow-sm);
    opacity: 0;
    transition: all var(--transition-fast);
    z-index: 10;
  }

  .thumb-wrapper:hover .remove-btn {
    opacity: 1;
  }

  .remove-btn:hover {
    background: var(--color-danger-hover);
    transform: scale(1.1);
  }

  .image-thumb:hover {
    transform: scale(1.02);
    border-color: var(--color-border-hover);
  }

  .image-thumb.selected {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
  }

  .image-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
