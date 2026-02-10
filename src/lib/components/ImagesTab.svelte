<script lang="ts">
  import { standees, uiState } from '../stores/store';
  import { createEventDispatcher } from 'svelte';

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
  <h3>Images</h3>

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
        ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"
        ></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg
      >
    </div>
    <span>Click to Upload Images</span>
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

  <div class="image-list">
    {#each $standees as item}
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
</div>

<style>
  .upload-area {
    border: 2px dashed #ccc;
    padding: 1.5rem;
    text-align: center;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: #fafafa;
    margin-bottom: 1.5rem;
  }

  .upload-area:hover {
    border-color: var(--primary-color);
    background: rgba(100, 108, 255, 0.05);
  }

  .upload-icon {
    margin-bottom: 8px;
    color: #999;
  }

  .upload-hint {
    font-size: 0.75rem;
    color: #999;
    margin: 4px 0 0 0;
  }

  .image-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .thumb-wrapper {
    position: relative;
  }

  .image-thumb {
    aspect-ratio: 1;
    border: 2px solid transparent;
    border-radius: 6px;
    overflow: hidden;
    padding: 0;
    background: #f0f0f0;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
  }

  .remove-btn {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ff4444;
    color: white;
    border: 2px solid white;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transition:
      opacity 0.2s,
      transform 0.2s;
    z-index: 10;
  }

  .thumb-wrapper:hover .remove-btn {
    opacity: 1;
  }

  .remove-btn:hover {
    background: #ff2222;
    transform: scale(1.1);
  }

  .image-thumb:hover {
    transform: scale(1.05);
    border-color: #ddd;
  }

  .image-thumb.selected {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
  }

  .image-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
