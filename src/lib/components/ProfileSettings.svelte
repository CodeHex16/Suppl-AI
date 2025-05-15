<script lang="ts">
	let { data } = $props();
	import { goto } from '$app/navigation';

	const gotoHandler = (event: Event) => {
		event.preventDefault();
		const target = event.target as HTMLButtonElement;
		const action = target.closest('form')?.action;
		if (action) {
			goto(action);
		}
	};
</script>

<div class="space-y-4 rounded-t-3xl bg-white p-4 pb-10">
	<h2 class="mb-3 ml-2 text-xl font-semibold">Impostazioni profilo</h2>
	<form action="/cambio-password" onsubmit="{gotoHandler}">
		<button type="submit" class="item-primary mt-4 w-full rounded-full p-2 font-semibold">
			Cambia password
		</button>
	</form>
	<form action="/logout" onsubmit="{gotoHandler}">
		<button
			type="submit"
			class="w-full rounded-full bg-red-500 p-2 font-semibold text-white transition-all ease-in hover:bg-red-600"
		>
			Esci dall'account
		</button>
	</form>
</div>
