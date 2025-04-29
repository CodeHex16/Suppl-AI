<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<main>
	<div class="mx-auto my-14 max-w-md rounded-xl bg-white p-4">
		<h1 class="py-4 text-center text-2xl font-extrabold">Recupero password</h1>
		{#if $page.form?.error}
			<p class="text-red-500 text-center">{$page.form.error}</p>
		{/if}

		{#if $page.form?.success}
			<h2 class="text-center text-xl font-bold text-primary pb-4">Password resettata</h2>
			<p class="text-justify">
				Controlla l'email e segui le istruzioni per il reset della password. Se il messaggio non è
				presente nella casella di posta:
			</p>
			<ul class="list-disc pl-8">
				<li>aspetta qualche minuto;</li>
				<li>controlla la cartella spam;</li>
				<li>controlla se l'email inserita è corretta.</li>
			</ul>
			<p class="text-justify">
				Se non hai ricevuto l'email, puoi ripetere la richiesta di reset della password.
			</p>
			<div class="flex justify-center mt-6">
				<a
					href="/"
					class="block rounded-full item-primary p-3 px-6 text-center font-bold text-white"
					>Torna alla homepage</a
				>
			</div>
		{:else}
			<form method="POST" use:enhance>
				<div class="flex flex-col space-y-4 p-4">
					<label for="email">Email per il recupero password</label>
					<input
						type="email"
						id="email"
						name="email"
						placeholder="Email"
						required
						class="rounded-full border-none bg-gray-100 p-2 px-4"
					/>
					<button
						type="submit"
						class="rounded-full border-none item-primary p-3 text-center font-bold text-white"
						>Richiedi nuova password</button
					>
				</div>
			</form>
		{/if}
	</div>
</main>
