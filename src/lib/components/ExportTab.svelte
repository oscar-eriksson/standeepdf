<script lang="ts">
  import Card from '../ui/Card.svelte';
  import Button from '../ui/Button.svelte';

  export let isGenerating: boolean;
  export let onExport: (action: 'download' | 'print') => void;
</script>

<div class="export-tab">
  <Card padding="md">
    <h3 class="section-title">Export PDF</h3>
    <p class="export-note">Generate your print-ready PDF file (A4 format).</p>

    <div class="control-group">
      <div class="grid-2">
        <Button variant="primary" on:click={() => onExport('print')} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Open'}
        </Button>
        <Button variant="secondary" on:click={() => onExport('download')} disabled={isGenerating}>
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
</div>

<style>
  .export-tab {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
  }

  .section-title {
    margin: 0 0 var(--space-2) 0;
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-medium);
    color: var(--color-text);
  }

  .export-note {
    font-size: var(--font-size-sm);
    color: var(--color-text-muted);
    margin: 0 0 var(--space-5) 0;
  }

  .loading-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-3);
    margin-top: var(--space-6);
    color: var(--color-primary);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(100, 108, 255, 0.1);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
