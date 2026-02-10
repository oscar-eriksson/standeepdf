<script lang="ts">
  import { paperSettings, standees, uiState } from '../stores/store';
  import { v4 as uuidv4 } from 'uuid';
  import { autoLayout } from '../utils/layout';
  import { generatePDF } from '../utils/export';
  
  // Tabs
  const tabs = [
    { id: 'setup', label: 'Setup' },
    { id: 'images', label: 'Images' },
    { id: 'controls', label: 'Controls' },
    { id: 'export', label: 'Export' }
  ];

  function setActiveTab(tabId: any) {
    uiState.update(s => ({ ...s, activeTab: tabId }));
  }

  // Reactive layout update
  // We want to re-run layout when quantity changes or dimensions change.
  // But strictly binding to them might cause jitter if user is dragging.
  // Let's make an explicit function or just run it on specific actions.
  
  function triggerLayout() {
      standees.update(s => autoLayout(s, $paperSettings));
  }

  function setOrientation(o: 'p' | 'l') {
      paperSettings.update(p => {
          // Robust logic: ensure dimensions match the requested orientation
          // Portrait: Height > Width
          // Landscape: Width > Height
          
          const isLandscape = p.width > p.height;
          const targetIsLandscape = o === 'l';
          
          if (isLandscape === targetIsLandscape) {
               // Already in correct aspect ratio, just ensure orientation tag matches
               if (p.orientation !== o) return { ...p, orientation: o };
               return p;
          }
          
          // Need to swap
          return {
              ...p,
              orientation: o,
              width: p.height,
              height: p.width
          };
      });
      // Allow store update to propagate then layout
      setTimeout(() => triggerLayout(), 10);
  }

  // --- Image Upload ---
  let fileInput: HTMLInputElement;

  function handleFileUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      processFiles(Array.from(target.files));
    }
  }

  function handlePaste(e: ClipboardEvent) {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
          e.preventDefault();
          processFiles(Array.from(e.clipboardData.files));
      }
  }

  function processFiles(files: File[]) {
      files.forEach(file => {
        if (!file.type.startsWith('image/')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const src = e.target?.result as string;
          const img = new Image();
          img.onload = () => {
             const newStandee = {
                 id: uuidv4(),
                 imageSrc: src,
                 originalWidth: img.width,
                 originalHeight: img.height,
                 height: 50, // Default 50mm
                 imageMargin: 5,
                 feetMargin: 7,
                 quantity: 1,
                 tokenSettings: { mode: 'alphabetic', startValue: 'A' }, // User requested A,B,C default
                 instances: [] // Will be populated by layout engine
             };
             // Add initial instance
             newStandee.instances.push({
                 id: uuidv4(),
                 x: 10, y: 10,
                 token: { enabled: false, text: 'A', size: 'medium', bgColor: '#000000', textColor: '#ffffff', position: {x:0, y:0} }
             });
             
             standees.update(s => {
                 const updated = [...s, newStandee];
                 return autoLayout(updated, $paperSettings);
             });
             // Select the new standee
             uiState.update(s => ({...s, selectedStandeeId: newStandee.id, activeTab: 'controls'}));
          };
          img.src = src;
        };
        reader.readAsDataURL(file);
      });
  }

  // --- Standee Controls ---
  $: selectedStandee = $standees.find(s => s.id === $uiState.selectedStandeeId);

  function updateStandee(prop: string, value: any) {
      if (!selectedStandee) return;
      standees.update(all => {
          const updated = all.map(s => 
              s.id === selectedStandee!.id ? { ...s, [prop]: value } : s
          );
          // if size changed, we should probably re-layout?
          // Let's do it for now.
          return autoLayout(updated, $paperSettings);
      });
  }
 
  function updateInstances(quantity: number) {
      if (!selectedStandee) return;
      standees.update(all => {
          const updated = all.map(s => {
              if (s.id === selectedStandee!.id) {
                   return { ...s, quantity };
              }
              return s;
          });
          return autoLayout(updated, $paperSettings);
      });
  }

  function toggleToken(enabled: boolean) {
      if (!selectedStandee) return;
      standees.update(all => {
          const updated = all.map(s => {
              if (s.id === selectedStandee!.id) {
                  const newInstances = s.instances.map((inst, idx) => ({
                      ...inst,
                      token: { ...inst.token!, enabled }
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
      standees.update(all => all.map(s => {
          if (s.id === selectedStandee!.id) {
              const newInstances = s.instances.map(inst => ({
                  ...inst,
                  token: { ...inst.token!, [prop]: value }
              }));
              return { ...s, instances: newInstances };
          }
          return s;
      }));
  }

  function updateTokenPosition(axis: 'x' | 'y', value: number) {
      if (!selectedStandee) return;
      standees.update(all => all.map(s => {
          if (s.id === selectedStandee!.id) {
              const newInstances = s.instances.map(inst => {
                  const currentPos = inst.token!.position || { x: 0, y: 0 };
                  return {
                      ...inst,
                      token: { 
                          ...inst.token!, 
                          position: { ...currentPos, [axis]: value }
                      }
                  };
              });
              return { ...s, instances: newInstances };
          }
          return s;
      }));
  }

  function updateTokenSettings(mode: 'numeric' | 'alphabetic', startValue: string) {
      if (!selectedStandee) return;
      standees.update(all => {
          const updated = all.map(s => {
              if (s.id === selectedStandee!.id) {
                   return { 
                       ...s, 
                       tokenSettings: { mode, startValue } 
                   };
              }
              return s;
          });
          // Re-layout to regenerate texts
          return autoLayout(updated, $paperSettings);
      });
  }

  import ImageEditor from './ImageEditor.svelte';
  
  let showImageEditor = false;
  
  function handleImageEdited(e: CustomEvent<string>) {
      if (selectedStandee) {
          const newSrc = e.detail;
          const img = new Image();
          img.onload = () => {
              standees.update(all => all.map(s => 
                  s.id === selectedStandee!.id ? { 
                      ...s, 
                      imageSrc: newSrc,
                      originalWidth: img.width,
                      originalHeight: img.height
                  } : s
              ));
              // Trigger layout update after dimensions change
              triggerLayout();
          };
          img.src = newSrc;
          showImageEditor = false;
      }
  }

  function removeStandee() {
      if (!selectedStandee) return;
      if (!confirm('Are you sure you want to remove this standee?')) return;
      
      standees.update(all => {
          const updated = all.filter(s => s.id !== selectedStandee!.id);
          return autoLayout(updated, $paperSettings);
      });
      
      uiState.update(s => ({ ...s, selectedStandeeId: null, activeTab: 'images' }));
  }

  // --- efficiency calc ---
  function calculateEfficiency(standees: import('../stores/store').Standee[], paper: import('../stores/store').PaperSettings): { numPages: number, ratio: string } {
      // Calculate total standees
      const totalStandees = standees.reduce((acc, s) => acc + s.quantity, 0);
      if (totalStandees === 0) return { numPages: 0, ratio: '-' };

      // Run layout
      const layoutResult = autoLayout(standees, paper);
      
      // Calculate pages
      let maxY = 0;
      layoutResult.forEach(s => {
          s.instances.forEach(i => {
              const bottom = i.y + s.height + s.imageMargin + s.feetMargin;
              if (bottom > maxY) maxY = bottom;
          });
      });
      
      const pageHeight = paper.height;
      const numPages = pageHeight > 0 ? Math.max(1, Math.ceil(maxY / pageHeight)) : 1;
      
      return { numPages, ratio: (totalStandees / numPages).toFixed(1) };
  }

  $: efficiencyPortrait = (function() {
      const p = $paperSettings;
      // Force Portrait dims
      const height = Math.max(p.width, p.height);
      const width = Math.min(p.width, p.height);
      const tempPaper = { ...p, width, height, orientation: 'p' as const };
      return calculateEfficiency($standees, tempPaper);
  })();

  $: efficiencyLandscape = (function() {
      const p = $paperSettings;
      // Force Landscape dims
      const width = Math.max(p.width, p.height);
      const height = Math.min(p.width, p.height);
      const tempPaper = { ...p, width, height, orientation: 'l' as const };
      return calculateEfficiency($standees, tempPaper);
  })();
</script>

<svelte:window on:paste={handlePaste} />

{#if showImageEditor && selectedStandee}
  <ImageEditor 
      imageSrc={selectedStandee.imageSrc} 
      on:apply={handleImageEdited}
      on:cancel={() => showImageEditor = false}
  />
{/if}

<div class="controls-panel">
  <div class="branding">
      <img src="{import.meta.env.BASE_URL}logo.png" alt="Standee2PDF Logo" />
      <h1>Standee2PDF</h1>
  </div>
  <div class="tabs">
    {#each tabs as tab}
      <button 
        class:active={$uiState.activeTab === tab.id} 
        on:click={() => setActiveTab(tab.id)}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  <div class="tab-content">
    {#if $uiState.activeTab === 'setup'}
      <h3>Paper Settings</h3>
      <div class="control-group">
        <label>Format</label>
        <select bind:value={$paperSettings.size}>
          <option value="A4">A4</option>
          <!-- Future: US Letter -->
        </select>
      </div>
      <div class="control-group">
          <label>Orientation</label>
          <div class="grid-2">
            <button 
                class="orientation-btn"
                class:selected={$paperSettings.orientation === 'p' || (!$paperSettings.orientation && $paperSettings.height > $paperSettings.width)} 
                on:click={() => setOrientation('p')}>
                <div>Portrait</div>
                <div class="efficiency-stat">{efficiencyPortrait.numPages} pgs ({efficiencyPortrait.ratio}/pg)</div>
            </button>
            <button 
                class="orientation-btn"
                class:selected={$paperSettings.orientation === 'l' || (!$paperSettings.orientation && $paperSettings.width > $paperSettings.height)} 
                on:click={() => setOrientation('l')}>
                <div>Landscape</div>
                <div class="efficiency-stat">{efficiencyLandscape.numPages} pgs ({efficiencyLandscape.ratio}/pg)</div>
            </button>
          </div>
      </div>
      <div class="control-group">
        <label>Margins (mm)</label>
        <div class="grid-2">
            <label>Top <input type="number" bind:value={$paperSettings.margins.top} /></label>
            <label>Bottom <input type="number" bind:value={$paperSettings.margins.bottom} /></label>
            <label>Left <input type="number" bind:value={$paperSettings.margins.left} /></label>
            <label>Right <input type="number" bind:value={$paperSettings.margins.right} /></label>
        </div>
      </div>
      <div class="control-group">
          <label>
              <input type="checkbox" bind:checked={$paperSettings.gridEnabled}> Show Grid
          </label>
      </div>
       <div class="control-group">
          <label>Zoom</label>
          <input type="range" min="0.5" max="2" step="0.1" bind:value={$uiState.zoomLevel}>
      </div>

    {:else if $uiState.activeTab === 'images'}
      <h3>Images</h3>
      <div class="upload-area" on:click={() => fileInput.click()}>
          <span>Click to Upload Images</span>
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
            <div 
                class="image-thumb" 
                class:selected={$uiState.selectedStandeeId === item.id}
                on:click={() => {
                    uiState.update(s => ({...s, selectedStandeeId: item.id}));
                    // auto switch to controls? maybe
                }}
            >
                <img src={item.imageSrc} alt="thumbnail" />
            </div>
          {/each}
      </div>

    {:else if $uiState.activeTab === 'controls'}
       {#if selectedStandee}
          <h3>Standee Settings</h3>
          
          <div class="control-group">
              <div class="grid-2">
                <button style="width: 100%;" on:click={() => showImageEditor = true}>
                    Edit Image
                </button>
                <button style="width: 100%; background: #ff4444; color: white; border-color: #cc0000;" on:click={removeStandee}>
                    Delete
                </button>
              </div>
          </div>
          
          <div class="control-group">
            <label>Height (mm)</label>
            <input type="number" value={selectedStandee.height} on:input={(e) => updateStandee('height', +e.currentTarget.value)} />
            <div class="presets">
                <button on:click={() => updateStandee('height', 25)}>Tiny</button>
                <button on:click={() => updateStandee('height', 38)}>Small</button>
                <button on:click={() => updateStandee('height', 50)}>Med</button>
                <button on:click={() => updateStandee('height', 75)}>Lrg</button>
            </div>
          </div>

          <div class="control-group">
              <label>Quantity</label>
              <input type="number" min="1" value={selectedStandee.quantity} on:input={(e) => updateInstances(+e.currentTarget.value)} />
          </div>

          <div class="control-group">
              <label>Margins (mm)</label>
              <label>Image <input type="number" value={selectedStandee.imageMargin} on:input={(e) => updateStandee('imageMargin', +e.currentTarget.value)} /></label>
              <label>Feet <input type="number" value={selectedStandee.feetMargin} on:input={(e) => updateStandee('feetMargin', +e.currentTarget.value)} /></label>
          </div>

          <div class="control-group">
              <label>
                  <input 
                    type="checkbox" 
                    checked={selectedStandee.instances[0]?.token?.enabled} 
                    on:change={(e) => toggleToken(e.currentTarget.checked)}
                   /> 
                  Enable Numbering Tokens
              </label>
              
              {#if selectedStandee.instances[0]?.token?.enabled}
                      <div class="sub-controls" style="margin-top: 10px; padding-left: 20px;">
                      <label>Sequence</label>
                      <div class="grid-2">
                          <select 
                            value={selectedStandee.tokenSettings?.mode || 'alphabetic'} 
                            on:change={(e) => {
                                const newMode = e.currentTarget.value;
                                // Smart switch start value if we are switching modes
                                let newStart = selectedStandee.tokenSettings?.startValue;
                                if (newMode === 'alphabetic' && (!newStart || !isNaN(Number(newStart)))) newStart = 'A';
                                if (newMode === 'numeric' && (!newStart || isNaN(Number(newStart)))) newStart = '1';
                                updateTokenSettings(newMode, newStart);
                            }}
                          >
                              <option value="numeric">1, 2, 3...</option>
                              <option value="alphabetic">A, B, C...</option>
                          </select>
                          <input 
                            type="text" 
                            title="Start Value"
                            value={selectedStandee.tokenSettings?.startValue || 'A'} 
                            on:change={(e) => updateTokenSettings(selectedStandee.tokenSettings?.mode || 'alphabetic', e.currentTarget.value)} 
                           />
                      </div>

                      <label>Position Offset (px)</label>
                      <div class="grid-2">
                          <label style="font-size: 0.8em;">X <input type="number" value={selectedStandee.instances[0].token.position?.x || 0} on:input={(e) => updateTokenPosition('x', +e.currentTarget.value)} /></label>
                          <label style="font-size: 0.8em;">Y <input type="number" value={selectedStandee.instances[0].token.position?.y || 0} on:input={(e) => updateTokenPosition('y', +e.currentTarget.value)} /></label>
                      </div>

                      <label>Color</label>
                      <div class="grid-2">
                          <input type="color" value={selectedStandee.instances[0].token.bgColor} on:input={(e) => updateTokenStyle('bgColor', e.currentTarget.value)} title="Background" />
                          <input type="color" value={selectedStandee.instances[0].token.textColor} on:input={(e) => updateTokenStyle('textColor', e.currentTarget.value)} title="Text" />
                      </div>
                      
                      <label>Size</label>
                      <select value={selectedStandee.instances[0].token.size} on:change={(e) => updateTokenStyle('size', e.currentTarget.value)}>
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                      </select>
                  </div>
              {/if}
          </div>
       {:else}
          <p>Select a standee from the Images tab to edit.</p>
       {/if}

    {:else if $uiState.activeTab === 'export'}
      <h3>Export</h3>
      <button on:click={() => generatePDF($standees, $paperSettings)}>Generate PDF</button>
    {/if}
  </div>
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

  .branding {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      background: #f8f9fa;
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
      color: #333;
  }
  
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color);
  }
  
  .tabs button {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    font-size: 0.9em;
    padding: 1rem 0.5rem;
    color: #666;
  }

  .tabs button:focus {
    outline: none;
  }
  
  .tabs button.active {
    border-bottom-color: var(--primary-color);
    color: var(--primary-color);
    font-weight: bold;
  }

  .tab-content {
      padding: 1.5rem;
      overflow-y: auto;
  }

  h3 { margin-top: 0; font-size: 1.2rem; }

  .control-group {
      margin-bottom: 1.5rem;
  }
  
  .control-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
      font-weight: 500;
  }

  input[type="number"], input[type="text"], select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      margin-bottom: 0.5rem;
      background: white; /* Ensure bg is white for dropdowns */
      color: #333;
      font-size: 0.9rem;
  }

  .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
  }

  .upload-area {
      border: 2px dashed #ccc;
      padding: 2rem;
      text-align: center;
      cursor: pointer;
      border-radius: 8px;
      transition: border-color 0.2s;
  }
  .upload-area:hover {
      border-color: var(--primary-color);
  }

  .image-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 1rem;
  }

  .image-thumb {
      aspect-ratio: 1;
      border: 2px solid transparent;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      background: #eee;
  }
  
  .image-thumb.selected {
      border-color: var(--primary-color);
  }

  .image-thumb img {
      width: 100%;
      height: 100%;
      object-fit: contain;
  }

  .presets {
      display: flex;
      gap: 5px;
      margin-top: 5px;
  }
  
  .presets button {
      padding: 4px 8px;
      font-size: 0.8em;
  }

  .orientation-btn {
      padding: 0.5rem;
      background: white;
      border: 1px solid #ccc;
      color: #333;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
  }
  
  .orientation-btn.selected {
      background: var(--primary-color); /* Use theme color */
      color: white;
      border-color: var(--primary-color);
  }
  
  .orientation-btn:hover:not(.selected) {
      background: #f0f0f0;
  }

  .efficiency-stat {
      font-size: 0.75em;
      opacity: 0.8;
      font-weight: normal;
      margin-top: 2px;
  }
</style>
