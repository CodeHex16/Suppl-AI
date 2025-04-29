<script>
	let { content } = $props();
	let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	let date = new Date().toLocaleDateString([], {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
</script>

<div class="items-stretch">
	<div class="flex justify-end">
		<div class="bg-primary min-w-20 max-w-xs rounded-t-3xl rounded-bl-3xl p-4">
			{content}
		</div>
	</div>
	<div class="mr-1 flex items-stretch justify-end text-xs text-gray-500">
		<p class="mt-1">{date} - {time}</p>
	</div>
</div>
