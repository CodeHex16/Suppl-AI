<script>
	let { content, timestamp} = $props();
	console.log('content: ', content);
	console.log('date: ', timestamp);
</script>

<div class="items-stretch">
	<div class="flex justify-end">
		<div class="bg-primary min-w-20 max-w-xs rounded-t-3xl rounded-bl-3xl p-4">
			{content}
		</div>
	</div>
	<div class="mr-1 flex items-stretch justify-end text-xs text-gray-500">
		{#if !timestamp}
		<p class="mt-1">Data non definita</p>
		{:else}
		<p class="mt-1">{timestamp}</p>
		{/if}
	</div>
</div>
