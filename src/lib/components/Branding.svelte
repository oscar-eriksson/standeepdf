<script lang="ts">
  export let title: string = 'standee2pdf';
</script>

<div class="branding">
  <img src="{import.meta.env.BASE_URL}logo.png" alt="{title} Logo" />
  <h1>{title}</h1>
</div>

<style>
  .branding {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 1rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg);
  }

  .branding img {
    width: 80px;
    height: 80px;
    object-fit: contain;
  }

  .branding h1 {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: var(--color-text);
  }
</style>
