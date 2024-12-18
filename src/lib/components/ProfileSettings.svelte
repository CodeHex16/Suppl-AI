<script>
	let { data } = $props();
</script>

<div class="space-y-4 rounded-t-3xl bg-white p-4 pb-10">
	<h2 class="mb-6 mt-2 text-xl font-semibold">Profilo</h2>
	<p>Email : {data.creds.email}</p>
	<p>Password : {data.creds.password}</p>
</div>
