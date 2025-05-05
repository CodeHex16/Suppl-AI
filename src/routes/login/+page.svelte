<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<main class="m-4">
	<div class="mx-auto max-w-md rounded-xl bg-white p-4 shadow-md">
		<div class="logo-wrapper flex items-center justify-center p-4">
			<img src="./img/logo_light.png?v={Date.now()}" class="logo light-mode" alt="Logo Light" />
			<img src="./img/logo_dark.png?v={Date.now()}" class="logo dark-mode" alt="Logo Dark" />
		</div>
		<h1 class="py-4 text-center text-2xl font-bold">Login</h1>

		{#if $page.form?.error}
			<p class="text-center text-red-500">{$page.form.error}</p>
		{/if}

		<form method="POST" use:enhance>
			<div class="flex flex-col space-y-4 p-4">
				<div class="flex flex-col space-y-2">
					<label for="email">Email</label>
					<input
						type="email"
						id="email"
						name="username"
						placeholder="Email"
						value=""
						required
						class="bg-gray rounded-full border-none p-2 px-4"
					/>
				</div>
				<div class="flex flex-col space-y-2">
					<label for="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Password"
						value=""
						required
						class="bg-gray rounded-full border-none px-4 py-2"
					/>
				</div>
				<a href="/recupero-password" class="text-sm underline text-gray opacity-80 transition text-right hover:opacity-100">Password dimenticata?</a>

				<div class="flex flex-row items-center">
					<input
						type="checkbox"
						id="remember_me"
						name="remember_me"
						class="bg-gray mr-2 rounded-full border-none p-3 cursor-pointer checked:text-primary"
					/>
					<label for="remember_me" class="text-sm">Ricordami</label>
				</div>
				<button
					type="submit"
					class="item-primary rounded-full border-none p-3 text-center font-bold">Accedi</button
				>
			</div>
		</form>
	</div>
</main>
