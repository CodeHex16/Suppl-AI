<script>
</script>

<main>
	<div class="mx-auto my-14 max-w-md rounded-xl bg-white p-4">
		<h1 class="text-center text-2xl font-bold">Login</h1>
		<form method="POST">
			<div class="flex flex-col space-y-4 p-4">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
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
					value="test"
					required
					class="rounded-full border-none bg-gray-100 px-4 py-2"
				/>
				<button
					type="submit"
					class="rounded-full border-none bg-blue-500 p-3 text-center font-bold text-white hover:bg-blue-600"
					>Accedi</button
				>
			</div>
		</form>
	</div>
</main>
