<template>
	<h1 class="text-center text-5xl py-6 font-bold">Leaderboard</h1>
	<table class="table">
		<tr class="cursor-default bg-slate-900/50">
			<th colspan="2">Player</th>
			<th>Points</th>
		</tr>
		<tr :class="'cursor-default hover:bg-slate-800/50 ' + (index % 2 === 0 ? 'bg-slate-950/50' : 'bg-slate-900/50')"
			v-for="placement, index in placements" :key="index">
			<td v-if="index === 0" class="p-2" align="center">
				<img src="assets/crown.png" class="w-4" alt="🥇" />
			</td>
			<td v-else-if="index === 1" class="p-2" align="center">
				<img src="assets/2nd_medal.png" class="w-5" alt="🥈" />
			</td>
			<td v-else-if="index === 2" class="p-2" align="center">
				<img src="assets/3rd_medal.png" class="w-5" alt="🥉" />
			</td>
			<td v-else class="p-2 text-center">{{ index + 1 + "." }}</td>
			<td class="p-2 font-bold">
				<Nameplate :username="placement.name" iconSize="24" />
			</td>
			<td class="p-2 font-bold text-center">{{ placement.points }}</td>
		</tr>
	</table>
</template>

<script setup lang="ts">
import type { Database, Tables } from "~/types/database.types";
const client = useSupabaseClient<Database>();
const multipliers = [3, 2, 1];

const { data: placements } = await useAsyncData("placements", async () => {
	const { data, error } = await client
		.from("sotfc_summary")
		.select("*")
		.returns<Tables<"sotfc_summary">[]>();

	if (error) {
		console.log(error);
		return;
	}
	const leaderboard: { [name: string]: { name: string; points: number } } = {};
	for (let p of data) {
		let currentPoints = leaderboard[p.player]?.points || 0;
		leaderboard[p.player] = {
			name: p.player,
			points: currentPoints + multipliers[p.placement - 1]
		};
	}
	// return Object.values(leaderboard);
	// Sort leaderboard
	const leaderboardArray = Object.values(leaderboard);
	leaderboardArray.sort((a, b) => b.points - a.points);
	return leaderboardArray;
});
</script>

<style scoped lang="postcss">
.table {
	@apply w-full lg:max-w-xl md:max-w-lg mx-auto rounded border-collapse;

	tr>th {
		@apply p-2;
	}

	th,
	td {
		@apply select-none;
	}

	th:first-of-type {
		border-top-left-radius: 0.5rem;
	}

	th:last-of-type {
		border-top-right-radius: 0.5rem;
	}

	tr:last-of-type td:first-of-type {
		border-bottom-left-radius: 0.5rem;
	}

	tr:last-of-type td:last-of-type {
		border-bottom-right-radius: 0.5rem;
	}
}
</style>