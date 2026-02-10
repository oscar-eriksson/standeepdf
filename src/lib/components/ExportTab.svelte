<script lang="ts">
  export let isGenerating: boolean;
  export let onExport: (action: 'download' | 'print') => void;
</script>

<div class="export-tab">
  <h3>Export PDF</h3>
  <p class="export-note">Generate your print-ready PDF file (A4 format).</p>

  <div class="control-group">
    <div class="grid-2">
      <button class="primary" on:click={() => onExport('print')} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Open'}
      </button>
      <button class="primary" on:click={() => onExport('download')} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Download'}
      </button>
    </div>
  </div>

  {#if isGenerating}
    <div class="loading-indicator">
      <div class="spinner"></div>
      <span>Preparing PDF document...</span>
    </div>
  {/if}
</div>

<style>
  .export-note {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1.5rem;
  }

  .loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-top: 2rem;
    color: var(--primary-color);
    font-size: 0.9rem;
    font-weight: 500;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(100, 108, 255, 0.1);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
