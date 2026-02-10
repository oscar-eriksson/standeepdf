<script lang="ts">
  import { paperSettings, standees, uiState } from '../stores/store';
  import { v4 as uuidv4 } from 'uuid';
  import { autoLayout } from '../utils/layout';
  import { generatePDF } from '../utils/export';

  import ImageEditor from './ImageEditor.svelte';
  import Branding from './Branding.svelte';
  import Tabs from './Tabs.svelte';
  import Footer from './Footer.svelte';
  import SetupTab from './SetupTab.svelte';
  import ImagesTab from './ImagesTab.svelte';
  import ControlsTab from './ControlsTab.svelte';
  import ExportTab from './ExportTab.svelte';

  const tabs = [
    { id: 'setup', label: 'Setup' },
    { id: 'images', label: 'Images' },
    { id: 'controls', label: 'Controls' },
    { id: 'export', label: 'Export' },
  ];

  function setActiveTab(tabId: 'setup' | 'images' | 'controls' | 'export') {
    uiState.update((s) => ({ ...s, activeTab: tabId }));
  }

  function triggerLayout() {
    standees.update((s) => autoLayout(s, $paperSettings));
  }

  function setOrientation(o: 'p' | 'l') {
    paperSettings.update((p) => {
      const isLandscape = p.width > p.height;
      const targetIsLandscape = o === 'l';
      if (isLandscape === targetIsLandscape) {
        if (p.orientation !== o) return { ...p, orientation: o };
        return p;
      }
      return {
        ...p,
        orientation: o,
        width: p.height,
        height: p.width,
      };
    });
    setTimeout(() => triggerLayout(), 10);
  }

  function processFiles(files: File[]) {
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const newStandee: import('../stores/store').Standee = {
            id: uuidv4(),
            imageSrc: src,
            initialImageSrc: src,
            originalWidth: img.width,
            originalHeight: img.height,
            height: 50,
            imageMargin: 5,
            feetMargin: 7,
            quantity: 1,
            tokenSettings: {
              mode: 'alphabetic' as 'numeric' | 'alphabetic',
              startValue: 'A',
            },
            instances: [],
          };
          newStandee.instances.push({
            id: uuidv4(),
            x: 10,
            y: 10,
            token: {
              enabled: true,
              text: 'A',
              size: 'medium',
              bgColor: '#000000',
              textColor: '#ffffff',
              position: { x: 0, y: 0 },
            },
          });
          standees.update((s) => {
            const updated = [...s, newStandee];
            return autoLayout(updated, $paperSettings);
          });
          uiState.update((s) => ({
            ...s,
            selectedStandeeId: newStandee.id,
            activeTab: 'controls',
          }));
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    });
  }

  function handlePaste(e: ClipboardEvent) {
    if (e.clipboardData && e.clipboardData.files.length > 0) {
      e.preventDefault();
      processFiles(Array.from(e.clipboardData.files));
    }
  }

  $: selectedStandee = $standees.find((s) => s.id === $uiState.selectedStandeeId);

  function updateStandee(prop: string, value: any) {
    if (!selectedStandee) return;
    standees.update((all) => {
      const updated = all.map((s) => (s.id === selectedStandee!.id ? { ...s, [prop]: value } : s));
      return autoLayout(updated, $paperSettings);
    });
  }

  function updateInstances(quantity: number) {
    if (!selectedStandee) return;
    standees.update((all) => {
      const updated = all.map((s) => (s.id === selectedStandee!.id ? { ...s, quantity } : s));
      return autoLayout(updated, $paperSettings);
    });
  }

  function toggleToken(enabled: boolean) {
    if (!selectedStandee) return;
    standees.update((all) => {
      const updated = all.map((s) => {
        if (s.id === selectedStandee!.id) {
          const newInstances = s.instances.map((inst) => ({
            ...inst,
            token: { ...inst.token!, enabled },
          }));
          return { ...s, instances: newInstances };
        }
        return s;
      });
      return autoLayout(updated, $paperSettings);
    });
  }

  function updateTokenStyle(prop: string, value: any) {
    if (!selectedStandee) return;
    standees.update((all) =>
      all.map((s) => {
        if (s.id === selectedStandee!.id) {
          const newInstances = s.instances.map((inst) => ({
            ...inst,
            token: { ...inst.token!, [prop]: value },
          }));
          return { ...s, instances: newInstances };
        }
        return s;
      }),
    );
  }

  function updateTokenPosition(axis: 'x' | 'y', value: number) {
    if (!selectedStandee) return;
    standees.update((all) =>
      all.map((s) => {
        if (s.id === selectedStandee!.id) {
          const newInstances = s.instances.map((inst) => {
            const currentPos = inst.token!.position || { x: 0, y: 0 };
            return {
              ...inst,
              token: {
                ...inst.token!,
                position: { ...currentPos, [axis]: value },
              },
            };
          });
          return { ...s, instances: newInstances };
        }
        return s;
      }),
    );
  }

  function updateTokenSettings(mode: 'numeric' | 'alphabetic', startValue: string) {
    if (!selectedStandee) return;
    standees.update((all) => {
      const updated = all.map((s) =>
        s.id === selectedStandee!.id ? { ...s, tokenSettings: { mode, startValue } } : s,
      );
      return autoLayout(updated, $paperSettings);
    });
  }

  let showImageEditor = false;
  function handleImageEdited(e: CustomEvent<string>) {
    if (selectedStandee) {
      const newSrc = e.detail;
      const img = new Image();
      img.onload = () => {
        standees.update((all) =>
          all.map((s) =>
            s.id === selectedStandee!.id
              ? {
                  ...s,
                  imageSrc: newSrc,
                  originalWidth: img.width,
                  originalHeight: img.height,
                }
              : s,
          ),
        );
        triggerLayout();
      };
      img.src = newSrc;
      showImageEditor = false;
    }
  }

  function removeStandeeById(id: string) {
    if (!confirm('Are you sure you want to remove this standee?')) return;
    standees.update((all) => {
      const updated = all.filter((s) => s.id !== id);
      return autoLayout(updated, $paperSettings);
    });
    if ($uiState.selectedStandeeId === id) {
      uiState.update((s) => ({ ...s, selectedStandeeId: null, activeTab: 'images' }));
    }
  }

  function removeSelectedStandee() {
    if (!selectedStandee) return;
    removeStandeeById(selectedStandee.id);
  }

  let isGenerating = false;
  async function handleExport(action: 'download' | 'print') {
    if (isGenerating) return;
    isGenerating = true;
    await new Promise((r) => setTimeout(r, 10));
    try {
      await new Promise<void>((resolve) => {
        setTimeout(async () => {
          await generatePDF($standees, $paperSettings, action);
          resolve();
        }, 50);
      });
    } catch (e) {
      console.error(e);
      alert('Error generating PDF');
    } finally {
      isGenerating = false;
    }
  }

  function calculateEfficiency(
    standees: import('../stores/store').Standee[],
    paper: import('../stores/store').PaperSettings,
  ) {
    const totalStandees = standees.reduce((acc, s) => acc + s.quantity, 0);
    if (totalStandees === 0) return { numPages: 0, ratio: '-' };
    const layoutResult = autoLayout(standees, paper);
    let maxY = 0;
    layoutResult.forEach((s) => {
      s.instances.forEach((i) => {
        const bottom = i.y + s.height + s.imageMargin + s.feetMargin;
        if (bottom > maxY) maxY = bottom;
      });
    });
    const pageHeight = paper.height;
    const numPages = pageHeight > 0 ? Math.max(1, Math.ceil(maxY / pageHeight)) : 1;
    return { numPages, ratio: (totalStandees / numPages).toFixed(1) };
  }

  $: efficiencyPortrait = (function () {
    const p = $paperSettings;
    const height = Math.max(p.width, p.height);
    const width = Math.min(p.width, p.height);
    return calculateEfficiency($standees, { ...p, width, height, orientation: 'p' });
  })();

  $: efficiencyLandscape = (function () {
    const p = $paperSettings;
    const width = Math.max(p.width, p.height);
    const height = Math.min(p.width, p.height);
    return calculateEfficiency($standees, { ...p, width, height, orientation: 'l' });
  })();
</script>

<svelte:window on:paste={handlePaste} />

{#if showImageEditor && selectedStandee}
  <ImageEditor
    imageSrc={selectedStandee.imageSrc}
    initialImageSrc={selectedStandee.initialImageSrc}
    on:apply={handleImageEdited}
    on:cancel={() => (showImageEditor = false)}
  />
{/if}

<div class="controls-panel">
  <Branding />

  <Tabs {tabs} activeTab={$uiState.activeTab} on:select={(e) => setActiveTab(e.detail)} />

  <div class="tab-content">
    {#if $uiState.activeTab === 'setup'}
      <SetupTab {efficiencyPortrait} {efficiencyLandscape} onOrientationChange={setOrientation} />
    {:else if $uiState.activeTab === 'images'}
      <ImagesTab
        on:upload={(e) => processFiles(e.detail)}
        on:remove={(e) => removeStandeeById(e.detail)}
      />
    {:else if $uiState.activeTab === 'controls'}
      {#if selectedStandee}
        <ControlsTab
          {selectedStandee}
          onEditImage={() => (showImageEditor = true)}
          onRemove={removeSelectedStandee}
          onUpdateStandee={updateStandee}
          onUpdateInstances={updateInstances}
          onToggleToken={toggleToken}
          onUpdateTokenSettings={updateTokenSettings}
          onUpdateTokenPosition={updateTokenPosition}
          onUpdateTokenStyle={updateTokenStyle}
        />
      {:else}
        <div class="empty-state">
          <p>Select a standee from the Images tab to edit its settings.</p>
        </div>
      {/if}
    {:else if $uiState.activeTab === 'export'}
      <ExportTab {isGenerating} onExport={handleExport} />
    {/if}
  </div>

  <Footer />
</div>

<style>
  .controls-panel {
    width: 320px;
    background: var(--panel-bg);
    border-right: 1px solid var(--border-color);
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  .tab-content {
    padding: 1.5rem;
    overflow-y: auto;
    flex: 1;
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #999;
    font-size: 0.9rem;
  }

  .empty-state {
    text-align: center;
    padding: 2rem;
    color: #999;
    font-size: 0.9rem;
  }
</style>
