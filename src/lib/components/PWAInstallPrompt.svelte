<script>
	// @ts-ignore
	import { logger } from '$lib/utils/logger';
	import { browser } from '$app/environment';
	let { data } = $props();

	// @ts-ignore
	let deferredPrompt = null;
	let showButton = $state(false);
	showButton = data?.showButton ? data.showButton : false; // for test

	if (browser) {
		// @ts-ignore
		window.addEventListener('beforeinstallprompt', (e) => {
			// Prevent the mini-info bar from appearing on mobile
			e.preventDefault();
			// Stash the event so it can be triggered later.
			deferredPrompt = e;
			// Update UI notify the user they can add to home screen
			showButton = localStorage.getItem('dismissedPWAInstallPrompt') !== 'true';
			console.log('beforeinstallprompt', e);
		});

		
		}

    function installApp() {
			// @ts-ignore
			if (deferredPrompt) {
				deferredPrompt.prompt();
				// @ts-ignore
				deferredPrompt.userChoice.then((choiceResult) => {
					if (choiceResult.outcome === 'accepted') {
						logger.log('Accepted the install prompt');
					} else {
						console.log('Rejected the install prompt');
					}
					deferredPrompt = null;
					showButton = false;
				});
			}
		}

	function closePrompt() {
		localStorage.setItem('dismissedPWAInstallPrompt', 'true');
		showButton = false;
	}
</script>

{#if showButton}
<div class="fixed bottom-0 left-0 right-0 bg-white text-purple-700 p-4 flex justify-between items-center z-10" style="box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);">
	<div class="flex items-left gap-2 mr-2">
		<!-- Logo -->
		<img src="/web/icon-192.png" alt="App Icon" class="w-10 h-10 mr-2" />
		<!-- App Name -->
		<div class="flex flex-col items-start">
			<span class="font-bold">SUPPL-AI</span>
			<!-- Description -->
			<span class="text-sm text-gray-600 mt-1">Installa l'app per un accesso rapido e facile</span>
		</div>
	</div>
	<div class="flex gap-2 items-center">
		<button 
			onclick={installApp} 
			class="item-primary rounded-full border-none p-3 text-center font-bold cursor-pointer">
			Install
		</button>
		<button 
			onclick={closePrompt} 
			class="bg-none border-none text-2xl font-bold text-primary cursor-pointer">
			&times;
		</button>
	</div>
</div>

{/if} 