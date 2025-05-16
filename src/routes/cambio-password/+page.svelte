<script lang="ts">
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	import { page } from '$app/state';

	let { data } : {data:any} = $props();
</script>

<div class="mx-auto max-w-xl">
	<HeaderPages {data} />
	<main class="mx-4">
		<div class="mx-auto  max-w-md rounded-xl bg-white p-8">
			<h1 class="py-4 text-center text-2xl font-extrabold">Cambio password</h1>
			<form method="POST">
				{#if page.form?.success}
					<p class="text-gray text-center mb-4">La password è stata cambiata con successo.</p>
					<a href="/">
						<div class="item-primary rounded-full border-none p-3 text-center font-bold">
							<p>Vai alla homepage</p>
						</div>
					</a>
				{:else}
					{#if page.form?.error}
						<p class="text-center text-red-500">{page.form.error}</p>
					{/if}
					<div class="flex flex-col p-4">
						<label for="currentPassword">Password attuale</label>
						<input
							type="password"
							id="currentPassword"
							name="currentPassword"
							placeholder="Password123!"
							value=""
							required
							class="bg-gray text-gray mb-4 mt-2 rounded-full border-none p-2 px-4 placeholder:opacity-50"
						/>
						<label for="password">Nuova password</label>
						<input
							type="password"
							id="password"
							name="password"
							placeholder="pASSWORD321!"
							value=""
							required
							class="bg-gray text-gray mb-4 mt-2 rounded-full border-none p-2 px-4 placeholder:opacity-50"
						/>
						<label for="passwordConfirm">Conferma password</label>
						<input
							type="password"
							id="passwordConfirm"
							name="passwordConfirm"
							placeholder="pASSWORD321!"
							value=""
							required
							class="bg-gray text-gray mb-4 mt-2 rounded-full border-none p-2 px-4 placeholder:opacity-50"
						/>
						<button
							type="submit"
							class="item-primary rounded-full border-none p-3 text-center font-bold"
							>Cambia password</button
						>
					</div>
				{/if}
			</form>
		</div>
	</main>
</div>
