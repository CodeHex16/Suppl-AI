<script>
	let { content } = $props();
</script>

<div class="flex justify-start">
	<div class="max-w-sm rounded-t-3xl rounded-br-3xl bg-white p-4 text-black">
		<div class="font-bold text-blue-500">Supply</div>
		{#if content == ''}
			<div class="animate-pulse">
				<div class="h-2 bg-slate-200 rounded w-full mb-2"></div>
				<div class="h-2 bg-slate-200 rounded w-5/6 mb-2"></div>
				<div class="h-2 bg-slate-200 rounded w-4/5"></div>
			</div>
		{:else}
			{content}
		{/if}
	</div>
</div>
