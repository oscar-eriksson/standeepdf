<script lang="ts">
  import Cropper from 'cropperjs';
  import 'cropperjs/dist/cropper.css';
  import { removeBackground } from '@imgly/background-removal';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  export let imageSrc: string;

  const dispatch = createEventDispatcher();

  let imageElement: HTMLImageElement;
  let cropper: Cropper;
  let processedImageSrc: string | null = null;
  let isProcessing = false;

  // Initialize Cropper
  function initCropper() {
      if (cropper) {
          cropper.destroy();
      }
      
      // If image is not loaded yet, wait? 
      // Svelte mounts when img is in DOM.
      // But we need to ensure it has dimensions?
      // cropperjs usually handles wait for load if passed image element?
      if (imageElement) {
          cropper = new Cropper(imageElement, {
              viewMode: 1, // Restrict crop box to not exceed canvas
              dragMode: 'move', // or 'crop'
              initialAspectRatio: NaN, // Free form
              aspectRatio: NaN,
              autoCropArea: 0.8,
              responsive: true,
              restore: false,
              guides: true,
              center: true,
              highlight: false,
              cropBoxMovable: true,
              cropBoxResizable: true,
              toggleDragModeOnDblclick: false,
              ready() {
                  // Optional: strict mode type check might require this function signature match
              }
          });
      }
  }

  onMount(() => {
     // We need to wait for the image to load before init?
     // Or rely on img onload.
  });
  
  onDestroy(() => {
      if (cropper) cropper.destroy();
  });

  // Watch for src changes? In this modal usage, src probably static per open.
  // But if we process background, src changes.
  
  $: activeSrc = processedImageSrc || imageSrc;

  function onImageLoad() {
      initCropper();
  }

  async function handleRemoveBackground() {
      if (!cropper) return;
      isProcessing = true;
      try {
          // Get current crop
          // If the user hasn't cropped anything (full image), getCroppedCanvas() gives full image?
          // Yes, if crop box covers all.
          // But maybe we want to just remove bg from the *current view* (what's inside crop box)?
          // Yes.
          
          const canvas = cropper.getCroppedCanvas();
          if (!canvas) throw new Error('Could not get canvas');
          
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve));
          if (!blob) throw new Error('Could not get blob');

          // Remove Background
          const noBgBlob = await removeBackground(blob);
          const newUrl = URL.createObjectURL(noBgBlob);
          
          processedImageSrc = newUrl;
          
          // Re-init cropper on new image (which will trigger onImageLoad)
          // Effectively resets crop box to fit new image.
      } catch (e) {
          console.error('Background removal failed:', e);
          alert('Background removal failed. Check console for details.');
      } finally {
          isProcessing = false;
      }
  }

  function handleApply() {
      if (!cropper) return;
      
      const canvas = cropper.getCroppedCanvas();
      if (canvas) {
          const dataUrl = canvas.toDataURL('image/png');
          dispatch('apply', dataUrl);
      }
  }

  function handleCancel() {
      dispatch('cancel');
  }

</script>

<div class="editor-overlay">
  <div class="editor-modal">
    <h3>Edit Image</h3>
    
    <div class="crop-container" class:processing={isProcessing}>
        {#if isProcessing}
            <div class="loading">
                <div class="spinner"></div>
                <p>Processing... (AI is removing background)</p>
            </div>
        {/if}
        
        <!-- Wrapper for CropperJS -->
        <div class="img-wrapper">
             <img 
                bind:this={imageElement} 
                src={activeSrc} 
                alt="Edit Target"
                on:load={onImageLoad}
                style="max-width: 100%; display: block;" 
             />
        </div>
    </div>

    <div class="controls">
        <button class="secondary" on:click={handleRemoveBackground} disabled={isProcessing || !!processedImageSrc}>
            {processedImageSrc ? 'Background Removed' : 'Remove Background (AI)'}
        </button>
        
        <div class="actions">
            <button class="secondary" on:click={handleCancel} disabled={isProcessing}>Cancel</button>
            <button class="primary" on:click={handleApply} disabled={isProcessing}>Apply</button>
        </div>
    </div>
  </div>
</div>

<style>
  .editor-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .editor-modal {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      width: 90%;
      max-width: 800px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      gap: 1rem;
  }

  h3 { margin: 0; }

  .crop-container {
      position: relative;
      width: 100%;
      height: 500px; /* limits render height */
      background: #333;
      border-radius: 4px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
  }

  .img-wrapper {
      width: 100%;
      height: 100%;
  }
  
  /* Ensure image fits for cropper init */
  img {
      max-width: 100%;
  }

  .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
  }

  .actions {
      display: flex;
      gap: 10px;
  }

  button {
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      border: none;
  }

  button.primary {
      background: var(--primary-color, #4a90e2);
      color: white;
  }

  button.secondary {
      background: #eee;
      color: #333;
  }
  
  button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
  }

  .loading {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.7);
      color: white;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 20;
  }

  .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #fff;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
  }

  @keyframes spin {
      to { transform: rotate(360deg); }
  }
</style>
