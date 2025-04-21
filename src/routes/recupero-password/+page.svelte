<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<main>
	<div class="mx-auto my-14 max-w-md rounded-xl bg-white p-4">
		<h1 class="py-4 text-center text-2xl font-extrabold">Recupero password</h1>

		<form method="POST" use:enhance>
			<div class="flex flex-col space-y-4 p-4">
				<label for="email">Email per il recupero password</label>
				<input
					type="email"
					id="email"
					name="username"
					placeholder="Email"
					value="test@test.it"
					required
					class="rounded-full border-none bg-gray-100 p-2 px-4"
				/>
				<button
					type="submit"
					class="rounded-full border-none bg-blue-500 p-3 text-center font-bold text-white hover:bg-blue-600"
					>Richiedi nuova password</button
				>
				{#if $page.form?.error}
					<p class="text-red-500">{$page.form.error}</p>
				{:else if $page.form?.success}
					<p style=" text-align: justify; text-justify: inter-word;">
						Controlla l'email e segui le istruzioni per il reset della password.
					</p>
					<p style=" text-align: justify; text-justify: inter-word;">
						Se il messaggio non è presente nella casella di posta, aspetta qualche minuto o
						ricontrolla se l'email inserita è corretta.
					</p>
				{/if}
			</div>
		</form>
	</div>
</main>
