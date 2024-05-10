<script>
  import { testing_calendar } from '../data/testing_calendar.js'
  let data;

  async function fetchData() {
    try {
      const response = await fetch('/admin/te-tech/ps-pennsylvania/testing_calendar.js');
      data = await response.json();
    } catch (error) {
      console.error('Error fetching data:', error);
      data = []; // Handle error by setting empty data
    }
  }

  // fetchData();
  data = testing_calendar;
</script>

{#if data}
  <h1>Testing Callendar Data</h1>
  <table class="table-auto w-full">
    <thead>
      <tr class="bg-gray-200 text-gray-600 text-xs uppercase tracking-wider">
        <th class="px-4 py-2 border border-gray-300">Date</th>
        <th class="px-4 py-2 border border-gray-300">Day #</th>
        <th class="px-4 py-2 border border-gray-300">Days Before</th>
        <th class="px-4 py-2 border border-gray-300">Days After</th>
      </tr>
    </thead>
    <tbody>
      {#each data as item}
      <tr>
        <td class="px-4 py-2 border border-gray-300">{item.CAL_DATE}</td>
        <td class="px-4 py-2 border border-gray-300">{item.DAY_NUMBER}</td> <td class="px-4 py-2 border border-gray-300">{item.DAYS_BEFORE}</td>  <td class="px-4 py-2 border border-gray-300">{item.DAYS_AFTER}</td>   </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <p>Loading data...</p>
{/if}
