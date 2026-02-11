<script lang="ts">
  export let version: string = 'v1.1.0';
</script>

<footer class="panel-footer">
  <div class="footer-links">
    <a
      href="https://github.com/oscar-eriksson/standeepdf"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><path
          d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58V22"
        ></path></svg
      >
      GitHub
    </a>
    <a href="https://ko-fi.com/oscareriksson2" target="_blank" rel="noopener noreferrer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
        <line x1="6" y1="1" x2="6" y2="4"></line>
        <line x1="10" y1="1" x2="10" y2="4"></line>
        <line x1="14" y1="1" x2="14" y2="4"></line>
      </svg>
      Ko-fi
    </a>
  </div>
  <div class="credits">
    <span>By Oscar Eriksson</span>
    <span class="version">{version}</span>
  </div>
</footer>

<style>
  .panel-footer {
    padding: 1rem;
    border-top: 1px solid var(--color-border);
    background: var(--color-bg);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: var(--font-size-sm);
  }

  .footer-links {
    display: flex;
    gap: 1rem;
  }

  .panel-footer a {
    display: flex;
    align-items: center;
    gap: 5px;
    color: var(--color-text-muted);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  .panel-footer a:hover {
    color: var(--color-primary);
  }

  .credits {
    text-align: right;
    color: var(--color-text-light);
  }

  .credits span {
    display: block;
  }

  .version {
    font-size: 0.7rem;
    opacity: 0.8;
  }
</style>
