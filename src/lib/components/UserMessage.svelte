<script lang="ts">
	import { type Message } from '$lib/types';
	import { formatData } from '$lib/utils/date';
	let { data }:{
		data: Message;
	} = $props();

</script>

<div class="items-stretch">
	<div class="flex justify-end">
		<div class="bg-primary min-w-20 max-w-xs rounded-t-3xl rounded-bl-3xl p-4 shadow-md">
			{data.content}
		</div>
	</div>
	<div class="flex justify-end">
		<div class="text-gray mr-2 text-sm opacity-80">
			{#if data.timestamp}
				<p class="my-2">{formatData(data.timestamp)}</p>
			{:else}
				<p class="my-2">Adesso</p>
			{/if}
		</div>

	</div>
</div>
