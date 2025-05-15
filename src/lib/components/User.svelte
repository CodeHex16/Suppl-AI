<script lang="ts">
	import { ChevronDown, Trash2, PenIcon, Mail, Tag } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { type User } from '$lib/types';	
	let { user, open, onEdit, onToggle, onDelete }:{
		user: User;
		open: boolean;
		onEdit: (user: User) => void;
		onToggle: () => void;
		onDelete: () => void;
	} = $props();
</script>

<div class="mx-4 mb-4 rounded-xl bg-white p-4 shadow-md transition">
	<div class="flex items-center justify-between">
		<div>
			<h3 class="text-lg font-semibold max-w-56 overflow-hidden text-ellipsis whitespace-nowrap">{user.name}</h3>
			<div class="mt-2 text-sm">
				<div class="mb-2 flex items-center">
					<Mail class="text-gray mr-2 h-4 w-4 opacity-50" />
					<p class="text-gray max-w-56 overflow-hidden text-ellipsis whitespace-nowrap">{user.email}</p>
				</div>
				<div class="flex items-center">
					<Tag class="text-gray mr-2 h-4 w-4 opacity-50" />
					<p class="text-gray">{user.role}</p>
				</div>
			</div>
		</div>
		<button
			class="text-gray rounded-full p-2 transition hover:bg-gray-200 dark:hover:text-black"
			onclick={onToggle}
			aria-label={open ? `Chiudi dettagli ${user.name}` : `Apri dettagli ${user.name}`}
		>
			<ChevronDown
				class={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
			/>
		</button>
	</div>

	{#if open}
		<div
			class="mt-4 flex space-x-4 border-t border-gray-500 border-opacity-50 pt-4"
			transition:slide={{ duration: 200 }}
		>
			<button
				class="box-border flex items-center rounded-full border-2 border-amber-500 px-4 py-2 transition hover:bg-amber-500"
				onclick={() => onEdit(user)}
			>
				<PenIcon class="mr-2 h-4 w-4" />
				<span>Modifica</span>
			</button>
			<button
				class="box-border flex items-center rounded-full border-2 border-red-500 px-4 py-2 transition hover:bg-red-500"
				onclick={onDelete}
			>
				<Trash2 class="mr-2 h-4 w-4" />
				<span>Elimina</span>
			</button>
		</div>
	{/if}
</div>
