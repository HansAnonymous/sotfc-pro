<template>
	<Skeleton v-if="!images" height="432px" class="w-full mx-auto md:max-w-3xl"></Skeleton>
	<Galleria v-else :value="images" :numVisible="5" :showThumbnails="false" :showIndicators="true"
		:changeItemOnIndicatorHover="false" :indicatorsPosition="'bottom'" :show-item-navigators="true"
		:show-item-navigators-on-hover="true" :auto-play="true" :circular="true" :pt="{
		root: 'p-galleria p-component p-galleria-item-nav-onhover p-galleria-indicators-bottom',
		content: 'p-galleria-content flex flex-col',
		itemWrapper: 'p-galleria-item-wrapper group flex relative flex-col',
		itemContainer: 'p-galleria-item-container flex h-full relative',
		indicators: 'p-galleria-indicators p-reset pt-2 flex items-center justify-center',
		indicator: 'p-galleria-indicator mr-2',
		previousItemButton: 'p-galleria-item-prev p-galleria-item-nav p-link hover:bg-gray-300/20 p-ripple',
		item: 'p-galleria-item flex justify-center items-center h-full w-full',
		nextItemButton: 'p-galleria-item-next p-galleria-item-nav p-link hover:bg-gray-300/20 p-ripple right-0',
		indicatorButton: 'p-link w-4 h-4 rounded-full transition duration-200 focus:outline-none focus:outline-offset-0 bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600',
		caption: 'p-galleria-caption absolute bottom-0 left-0 w-full bg-black/50 text-white p-4',
		nextItemIcon: 'p-icon p-galleria-item-next-icon h-8 w-8',
		previousItemIcon: 'p-icon p-galleria-item-prev-icon h-8 w-8'
	}">
		<template #item="slotProps">
			<img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" class="w-full block rounded-xl" />
		</template>
		<template #caption="slotProps">
			<div class="text-xl mb-2 font-bold">{{ slotProps.item.title }}</div>
		</template>
	</Galleria>

	<h2 class="text-5xl font-bold text-center mt-12">
		Latest Winners
	</h2>
	<h3 class="text-xl font-bold text-center mt-1">
		<span>
			Week {{ latestGame ? latestGame.weekNum : 0 }} - {{ latestGame ? latestGame.name : "" }}
		</span>
	</h3>
	<div class="latest-winners"
		:class="{ 'grid-cols-1': computedNumPlaced() === 1, 'grid-cols-2': computedNumPlaced() === 2, 'grid-cols-3': computedNumPlaced() === 3 }">
		<WinnersCard v-if="computedLatestWinners(1).length > 0">
			<template #content>
				<ul class="grid gap-6"
					:class="{ 'grid-cols-1': computedLatestWinners(1).length > 1 && computedNumPlaced() <= 3, 'grid-cols-2': computedNumPlaced() <= 2 && computedLatestWinners(1).length >= 2 }">
					<li v-for="winner in computedLatestWinners(1)">
						<Nameplate :username="winner.username" icon-size="32" />
					</li>
				</ul>
			</template>
			<template #footer>
				1st Place
			</template>
		</WinnersCard>
		<WinnersCard v-if="computedLatestWinners(2).length > 0">
			<template #content>
				<ul class="grid gap-6"
					:class="{ 'grid-cols-1': computedLatestWinners(2).length > 1 && computedNumPlaced() <= 3, 'grid-cols-2': computedNumPlaced() <= 2 && computedLatestWinners(2).length >= 2 }">
					<li v-for="winner in computedLatestWinners(2)">
						<Nameplate :username="winner.username" icon-size="32" />
					</li>
				</ul>
			</template>
			<template #footer>
				2nd Place
			</template>
		</WinnersCard>
		<WinnersCard v-if="computedLatestWinners(3).length > 0">
			<template #content>
				<ul class="grid gap-5"
					:class="{ 'grid-cols-1': computedLatestWinners(3).length > 1 && computedNumPlaced() <= 3, 'grid-cols-2': computedNumPlaced() <= 2 && computedLatestWinners(3).length >= 2 }">
					<li v-for="winner in computedLatestWinners(3)">
						<Nameplate :username="winner.username" icon-size="32" />
					</li>
				</ul>
			</template>
			<template #footer>
				3rd Place
			</template>
		</WinnersCard>
	</div>
	<p class="text-center md:max-w-6xl mx-auto mt-6">
	</p>
</template>

<script setup lang="ts">
import type { Database, Tables } from "~/types/database.types";
const client = useSupabaseClient<Database>();

const images = [
	{
		itemImageSrc: 'mg/m35_Lockout_ship.png',
		alt: 'Spawn ship for minigame 35: Lockout',
		title: 'Spawn ship for Minigame 35: Lockout',
	},
	{
		itemImageSrc: 'mg/m33_Golf.png',
		alt: 'Minigame 33: Golf',
		title: 'Minigame 33: Golf',
	},
	{
		itemImageSrc: 'mg/m30_Laser_Tag_lobby.png',
		alt: 'Lobby for Minigame 30: Laser Tag',
		title: 'Lobby for Minigame 30: Laser Tag',
	},
	{
		itemImageSrc: 'mg/m28_Mario_Kart_group.png',
		alt: 'Group photo for Minigame 28: Mario Kart',
		title: 'Group photo for Minigame 28: Mario Kart',
	},
	{
		itemImageSrc: 'mg/m28_Mario_Kart.png',
		alt: 'Minigame 28: Mario Kart',
		title: 'Minigame 28: Mario kart',
	}
];

const computedLatestWinners = (n: number) => {
	let data = latestWinners.value?.filter(winner => winner.placement === n);
	const winners = data?.map(winner => {
		return {
			username: winner.player,
			placement: winner.placement
		}
	});

	return winners || [];
}
const computedNumPlaced = () => {
	let total = computedLatestWinners(1).length > 0 ? 1 : 0;
	total += computedLatestWinners(2).length > 0 ? 1 : 0;
	total += computedLatestWinners(3).length > 0 ? 1 : 0;
	return total;
}

const { data: latestGame } = await useAsyncData("latestGame", async () => {
	const { data, error } = await client
		.from("sotfc_minigames")
		.select("*")
		.eq("published", true)
		.order("date", { ascending: false })
		// .eq("week_number", 19)
		.limit(1).returns<Tables<"sotfc_minigames">>();
	return {
		weekNum: data[0].week_number,
		name: data[0].name
	} as { weekNum: number, name: string };
});

const { data: latestWinners } = await useAsyncData("latestWinners", async () => {
	const { data: latestGameData, error: latestGameError } = await client
		.from("sotfc_minigames")
		.select("*")
		.eq("published", true)
		.order("date", { ascending: false })
		.limit(1).returns<Tables<"sotfc_minigames">>();

	const { data, error } = await client
		.from("sotfc_summary")
		.select("*")
		.eq("published", true)
		.eq("minigame_id", latestGameData[0].id)
		.returns<Tables<"sotfc_summary">[]>();
	return data;
});

</script>

<style scoped lang="postcss">
.p-galleria {
	@apply md:max-w-3xl;
	width: 100%;
	margin: 0 auto;

	&:hover {
		:deep(.p-galleria-item-nav) {
			opacity: 1;
		}
	}
}

:deep(.p-galleria-caption) {
	@apply transition-all;
	border-bottom-left-radius: 0.75rem;
	border-bottom-right-radius: 0.75rem;
	opacity: 0;
}

.p-galleria:hover :deep(.p-galleria-caption) {
	opacity: 1;
}

:deep(.p-galleria-indicator button.p-link) {
	background-color: #424b57;
}

:deep(.p-galleria-item-nav) {
	@apply transition-all delay-75;
	width: 4rem;
	height: 4rem;
	border-radius: 6px;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	opacity: 0;
}

:deep(.p-galleria-indicator[data-p-highlight="true"] button.p-link) {
	background-color: #34d399;
}

:deep(.p-galleria-item-nav) {
	top: calc(50% - 32px);
	margin-left: 1rem;
	margin-right: 1rem;
	position: absolute;
}

:deep(.p-galleria-item img) {
	@apply transition-all ease-in-out duration-300;

}

.latest-winners {
	@apply grid gap-4 md:max-w-6xl mx-auto mt-6 w-fit;
}
</style>