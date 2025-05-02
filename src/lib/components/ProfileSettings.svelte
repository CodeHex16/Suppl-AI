<script lang="ts">
	let { data } = $props();

</script>

<div class="space-y-4 rounded-t-3xl bg-white p-4 pb-10">
	<h2 class="mb-6 mt-2 text-xl font-semibold">Profilo</h2>
	<p>Email : {data.creds.email}</p>
	<form action="/cambio-password" method="GET">
		<button type="submit" class="mt-4 w-full rounded-full item-primary p-2 ">
			Cambia password
		</button>
	</form>
	<form action="/logout" method="GET">
		<button type="submit" class="w-full rounded-full bg-red-500 hover:bg-red-600 transition-all ease-in p-2">
			Esci dall'account
		</button>
	</form>
</div>
