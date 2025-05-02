<script lang="ts">
	import { User, FileText, BarChart, MessageCircleQuestion, Settings } from 'lucide-svelte';
</script>

<div class="grid grid-cols-2 gap-4 px-4 mb-4">
	<a href="/admin/clienti" class="admin-btn item-primary">
		<User class="h-6 w-6" />
		<span class="truncate">Clienti</span>
	</a>
	<a href="/admin/documenti" class="admin-btn item-primary">
		<FileText class="h-6 w-6" />
		<span class="truncate">Documenti</span>
	</a>
	<a href="/admin/statistiche" class="admin-btn item-primary">
		<BarChart class="h-6 w-6" />
		<span class="truncate">Statistiche</span>
	</a>
	<a href="/admin/faq" class="admin-btn item-primary">
		<MessageCircleQuestion class="h-6 w-6" />
		<span class="truncate">FAQ</span>
	</a>
</div>

<style>
	.admin-btn {
		@apply flex items-center justify-start gap-2 rounded-xl p-4 text-base font-semibold transition duration-150 ease-in;
	}
</style>
