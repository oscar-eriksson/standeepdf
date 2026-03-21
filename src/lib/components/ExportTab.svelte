<script lang="ts">
  import Card from '../ui/Card.svelte';
  import Button from '../ui/Button.svelte';

  export let isGenerating: boolean;
  export let onExport: (action: 'download' | 'print') => void;
  export let onSaveProject: () => void;
  export let onLoadProject: () => void;
</script>

<div class="export-tab">
  <Card padding="md">
    <h3 class="section-title">Export PDF</h3>
    <p class="export-note">Generate your print-ready PDF file (A4 format).</p>

    <div class="control-group">
      <div class="grid-2">
        <Button variant="primary" onclick={() => onExport('print')} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Open'}
        </Button>
        <Button variant="secondary" onclick={() => onExport('download')} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Download'}
        </Button>
      </div>
    </div>

    {#if isGenerating}
      <div class="loading-indicator">
        <div class="spinner"></div>
        <span>Preparing PDF document...</span>
      </div>
    {/if}
  </Card>

  <Card padding="md">
    <h3 class="section-title">Project Data</h3>
    <p class="export-note">Save or load your standee images and settings as a file.</p>

    <div class="control-group">
      <div class="grid-2">
        <Button variant="primary" onclick={onSaveProject}>Save</Button>
        <Button variant="secondary" onclick={onLoadProject}>Load</Button>
      </div>
    </div>
  </Card>
</div>

<style>
  .export-tab {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .section-title {
    margin: 0 0 0.5rem 0;
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-slate-400);
  }

  .export-note {
    font-size: 12px;
    font-weight: 600;
    color: var(--color-slate-500);
    margin: 0 0 1.5rem 0;
  }

  .loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
    color: var(--color-primary);
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 4px solid var(--color-slate-800);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
</style>
