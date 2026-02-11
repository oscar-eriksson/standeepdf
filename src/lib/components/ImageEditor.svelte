<script lang="ts">
  import Cropper from 'cropperjs';
  import 'cropperjs/dist/cropper.css';
  import { removeBackground } from '@imgly/background-removal';
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';

  import Button from '../ui/Button.svelte';

  export let imageSrc: string;
  export let initialImageSrc: string | undefined = undefined;

  const dispatch = createEventDispatcher();

  let imageElement: HTMLImageElement;
  let cropper: Cropper;
  let processedImageSrc: string | null = null;
  let isProcessing = false;
  // ... (omitted unchanged script lines)
  // I will just replace the import and the template part, leaving the rest of script invalid if I cut it off?
  // Be careful. replace_file_content needs EXACT TargetContent.
  // I will split this into steps:
  // 1. Add import.
  // 2. Replace template.
  // 3. Remove CSS.

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
        },
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
    isProcessing = true;
    try {
      const response = await fetch(activeSrc);
      const blob = await response.blob();
      const noBgBlob = await removeBackground(blob);
      const newUrl = URL.createObjectURL(noBgBlob);
      processedImageSrc = newUrl;
    } catch (e) {
      console.error('Background removal failed:', e);
      alert('Background removal failed. Check console for details.');
    } finally {
      isProcessing = false;
    }
  }

  function resetCrop() {
    if (cropper) {
      cropper.reset();
      // Force set to full image
      cropper.setCropBoxData({
        left: 0,
        top: 0,
        width: Infinity,
        height: Infinity,
      });
    }
  }

  function resetSession() {
    if (processedImageSrc?.startsWith('blob:')) {
      URL.revokeObjectURL(processedImageSrc);
    }
    processedImageSrc = null;
    // ensure cropper re-inits even if src is same
    setTimeout(() => initCropper(), 0);
  }

  function fullRestore() {
    if (!initialImageSrc) return;
    if (processedImageSrc?.startsWith('blob:')) {
      URL.revokeObjectURL(processedImageSrc);
    }
    processedImageSrc = initialImageSrc; // This will trigger onImageLoad
  }

  async function handleSolidify() {
    isProcessing = true;
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = activeSrc;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Solidify alpha: anything above ~5% alpha becomes 100%
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] > 12) {
          data[i + 3] = 255;
        } else if (data[i + 3] > 0) {
          data[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      processedImageSrc = canvas.toDataURL('image/png');
    } catch (e) {
      console.error('Solidify failed:', e);
      alert('Solidify failed. Check console for details.');
    } finally {
      isProcessing = false;
    }
  }

  function handleCrop() {
    if (!cropper) return;
    const canvas = cropper.getCroppedCanvas();
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      if (processedImageSrc?.startsWith('blob:')) {
        URL.revokeObjectURL(processedImageSrc);
      }
      processedImageSrc = dataUrl;
      // Re-init happens via onImageLoad
    }
  }

  function handleApply() {
    dispatch('apply', activeSrc);
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
          <p>Processing...</p>
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
      <div class="ai-actions">
        <div class="btn-group">
          <Button
            variant="secondary"
            on:click={handleRemoveBackground}
            disabled={isProcessing}
            title="Remove background using AI"
          >
            Remove BG
          </Button>
          <Button
            variant="secondary"
            on:click={handleSolidify}
            disabled={isProcessing || !processedImageSrc}
            title="Make semi-transparent areas solid (fixes AI errors)"
          >
            Solidify
          </Button>
        </div>

        <div class="btn-group">
          <Button
            variant="secondary"
            on:click={resetCrop}
            disabled={isProcessing}
            title="Reset crop selection to full image"
          >
            Reset Crop
          </Button>
          <Button
            variant="primary"
            on:click={handleCrop}
            disabled={isProcessing}
            title="Apply crop to the current image"
          >
            Crop
          </Button>
          <Button
            variant="danger"
            on:click={resetSession}
            disabled={isProcessing || !processedImageSrc}
            title="Undo background and solidification edits"
          >
            Reset Edits
          </Button>
          {#if initialImageSrc && activeSrc !== initialImageSrc}
            <Button
              variant="danger"
              on:click={fullRestore}
              disabled={isProcessing}
              title="Restore to original uploaded file"
            >
              Restore Original
            </Button>
          {/if}
        </div>
      </div>

      <div class="actions">
        <Button variant="ghost" on:click={handleCancel} disabled={isProcessing}>Cancel</Button>
        <Button variant="primary" on:click={handleApply} disabled={isProcessing}>Save</Button>
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
    background: rgba(0, 0, 0, 0.8);
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

  h3 {
    margin: 0;
  }

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
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .ai-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btn-group {
    display: flex;
    gap: 4px;
    padding: 4px;
    background: var(--color-surface-hover);
    border-radius: var(--radius-md);
  }

  .actions {
    display: flex;
    gap: 10px;
    margin-left: auto;
  }

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
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
    to {
      transform: rotate(360deg);
    }
  }
</style>
