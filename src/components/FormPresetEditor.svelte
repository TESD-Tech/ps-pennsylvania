<script>
  import { createEventDispatcher, onMount } from 'svelte'

  // Props
  export let presets
  export let formElements
  export let selectedPreset

  let presetName

  onMount(() => {
    presetName = selectedPreset
  })

  const dispatch = createEventDispatcher()

  function handleUpdatePreset(preset, id, value) {
    dispatch('updatePreset', { preset, id, value })
  }

  function handleDeletePreset(preset) {
    dispatch('deletePreset', preset)
  }

  function handlePresetName(newName) {
    dispatch('updatePresetName', newName )
  }

  function handlePresetChange(preset) {
    dispatch('updateSelectedPreset', preset)
  }
</script>


<main>
  <h2>Form Preset Editor</h2>
  <label for="preset">Preset</label>
  <select name="preset" bind:value={selectedPreset} on:change={() => handlePresetChange(selectedPreset)}>
    <option value="">Select a preset to edit</option>
    {#each Object.keys(presets) as preset}
      <option value={preset}>{preset}</option>
    {/each}
  </select>

  {#each Object.keys(presets) as preset}
    {#if preset === selectedPreset}
    <br>
    <label for="presetName">Name</label>
    <input type="text" bind:value={selectedPreset} on:change={() => handlePresetName(selectedPreset)}>
    <button>Save</button>
    <button>Cancel</button>

    <table>
      <thead>
        <tr>
          <th>Form Item</th>
          <th>Value</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each presets[preset] as presetValue (presetValue.id)}
          <tr>
            <td>
              <select bind:value={presetValue.id}>
                <option value="">Select a form element</option>
                {#each formElements as el (el.id)}
                  <option value={el.id}>{el.label}</option>
                {/each}
              </select>
            </td>
            <td>
              {#each formElements as el (el.id)}
                {#if el.id === presetValue.id}
                  {#if el.type === 'select-one'}
                  <select bind:value={presetValue.value}>
                    {#each el.options as option}
                      <option value={option.value}>{option.label}</option>
                    {/each}
                  </select>
                  {:else if el.type === 'select-multiple'}
                    <select bind:value={presetValue.value} multiple>
                      {#each el.options as option}
                        <option value={option.value}>{option.label}</option>
                      {/each}
                    </select>
                  {:else}
                    <input type="text" bind:value={presetValue.value} />
                  {/if}
                {/if}
              {/each}
            </td>
            <td>
              <button on:click={() => handleUpdatePreset(preset, presetValue.id, presetValue.value)}>Update</button>
              <button on:click={() => handleDeletePreset(preset)}>Delete</button>
            </td>
          </tr>
        {/each}
        <tr>
          <td colspan=2>&nbsp;</td>
          <td class="add-new">
            <button on:click={() => handleUpdatePreset(preset, '', '')}>Add New</button>
          </td>
        </tr>
      </tbody>
    </table>
    {/if}
  {/each}
</main>


<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }

  th, td {
    padding: 0.5rem;
  }

  select,input {
    margin: 4px 4px 4px 10px;
    padding: 2px;
    min-height: 30px;
    font-size: 14px;
    font-weight: bold;
    color: #000;
    background-color: #fff;
    border: 1px solid #000;
    border-radius: 5px;
  }
</style>
