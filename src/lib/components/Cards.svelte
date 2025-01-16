<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let {
		items,
		direction = 'left',
		speed = 'fast',
		pauseOnHover = true,
		className = undefined,
		image = undefined
	} = $props();

	// export let items: {
	// 	quote: string;
	// 	name: string;
	// 	title: string;
	// 	image: string;
	// }[];
	// export let direction: 'left' | 'right' | undefined = 'left';
	// export let speed: 'fast' | 'normal' | 'slow' | undefined = 'fast';
	// export let pauseOnHover: boolean | undefined = true;
	// export let className: string | undefined = undefined;

	let containerRef: HTMLDivElement;
	let scrollerRef: HTMLUListElement;

	onMount(() => {
		addAnimation();
	});

	let start = $state(false);

	function addAnimation() {
		if (containerRef && scrollerRef) {
			const scrollerContent = Array.from(scrollerRef.children);

			scrollerContent.forEach((item) => {
				const duplicatedItem = item.cloneNode(true);
				if (scrollerRef) {
					scrollerRef.appendChild(duplicatedItem);
				}
			});

			getDirection();
			getSpeed();
			start = true;
		}
	}
	const getDirection = () => {
		if (containerRef) {
			if (direction === 'left') {
				containerRef.style.setProperty('--animation-direction', 'forwards');
			} else {
				containerRef.style.setProperty('--animation-direction', 'reverse');
			}
		}
	};
	const getSpeed = () => {
		if (containerRef) {
			if (speed === 'fast') {
				containerRef.style.setProperty('--animation-duration', '20s');
			} else if (speed === 'normal') {
				containerRef.style.setProperty('--animation-duration', '40s');
			} else {
				containerRef.style.setProperty('--animation-duration', '80s');
			}
		}
	};
</script>

<div
	bind:this={containerRef}
	class={cn(
		'scroller relative z-20 mt-12  hidden max-w-7xl  overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] lg:block',
		className
	)}
>
	<ul
		bind:this={scrollerRef}
		class={cn(
			' flex w-full max-w-[100vw] shrink-0 flex-nowrap gap-4 py-4',
			start && 'animate-scroll ',
			pauseOnHover && 'hover:[animation-play-state:paused]'
		)}
	>
		{#each items as item, idx (item.name)}
			<li
				class="relative flex space-x-4 w-fit max-w-[350px] flex-shrink-0 rounded-2xl border border-slate-700 px-6 py-4"
				style="background: linear-gradient(180deg, var(--slate-800), var(--slate-900));"
			>
				<blockquote>
					<div
						aria-hidden="true"
						class="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
					></div>
					<span class=" relative z-20 text-sm font-normal leading-[1.6] text-black">
						{item.quote}
					</span>
					<div class="relative z-20 mt-6 flex flex-row items-center">
						<span class="flex flex-col gap-1">
							<span class=" text-sm font-normal leading-[1.6] text-slate-600">
								{item.name}
							</span>
							<span class=" text-sm font-normal leading-[1.6] text-slate-600">
								{item.title}
							</span>
						</span>
					</div>
				</blockquote>
				{#if item.image}
					<img src={item.image} alt="test" height={100} width={100} class="rounded-full" />
				{/if}
			</li>
		{/each}
	</ul>
</div>
