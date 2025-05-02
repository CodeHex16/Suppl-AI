<script lang="ts">
	import { ChevronDown, Trash2, PenIcon, Mail, Tag } from 'lucide-svelte';

	let { user, open, onEdit, onToggle, onDelete } = $props();


</script>

<div class="mx-4 mb-4 rounded-xl bg-white p-4 shadow-md transition">
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold">{user.name}</h3>
			<div class="flex space-x-4">
				<button
					class="flex items-center text-yellow-500 transition hover:text-yellow-600"
					onclick={() => onEdit(user)}
				>
					<PenIcon class="mr-1 h-4 w-4" />
					<span>Modifica</span>
				</button>
				<button
					class="flex items-center text-red-600 transition hover:text-red-700"
					onclick={onDelete}
				>
					<Trash2 class="mr-1 h-4 w-4" />
					<span>Elimina</span>
				</button>
			</div>
		</div>
		<button class="text-gray-500 transition hover:text-gray-700" onclick={onToggle}>
			<ChevronDown class={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
		</button>
	</div>

	{#if open}
		<div class="mt-4 border-t border-gray-500 border-opacity-50 pt-4 text-sm text-gray-500">
			<div class="mb-2 flex items-center">
				<Mail class="mr-2 h-4 w-4 text-gray-500" />
				<p class="text-gray-300">{user.email}</p>
			</div>
			<div class="flex items-center">
				<Tag class="mr-2 h-4 w-4 text-gray-500" />
				<p class="text-sm text-gray-300">{user.role}</p>
			</div>
		</div>
	{/if}
</div>
