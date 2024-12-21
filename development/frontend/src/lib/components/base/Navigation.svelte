<script lang="ts">
	import Menu from 'lucide-svelte/icons/menu';
	import { Palette } from 'lucide-svelte';

	import * as Sheet from '$lib/components/ui/sheet';
	import { buttonVariants } from '$lib/components/ui/button';

	import { page as pageStore } from '$app/state';

	let open = false;
</script>

<div class="260:flex 260:px-4 mx-auto hidden w-full max-w-[1800px] flex-col md:px-6 lg:px-8">
	<header class="bg-background sticky top-0 flex h-16 items-center border-b lg:h-20 xl:h-24">
		<nav
			class="2xl:gap-34 hidden w-full flex-col gap-8 text-2xl md:flex md:flex-row md:items-center lg:gap-20 lg:text-3xl xl:gap-32 xl:text-4xl 2xl:text-5xl"
		>
			<a
				href="/"
				title="Index Page"
				class="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors {pageStore
					.route.id === '/'
					? 'font-medium text-sky-950'
					: ''}"
			>
				<Palette class="xl:h12 xl:w-18 mr-1 h-8 w-8 lg:h-10 lg:w-10" />Directus Demo
				<span class="sr-only">Directus Demo</span>
			</a>
			<div class="flex grow flex-row justify-between">
				<a
					href="/auth"
					title="Auth Page"
					class="text-muted-foreground hover:text-foreground transition-colors {pageStore.route
						.id === '/auth'
						? 'font-medium text-sky-950'
						: ''}"
				>
					Auth
				</a>
			</div>
		</nav>
		<Sheet.Root bind:open>
			<Sheet.Trigger
				class="mr-3 flex shrink-0 focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden {buttonVariants(
					{
						variant: 'outline',
						size: 'icon'
					}
				)}"
			>
				<Menu class="h-6 w-6" />
				<span class="sr-only">Open Navigation</span>
			</Sheet.Trigger>
			<Sheet.Content side="left">
				<nav class="inline-flex flex-col items-start gap-6 text-2xl font-medium">
					<Palette class="mr-2 h-8 w-8" />
					<a
						onclick={() => {
							open = false;
						}}
						href="/"
						class="text-muted-foreground hover:text-foreground {pageStore.route.id === '/'
							? 'font-bold text-sky-950'
							: ''}"
					>
						Directus Demo
						<span class="sr-only">Directus Demo</span>
					</a>

					<a
						onclick={() => {
							open = false;
						}}
						href="/auth"
						class="text-muted-foreground hover:text-foreground {pageStore.route.id === '/auth'
							? 'font-bold text-sky-950'
							: ''}">Auth</a
					>
				</nav>
			</Sheet.Content>
		</Sheet.Root>
		<h1
			class="260:text-[1.1rem] 280:text-lg 300:text-xl 340:text-2xl font-medium text-sky-950 md:hidden"
		>
			<a href="/">Directus Demo</a>
		</h1>
	</header>
</div>
