<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
</script>

<main>
	<div class="mx-auto my-14 max-w-md rounded-xl bg-white p-4">
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
					value="test@test.it"
					required
					class="rounded-full border-none bg-gray-100 p-2 px-4"
				/>
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					placeholder="Password"
					value="testtest"
					required
					class="rounded-full border-none bg-gray-100 px-4 py-2"
				/>
				<button
					type="submit"
					class="rounded-full border-none bg-blue-500 p-3 text-center font-bold text-white hover:bg-blue-600"
					>Accedi</button
				>
				<a href="/recupero-password" class="">
					<div class="rounded-full border-none bg-gray-100 p-3 px-4 text-center">
						<p>Password dimenticata</p>
					</div>
				</a>
			</div>
		</form>
	</div>
</main>
