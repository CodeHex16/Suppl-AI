<script lang="ts">
    import { onMount } from 'svelte';
    import { Chart } from 'chart.js'; // Usa Chart invece di Line
    import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'; // Importazione degli elementi necessari
    import ChartDataLabels from 'chartjs-plugin-datalabels';  // Importa il plugin per le etichette
  
    // Registrazione dei plugin e degli elementi necessari per il grafico
    Chart.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
      ChartDataLabels // Registriamo il plugin per l'uso nel grafico
    );
  
    export let labels: string[] = [];
    export let data: number[] = [];
  
    let chart;
  
    onMount(() => {
      const ctx = document.getElementById('chart') as HTMLCanvasElement;
      chart = new Chart(ctx, {
        type: 'line', // Definiamo il tipo di grafico come "line"
        data: {
          labels,
          datasets: [
            {
              label: 'Messaggi Generati',
              data,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: false,
            },
          ],
        },
        options: {
          plugins: {
            datalabels: {
              display: true,
              color: 'black',
              align: 'top',
              font: {
                weight: 'bold',
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    });
  </script>
  
  <div class="bg-white p-6 rounded-lg shadow-md my-6">
    <h2 class="text-xl font-semibold mb-4">Messaggi Generati negli Ultimi 7 Giorni</h2>
    <canvas id="chart"></canvas>
  </div>
  