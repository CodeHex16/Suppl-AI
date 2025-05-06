<script lang="ts">
	let { data } = $props();
</script>

<div class="space-y-4 rounded-t-3xl bg-white p-4 pb-10">
	<h2 class="mb-3 ml-2 text-xl font-semibold">Impostazioni profilo</h2>
	<form action="/cambio-password" method="GET">
		<button type="submit" class="item-primary mt-4 w-full rounded-full p-2 font-semibold">
			Cambia password
		</button>
	</form>
	<form action="/logout" method="GET">
		<button
			type="submit"
			class="w-full rounded-full bg-red-500 p-2 font-semibold text-white transition-all ease-in hover:bg-red-600"
		>
			Esci dall'account
		</button>
	</form>
</div>
