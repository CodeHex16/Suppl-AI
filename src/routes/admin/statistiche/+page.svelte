<script lang="ts">
    import { writable } from 'svelte/store';
    import LineChart from '$lib/components/LineChart.svelte';
    import { format } from 'date-fns';
  
    let startDate = writable(new Date());
    let endDate = writable(new Date());
    let totalMessages = 0;
    let totalUsers = 0;
    let totalDocuments = 0;
  
    // Dati per il grafico
    let labels: string[] = [];
    let data: number[] = [];
  
    // Funzione che aggiorna le statistiche e i dati per il grafico
    function aggiornaFiltri() {
      const dataInizio = startDate;
      const dataFine = endDate;
      // Dati random per esempio
      totalMessages = Math.floor(Math.random() * 1000);
      totalUsers = Math.floor(Math.random() * 100);
      totalDocuments = Math.floor(Math.random() * 200);
  
      // Generiamo dati per il grafico (7 giorni fa fino ad oggi)
      labels = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
      data = Array.from({ length: 7 }, () => Math.floor(Math.random() * 50));
    }
  
    // Esegui aggiornaFiltri al caricamento della pagina
    aggiornaFiltri();
  </script>
  
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-2xl font-semibold mb-6">Statistiche</h2>
    
    <!-- Filtri di data -->
    <div class="mb-6">
      <label for="startDate" class="block text-sm font-medium text-gray-700">Data Inizio</label>
      <input type="date" bind:value={$startDate} class="p-2 border rounded-md" on:change={aggiornaFiltri} />
    </div>
    <div class="mb-6">
      <label for="endDate" class="block text-sm font-medium text-gray-700">Data Fine</label>
      <input type="date" bind:value={$endDate} class="p-2 border rounded-md" on:change={aggiornaFiltri} />
    </div>
  
    <!-- Statistiche -->
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="bg-white p-4 shadow-md rounded-lg text-center">
        <h3 class="text-xl font-semibold">Messaggi Generati</h3>
        <p class="text-2xl">{totalMessages}</p>
      </div>
      <div class="bg-white p-4 shadow-md rounded-lg text-center">
        <h3 class="text-xl font-semibold">Utenti</h3>
        <p class="text-2xl">{totalUsers}</p>
      </div>
      <div class="bg-white p-4 shadow-md rounded-lg text-center">
        <h3 class="text-xl font-semibold">Documenti</h3>
        <p class="text-2xl">{totalDocuments}</p>
      </div>
    </div>
  
    <!-- Grafico -->
    <LineChart {labels} {data} />
  </div>
  