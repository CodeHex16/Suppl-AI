<script lang="ts">
	import { User, FileText, BarChart, MessageCircleQuestion, Settings } from 'lucide-svelte';
</script>

<div class="grid grid-cols-2 gap-4 px-4 mb-4">
	<a href="/admin/clienti" class="admin-btn item-primary">
		<User class="h-6 w-6" />
		Clienti
	</a>
	<a href="/admin/documenti" class="admin-btn item-primary">
		<FileText class="h-6 w-6" />
		Documenti
	</a>
	<a href="/admin/statistiche" class="admin-btn item-primary">
		<BarChart class="h-6 w-6" />
		Statistiche
	</a>
	<a href="/admin/faq" class="admin-btn item-primary">
		<MessageCircleQuestion class="h-6 w-6" />
		FAQ
	</a>
</div>
<!-- <div class="mb-6 mt-4 px-4">
	<a href="/admin/gestione_piattaforma" class="admin-btn item-primary">
		<Settings class="h-6 w-6" />
		Gestione Piattaforma
	</a>
</div> -->

<style>
	.admin-btn {
		@apply flex items-center justify-start gap-2 rounded-xl p-4 text-base font-semibold transition duration-150 ease-in;
	}
</style>
