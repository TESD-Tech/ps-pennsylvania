<svelte:options customElement="ps-form-presets" />
<script>
  import { onMount, createEventDispatcher } from 'svelte'
  import devPresets from '../assets/form-presets.json'
  import FormPresetEditor from './FormPresetEditor.svelte'

  // Component props
  export let formSelector
  export let presetsUrl = '/te-tech/form-presets/form-presets.json'
  
  // Component state
  let form
  let formElements = new Set()
  let presets = {}
  let addMode = false
  let newPreset = new Set()
  let newPresetName = ''
  let selectedPreset = ''

  const isProduction = !import.meta.env.DEV
  const dispatch = createEventDispatcher()

  onMount(loadData)

  async function loadData() {
    form = document.querySelector(formSelector)
    let this_presets

    if (form) {
      Array.from(form.elements).map((el) => {
        const label = document.querySelector(`label[for="${el.id}"]`)?.textContent
        if (el.id && el.type !== 'hidden' && label) {
          let options
          if (el.tagName === 'SELECT') {
            options = Array.from(el.options).map((option) => {return {value: option.value, label: option.textContent}})
          }
          formElements.add({ id: el.id, label: label, type: el.type, element: el, options: options })
        }
      })
    }

    if (isProduction) {
      const response = await fetch(presetsUrl)
      this_presets = await response.json()
    } else {
      this_presets = devPresets
    }

    for (let preset in this_presets) {
      if (!presets[preset]) presets[preset] = new Set()
      this_presets[preset].forEach(({ id, value }) => {
        presets[preset].add({ id, value })
      })
    }
  }

  function handleAdd({detail}) {
    newPreset.add({detail})
  }

  function createPreset() {
    addMode = true
  }

  function updateForm() {
    const reason_note = document.getElementById('visitreasondesc')
    const reason_value = reason_note.value

    if (!reason_value.includes(selectedPreset))
      reason_note.value = selectedPreset + ': ' + reason_note.value

    presets[selectedPreset].forEach(({ id, value }) => {
      const element = document.getElementById(id)

      if (element) {
        if (element.tagName === 'SELECT' && element.multiple) {
          // Handle multi-select
          const options = Array.from(element.options)

          options.forEach((option) => {
            option.selected = value.includes(option.value)
          })

          element.dispatchEvent(new Event('change'))
        } else {
          // Handle other input types
          element.value = Array.isArray(value) ? value[0] : value
          element.dispatchEvent(new Event('change'))
        }
      }
    })

    selectedPreset = ''
    dispatch('update', { selectedPreset, presets })
  }

  function savePreset() {
    if (!newPresetName)
      newPresetName = prompt('Enter preset name')

    console.log(newPreset, newPresetName)

    if (newPreset) {
      newPreset.forEach(({ id, value }) => {
        if (!presets[newPresetName]) presets[newPresetName] = []
        presets[newPresetName].push({ id, value })
      })
    }

    addMode = false
    dispatch('save', { newPresetName, newPreset })
  }

  function cancelPreset() {
    addMode = false
    newPreset = new Set()
  }

  function handleUpdatePreset(event) {
    const { preset, id, value } = event.detail
    presets[preset] = presets[preset].map(item => item.id === id ? { id, value } : item)

    // Empty preset
    if (value === '') {
      presets[preset] = presets[preset].filter(item => item.id !== id)
    }
  }

  function handleDeletePreset(event) {
    const preset = event.detail
    delete presets[preset]
  }

  function handlePresetName(event) {
    const newName = event.detail
    presets[newName] = presets[selectedPreset]
    delete presets[selectedPreset]
    selectedPreset = newName
  }

  function handleSelectedPreset(event) {
    const preset = event.detail
    selectedPreset = preset
  }
</script>

<!-- Add event listeners to the buttons -->
<main>
  <div>
    <select class="is-select" bind:value={selectedPreset}>
      <option value="">Select a preset</option>
      {#each Object.keys(presets) as preset}
        <option value={preset}>{preset}</option>
      {/each}
    </select>
    <button on:click={updateForm} disabled={!selectedPreset}>Apply Preset</button>
    <button on:click={() => {addMode = !addMode}}>{#if addMode}Close Editor{:else}Edit{/if}</button>
  </div>
  {#if addMode}
    <FormPresetEditor {presets} {formElements} {selectedPreset} 
      on:updatePreset={handleUpdatePreset} 
      on:deletePreset={handleDeletePreset} 
      on:updatePresetName={handlePresetName}
      on:updateSelectedPreset={handleSelectedPreset}/>
  {/if}
</main>

<style>
  .is-select {
    margin: 0 0 0 10px;
    padding: 0;
    height: 30px;
    font-size: 14px;
    font-weight: bold;
    color: #000;
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 5px;
  }
  button {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.4em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.25s;
  }
  button:hover {
    border-color: #646cff;
  }
  button:focus,
  button:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
</style>