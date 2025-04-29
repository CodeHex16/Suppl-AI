<script>
	let { content } = $props();
	let time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	let date = new Date().toLocaleDateString([], { year: 'numeric', month: '2-digit', day: '2-digit' });
</script>

<div class="flex justify-end">
	<div class="min-w-20 max-w-xs rounded-t-3xl rounded-bl-3xl bg-primary p-4">
		{content}
	</div>
	<div class="">
		<p>{date} - {time}</p>
	</div>
</div>
