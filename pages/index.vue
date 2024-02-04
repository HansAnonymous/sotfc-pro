<template>
	<Skeleton v-if="!images" height="432px" class="w-full mx-auto md:max-w-3xl"></Skeleton>
	<Galleria v-else :value="images" :numVisible="5" :showThumbnails="false" :showIndicators="true"
		:changeItemOnIndicatorHover="false" :indicatorsPosition="'bottom'" :show-item-navigators="true"
		:show-item-navigators-on-hover="true" :auto-play="true" :circular="true" :pt="{
			indicators: 'pt-2',
			previousItemButton: 'hover:bg-gray-300/20 p-ripple absolute',
			nextItemButton: 'hover:bg-gray-300/20 p-ripple absolute',
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
import { MainPhotos } from '@/service/MainPhotos';
const images = ref();

onMounted(() => {
	MainPhotos.getImages().then(data => {
		images.value = data
	});
})

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
}

:deep(.p-galleria-caption) {
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

:deep(.p-galleria-indicator.p-highlight button.p-link) {
	background-color: #34d399;
}

:deep(.p-galleria-item-nav) {
	top: calc(50% - 32px);
	margin-left: 1rem;
	margin-right: 1rem;
}

.latest-winners {
	@apply grid gap-4 md:max-w-6xl mx-auto mt-6 w-fit;
}
</style>