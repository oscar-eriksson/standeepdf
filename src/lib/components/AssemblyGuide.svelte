<script lang="ts">
  import { uiState } from '../stores/store';

  function goHome() {
    uiState.update((s) => ({ ...s, page: 'home' }));
  }
</script>

<div class="guide-page">
  <div class="guide-container">
    <header class="guide-header">
      <button onclick={goHome} class="back-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"><path d="m15 18-6-6 6-6" /></svg
        >
        Back to Editor
      </button>
      <h2 class="page-title">Assembly Guide</h2>
      <p class="page-subtitle">
        Simple instructions for crafting physical standees from your prints.
      </p>
    </header>

    <div class="guide-grid">
      <!-- Main Content -->
      <div class="guide-main">
        <section class="guide-section">
          <h3 class="section-title">1. Materials</h3>
          <p class="section-text">To fit standard standee bases, you need a 1.5mm thick core.</p>

          <div class="materials-grid">
            <div class="material-card">
              <h4 class="card-title">1.5mm Grayboard</h4>
              <p class="card-text">
                Use <strong>PVA Glue</strong> (white wood glue) to bond your prints to the board.
              </p>
            </div>

            <div class="material-card">
              <h4 class="card-title">Cereal Box Cardboard</h4>
              <p class="card-text">
                Stack <strong>3 layers</strong> of typical cereal box cardboard using a
                <strong>Glue Stick</strong> to reach the 1.5mm thickness.
              </p>
            </div>
          </div>
        </section>

        <section class="guide-section">
          <h3 class="section-title">2. Steps</h3>
          <div class="steps-list">
            <div class="step-item">
              <div class="step-num">01</div>
              <div class="step-content">
                <h5>Print & Cut</h5>
                <p>
                  Print on standard paper. Cut carefully at the mirror line between the front and
                  back images using a <strong>metal ruler</strong> and a
                  <strong>sharp hobby knife</strong> or exacto.
                </p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-num">02</div>
              <div class="step-content">
                <h5>Glue</h5>
                <p>Glue the front and back images to each side of your 1.5mm core.</p>
              </div>
            </div>
            <div class="step-item">
              <div class="step-num">03</div>
              <div class="step-content">
                <h5>Cut & Finish</h5>
                <p>
                  Cut out the final standee from the core with a sharp knife. <strong>Tip:</strong> Rub
                  the side of a pen along the edges to seal the cardboard for a smooth finish.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Sidebar / Links -->
      <aside class="guide-sidebar">
        <div class="sticky-sidebar">
          <div class="link-card">
            <h4 class="link-title">Gloomhaven-style Bases</h4>
            <p class="link-desc">I use these standard plastic clips for 1.5mm standees.</p>
            <a
              href="https://makerworld.com/en/models/772538-frosthaven-standee?from=search#profileId-708958"
              target="_blank"
              class="external-link"
            >
              View on MakerWorld
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline
                  points="15 3 21 3 21 9"
                /><line x1="10" y1="14" x2="21" y2="3" /></svg
              >
            </a>
          </div>

          <div class="link-card">
            <h4 class="link-title">Video Tutorial</h4>
            <p class="link-desc">Watch the 3-layer cereal box technique in action.</p>
            <a
              href="https://www.youtube.com/watch?v=nGRzk1r1w8g"
              target="_blank"
              class="external-link video"
            >
              Watch on YouTube
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                ><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline
                  points="15 3 21 3 21 9"
                /><line x1="10" y1="14" x2="21" y2="3" /></svg
              >
            </a>
          </div>
        </div>
      </aside>
    </div>
  </div>
</div>

<style>
  .guide-page {
    flex: 1;
    background-color: var(--color-slate-950);
    overflow-y: auto;
    padding: 3rem 1rem;
  }

  .guide-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  .guide-header {
    margin-bottom: 4rem;
    text-align: center;
  }

  .back-button {
    background: var(--color-slate-900);
    border: 1px solid var(--color-slate-800);
    color: var(--color-slate-400);
    padding: 0.6rem 1.2rem;
    border-radius: 99px;
    font-size: 12px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    transition: all 0.2s;
  }

  .back-button:hover {
    background: var(--color-slate-800);
    color: white;
    transform: translateX(-4px);
  }

  .page-title {
    font-size: 3rem;
    font-weight: 900;
    letter-spacing: -0.05em;
    color: white;
    margin: 0;
  }

  .page-subtitle {
    font-size: 1.125rem;
    color: var(--color-slate-500);
    max-width: 600px;
    margin: 1rem auto 0;
    line-height: 1.6;
  }

  .guide-grid {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 4rem;
  }

  @media (max-width: 900px) {
    .guide-grid {
      grid-template-columns: 1fr;
    }
  }

  .guide-section {
    margin-bottom: 4rem;
  }

  .section-title {
    font-size: 10px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--color-primary);
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .section-title::after {
    content: '';
    height: 1px;
    flex: 1;
    background: linear-gradient(to right, var(--color-slate-800), transparent);
  }

  .section-text {
    font-size: 1.125rem;
    color: var(--color-slate-300);
    line-height: 1.7;
    margin-bottom: 2rem;
  }

  .materials-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 600px) {
    .materials-grid {
      grid-template-columns: 1fr;
    }
  }

  .material-card {
    background: var(--color-slate-900);
    border: 1px solid var(--color-slate-800);
    padding: 2rem;
    border-radius: 2rem;
    position: relative;
    overflow: hidden;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 800;
    color: white;
    margin: 0 0 1rem 0;
  }

  .card-text {
    font-size: 0.875rem;
    color: var(--color-slate-400);
    line-height: 1.6;
    margin: 0;
  }

  .steps-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .step-item {
    display: flex;
    gap: 2rem;
    align-items: flex-start;
  }

  .step-num {
    font-size: 2rem;
    font-weight: 900;
    color: var(--color-slate-800);
    font-family: monospace;
    line-height: 1;
  }

  .step-content h5 {
    font-size: 1.125rem;
    font-weight: 800;
    color: white;
    margin: 0 0 0.5rem 0;
  }

  .step-content p {
    font-size: 1rem;
    color: var(--color-slate-400);
    line-height: 1.6;
    margin: 0;
  }

  .link-card {
    background: var(--color-slate-900);
    border: 1px solid var(--color-slate-800);
    padding: 1.5rem;
    border-radius: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .link-title {
    font-size: 14px;
    font-weight: 800;
    color: white;
    margin: 0 0 0.5rem 0;
  }

  .link-desc {
    font-size: 12px;
    color: var(--color-slate-500);
    margin-bottom: 1.25rem;
    line-height: 1.5;
  }

  .external-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--color-slate-800);
    color: white;
    text-decoration: none;
    font-size: 12px;
    font-weight: 700;
    border-radius: 0.75rem;
    transition: all 0.2s;
  }

  .external-link:hover {
    background: var(--color-primary);
    transform: translateY(-2px);
  }

  .external-link.video {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .external-link.video:hover {
    background: #ef4444;
    color: white;
  }

  .sticky-sidebar {
    position: sticky;
    top: 8rem;
  }
</style>
