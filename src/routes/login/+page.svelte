<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<main>
	<div class="mx-auto my-14 max-w-md rounded-xl bg-white shadow-md p-4">
		<div class="logo-wrapper flex items-center justify-center pt-2">
			<img src="./img/logo_light.png?v={Date.now()}" class="logo light-mode" alt="Logo Light" />
			<img src="./img/logo_dark.png?v={Date.now()}" class="logo dark-mode" alt="Logo Dark" />        
		</div>
		<h1 class="py-4 text-center text-2xl font-extrabold">Login</h1>

		{#if $page.form?.error}
			<p class="text-center text-red-500">{$page.form.error}</p>
		{/if}

		<form method="POST" use:enhance>
			<div class="flex flex-col space-y-4 p-4">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					name="username"
					placeholder="Email"
					value=""
					required
					class="rounded-full border-none bg-gray p-2 px-4"
				/>
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="Password"
					value=""
					required
					class="rounded-full border-none bg-gray px-4 py-2"
				/>
				<div>
					<input type="checkbox" id="remember_me" name="remember_me" class="rounded-full bg-gray p-3 mr-2 border-none" />
					<label for="remember_me" class="text-sm">Ricordami</label> 
				</div>
				<button
					type="submit"
					class="rounded-full border-none item-primary p-3 text-center font-bold"
					>Accedi</button
				>
				<a href="/recupero-password" class="">
					<div class="rounded-full border-none bg-gray p-3 px-4 text-center">
						<p>Password dimenticata</p>
					</div>
				</a>
			</div>
		</form>
	</div>
</main>
