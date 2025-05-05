<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
</script>

<main>
	<div class="mx-auto my-14 max-w-md rounded-xl bg-white p-4">
		<h1 class="py-4 text-center text-2xl font-extrabold">Cambio password</h1>
		<form method="POST" use:enhance>
			{#if page.form?.success}
				<p class="text-gray text-center">La password è stata cambiata con successo.</p>
				<p class="text-gray mb-4 text-center">Ora puoi accedere con la nuova password.</p>
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
						class="bg-gray text-gray rounded-full border-none p-2 px-4 placeholder:opacity-50 mb-4 mt-2"
					/>
					<label for="password">Nuova password</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="pASSWORD321!"
						value=""
						required
						class="bg-gray text-gray rounded-full border-none p-2 px-4 placeholder:opacity-50 mb-4 mt-2"
					/>
					<label for="passwordConfirm">Conferma password</label>
					<input
						type="password"
						id="passwordConfirm"
						name="passwordConfirm"
						placeholder="pASSWORD321!"
						value=""
						required
						class="bg-gray text-gray rounded-full border-none p-2 px-4 placeholder:opacity-50 mb-4 mt-2"
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
