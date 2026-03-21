<script lang="ts">
  import { standees, uiState } from '../stores/store';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  import Card from '../ui/Card.svelte';
  const dispatch = createEventDispatcher();
  let fileInput: HTMLInputElement;
  let dragging = false;
  let dragCounter = 0;

  // Prevent browser from opening dropped files
  function preventDefaults(e: Event) {
    e.preventDefault();
  }

  onMount(() => {
    window.addEventListener('dragover', preventDefaults);
    window.addEventListener('drop', preventDefaults);
  });

  onDestroy(() => {
    window.removeEventListener('dragover', preventDefaults);
    window.removeEventListener('drop', preventDefaults);
  });

  function handleFileUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      dispatch('upload', Array.from(target.files));
      target.value = ''; // Reset for same file upload
    }
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    dragCounter = 0;
    dragging = false;
    if (e.dataTransfer?.files?.length) {
      const imageFiles = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/'),
      );
      if (imageFiles.length) {
        dispatch('upload', imageFiles);
      }
    }
  }

  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    dragCounter++;
    dragging = true;
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dragCounter--;
    if (dragCounter <= 0) {
      dragCounter = 0;
      dragging = false;
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
      class:drag-over={dragging}
      role="button"
      tabindex="0"
      on:click={() => fileInput.click()}
      on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && fileInput.click()}
      on:drop={handleDrop}
      on:dragenter={handleDragEnter}
      on:dragover={handleDragOver}
      on:dragleave={handleDragLeave}
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
      <span class="upload-text">{dragging ? 'Drop images here' : 'Click to Upload Images'}</span>
      <p class="upload-hint">or drag & drop / paste them anywhere</p>
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
    gap: 1rem;
  }

  .section-title {
    margin: 0 0 1rem 0;
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-slate-400);
  }

  .upload-area {
    border: 2px dashed var(--color-slate-800);
    padding: 2rem;
    text-align: center;
    border-radius: 1.5rem;
    cursor: pointer;
    transition: all 0.2s;
    background: color-mix(in srgb, var(--color-slate-950), transparent 50%);
    margin-bottom: 1.5rem;
  }

  .upload-area:hover,
  .upload-area.drag-over {
    border-color: var(--color-primary);
    background: var(--color-slate-900);
  }

  .upload-icon {
    margin-bottom: 0.5rem;
    color: var(--color-slate-600);
  }

  .upload-text {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-slate-200);
  }

  .upload-hint {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-slate-500);
    margin: 0.25rem 0 0 0;
  }

  .image-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .empty-state {
    text-align: center;
    color: var(--color-slate-600);
    padding: 1.5rem;
    font-size: 11px;
    font-style: italic;
  }

  .thumb-wrapper {
    position: relative;
    transition: transform 0.2s;
  }

  .thumb-wrapper:hover {
    transform: scale(1.05) rotate(1deg);
  }

  .image-thumb {
    aspect-ratio: 1;
    border: 2px solid transparent;
    border-radius: 0.75rem;
    overflow: hidden;
    padding: 0;
    background: var(--color-slate-900);
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
    display: block;
  }

  .remove-btn {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--color-rose-600);
    color: white;
    border: 2px solid var(--color-slate-900);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    opacity: 0;
    transition: all 0.2s;
    z-index: 10;
  }

  .thumb-wrapper:hover .remove-btn {
    opacity: 1;
  }

  .image-thumb.selected {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.2);
  }

  .image-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
