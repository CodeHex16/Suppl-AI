<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<main>
	<div class="mx-auto my-14 max-w-md rounded-xl bg-white p-4">
		<h1 class="py-4 text-center text-2xl font-extrabold">Cambio password</h1>
		<form method="POST" use:enhance>
			{#if $page.form?.success}
				<p style="color:green; justify; text-justify: inter-word;">
					La password è stata cambiata con successo. Puoi accedere con la nuova password.
				</p>
				<a href="../">
					<div
						class="rounded-full border-none bg-blue-500 p-3 text-center font-bold text-white hover:bg-blue-600"
					>
						<p>Vai alla homepage</p>
					</div>
				</a>
			{:else}
				{#if $page.form?.first_login}
					<div style="color:rgb(90,90,90); justify; text-justify: inter-word;">
						Sembra che questo sia il primo login dell'account. Per motivi di sicurezza, ti chiediamo
						di cambiare la password da quella fornita con una personale.
					</div>
				{/if}
				{#if $page.form?.error}
					<p class="text-center text-red-500">{$page.form.error}</p>
				{/if}
				<div class="flex flex-col space-y-4 p-4">
					<label for="currentPassword">Password attuale</label>
					<input
						type="password"
						id="currentPassword"
						name="currentPassword"
						placeholder="Password123!"
						value=""
						required
						class="rounded-full border-none bg-gray-100 p-2 px-4"
					/>
					<label for="password">Nuova password</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="pASSWORD321!"
						value=""
						required
						class="rounded-full border-none bg-gray-100 p-2 px-4"
					/>
					<label for="passwordConfirm">Conferma password</label>
					<input
						type="password"
						id="passwordConfirm"
						name="passwordConfirm"
						placeholder="pASSWORD321!"
						value=""
						required
						class="rounded-full border-none bg-gray-100 p-2 px-4"
					/>
					<button
						type="submit"
						class="rounded-full border-none bg-blue-500 p-3 text-center font-bold text-white hover:bg-blue-600"
						>Cambia password</button
					>
				</div>
			{/if}
		</form>
	</div>
</main>
