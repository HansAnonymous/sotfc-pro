<template>
	<div v-if="minigame">

		<Head>
			<Title>Week {{ $route.params.week }} - SOTFC</Title>
		</Head>
		<div class="minigame">
			<div class="flex"
				:class="{ 'justify-end': parseInt(route.params.week.toString()) === 1, 'justify-between': parseInt(route.params.week.toString()) !== 1 }">
				<NuxtLink v-if="parseInt(route.params.week.toString()) > 1" class="bg-cyan-900/80 p-2 rounded"
					:to="`/events/${parseInt(route.params.week.toString()) - 1}`">
					<Button class="back-button w-fit">
						<i class="pi pi-angle-left" />
						Minigame #{{ parseInt(minigame.week_number.toString()) - 1 }}
					</Button>
				</NuxtLink>
				<NuxtLink v-if="parseInt(route.params.week.toString()) < (latestWeekNum ? latestWeekNum : 0)"
					class="bg-cyan-900/80 p-2 rounded" :to="`/events/${parseInt(route.params.week.toString()) + 1}`">
					<Button class="back-button w-fit">
						Minigame #{{ parseInt(minigame.week_number.toString()) + 1 }}
						<i class="pi pi-angle-right" />
					</Button>
				</NuxtLink>
			</div>
			<div class="name-container">
				<h1 class="">{{ minigame.name }}</h1>
				<h2 class="week-number">Week #{{ minigame.week_number }}</h2>
			</div>
			<h4 class="date">{{ formattedDate(minigame.date) }}</h4>

			<div class="latest-winners"
				:class="{ 'grid-cols-1': computedNumPlaced() === 1, 'grid-cols-2': computedNumPlaced() === 2, 'grid-cols-3': computedNumPlaced() === 3 }">
				<WinnersCard v-if="computedLatestWinners(1).length > 0">
					<template #content>
						<ul class="grid gap-6"
							:class="{ 'grid-cols-1': computedLatestWinners(1).length > 1 && computedNumPlaced() <= 3, 'grid-cols-2': computedNumPlaced() <= 2 && computedLatestWinners(1).length >= 2 }">
							<li v-for=" winner  in  computedLatestWinners(1) ">
								<Nameplate :username="winner.username || ''" icon-size="32" />
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
							<li v-for=" winner  in  computedLatestWinners(2) ">
								<Nameplate :username="winner.username || ''" icon-size="32" />
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
							<li v-for=" winner  in  computedLatestWinners(3) ">
								<Nameplate :username="winner.username || ''" icon-size="32" />
							</li>
						</ul>
					</template>
					<template #footer>
						3rd Place
					</template>
				</WinnersCard>
			</div>
		</div>
	</div>
	<div v-else>
		404
	</div>
</template>

<script setup lang="ts">
const route = useRoute();
import type { Database, Tables } from "~/types/database.types";
const client = useSupabaseClient<Database>();

const formattedDate = (date: string) => {
	return new Date(date).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const computedNumPlaced = () => {
	let total = computedLatestWinners(1).length > 0 ? 1 : 0;
	total += computedLatestWinners(2).length > 0 ? 1 : 0;
	total += computedLatestWinners(3).length > 0 ? 1 : 0;
	return total;
}

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

const { data: minigame } = await useAsyncData("minigame", async () => {
	const { data, error } = await client
		.from("sotfc_minigames")
		.select("*")
		.eq("published", true)
		.eq("week_number", route.params.week)
		.single();

	if (error) {
		console.log(error);
		return;
	}

	return data;
});

const { data: latestWeekNum } = await useAsyncData("latestWeekNum", async () => {
	const { data, error } = await client
		.from("sotfc_minigames")
		.select("week_number")
		.eq("published", true)
		.order("date", { ascending: false })
		.limit(1);

	if (error) {
		console.log(error);
		return;
	}

	return data[0].week_number;
});

const { data: latestWinners } = await useAsyncData("latestWinners", async () => {
	const { data, error } = await client
		.from("sotfc_summary")
		.select("*")
		.eq("week_number", route.params.week)
		.returns<Tables<"sotfc_summary">[]>();

	if (error) {
		console.log(error);
		return;
	}

	return data;
});

</script>

<style scoped lang="postcss">
.minigame {
	@apply max-w-4xl mx-auto w-full;
	@apply p-4 rounded;
	@apply bg-sky-400/20;
	@apply flex flex-col gap-4;

	.name-container {
		@apply sm:flex items-end gap-2;

		h1 {
			@apply text-4xl lg:text-5xl font-bold;
		}

		h2.week-number {
			@apply text-lg text-slate-300;
		}
	}


	.date {
		@apply text-sm text-slate-400 font-extrabold;
		@apply w-full;
	}

	.player-name {
		@apply text-xl text-neutral-400;
	}

	.latest-winners {
		@apply grid gap-4;
	}
}
</style>