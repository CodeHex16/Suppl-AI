<script lang="ts">
	let { data } = $props();


	function formatData(stringDate: string) {
		const date = new Date(stringDate);
		return date.toLocaleString('it-IT', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Europe/Rome'
		});
	}
</script>

<div class="items-stretch">
	<div class="flex justify-end">
		<div class="bg-primary min-w-20 max-w-xs rounded-t-3xl rounded-bl-3xl p-4">
			{data.content}
		</div>
	</div>
	<div class="flex justify-end">
		<div class="text-gray mr-4 text-sm opacity-80">
			{#if data.timestamp}
				<p>{formatData(data.timestamp)}</p>
			{:else}
				<p>Adesso</p>
			{/if}
		</div>

	</div>
</div>
