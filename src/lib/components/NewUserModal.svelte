<script lang="ts">
    import { User, Mail, Tag } from 'lucide-svelte';

	let { onSubmitUser, onCancel } = $props<{
		onSubmitUser: (user: {

			name: string;
			email: string;
			role: string;
		}) => void;
		onCancel: () => void;
	}>();

	let name = $state('');
	let email = $state('');
	let role = $state('');

	function submitForm() {
		onSubmitUser({
			name,
			email,
			role,
		});
	}
</script>
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div class="w-[90%] max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 class="mb-4 text-lg font-semibold text-center">Nuovo Utente</h2>

        <!-- Name Input with Icon -->
        <div class="relative mb-3">
            <User class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                bind:value={name}
                placeholder="Nome"
                required
                class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:opacity-50"
            />
        </div>

        <!-- Email Input with Icon -->
        <div class="relative mb-3">
            <Mail class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
                type="email"
                bind:value={email}
                placeholder="Email"
                required
                class="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:opacity-50"
            />
        </div>

			<!-- Role Select with Icon -->
			<div class="relative mb-4">
                <Tag class="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <select
                    bind:value={role}
                    required
                    class="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    
                >
                <option value="" disabled selected hidden>Seleziona un ruolo</option>
                <option value="admin">Admin</option>
				<option value="user">User</option>
				</select>
			</div>


        <div class="flex justify-end space-x-2">
            <button
                class="rounded-lg bg-gray px-4 py-2 transition duration-150 ease-i"
                onclick={onCancel}>Annulla</button
            >
            <button class="item-primary rounded-lg px-4 py-2" onclick={submitForm}>Salva</button>
        </div>
    </div>
</div>