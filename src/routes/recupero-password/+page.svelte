<script lang="ts">
	import HeaderPages from '$lib/components/HeaderPages.svelte';
	import { page } from '$app/state';

	let { data } = $props();
</script>

<div class="mx-auto max-w-xl">
	<HeaderPages {data} />
	<main class="">
		<div class="mx-auto max-w-md rounded-xl bg-white p-8">
			{#if page.form?.success}
				<h1 class="py-4 text-center text-2xl font-bold">Password resettata</h1>
				<p class="text-balance text-center">
					Ti abbiamo inviato la nuova password temporanea all'indirizzo fornito.
				</p>
				<p class="mt-4 text-balance text-center text-sm opacity-80">
					Se non ricevi l'email entro pochi minuti, controlla la cartella spam o prova a inviare
					nuovamente la richiesta.
				</p>
				<div class="mt-4">
					<a
						href="/"
						class="item-primary block rounded-full p-3 px-6 text-center font-bold text-white"
						>Torna alla homepage</a
					>
				</div>
			{:else}
				<h1 class="py-4 text-center text-2xl font-extrabold">Recupero password</h1>
				{#if page.form?.error}
					<p class="mb-4 text-center text-red-500">{page.form.error}</p>
				{/if}
				<p class="text-balance text-center text-sm opacity-80">
					La password verrà resettata e riceverai una email con una nuova password temporanea.
				</p>
				<form method="POST">
					<div class="flex flex-col p-4">
						<label for="email">Email per il recupero password</label>
						<input
							type="email"
							id="email"
							name="email"
							placeholder="Email"
							required
							class="bg-gray mt-2 rounded-full border-none p-2 px-4 placeholder:opacity-50"
						/>
						<button
							type="submit"
							class="item-primary mt-4 rounded-full border-none p-3 text-center font-bold text-white"
							>Richiedi nuova password</button
						>
					</div>
				</form>
			{/if}
		</div>
	</main>
</div>
