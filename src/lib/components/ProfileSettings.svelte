<script lang="ts">
	let { data } = $props();

</script>

<div class="space-y-4 rounded-t-3xl bg-white p-4 pb-10">
	<h2 class="mb-6 mt-2 text-xl font-semibold">Profilo</h2>
	<p>Email : {data.creds.email}</p>
	<p>Password : {data.creds.password}</p>
	<form action="/logout" method="GET">
		<button type="submit" class="mt-4 w-full rounded-full bg-red-500 p-2 text-white">
			Esci dall'account
		</button>
	</form>
</div>
