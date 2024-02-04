<template>
	<div v-if="player">

		<Head>
			<Title>{{ player.username }} - SOTFC</Title>
		</Head>
		<div class="profile">
			<div class="profile-body">
				<div class="name-container">
					<h1 class="">{{ player.username }}</h1>
					<h2 class="player-name">{{ player.name }}</h2>
				</div>
				<div class="tags">
					<div class="tag-container" v-for="tag, index in player.tags" :key="index">
						<Tag v-if="tag === 'Host'" :value="tag" severity="success" />
						<Tag v-else-if="tag === 'Developer'" :value="tag" severity="info" />
						<Tag v-else :value="tag" />
					</div>
				</div>
				<h4 class="date-joined">Joined: {{ formattedDate(player.member_since) }}</h4>

				<!-- Number of medals -->
				<table class="placement-table">
					<tr class="bg-slate-900/50">
						<th align="center">
							<img src="assets/crown.png" class="w-12" alt="🥇" />
						</th>
						<th align="center">
							<img src="assets/2nd_medal.png" class="w-12" alt="🥈" />
						</th>
						<th align="center">
							<img src="assets/3rd_medal.png" class="w-12" alt="🥉" />
						</th>
					</tr>
					<tr class="bg-slate-800/50">
						<td class="text-center text-2xl font-extrabold">
							<div class="flex flex-col">
								<span>
									{{ placementWins!.first }}
								</span>
								<span class="text-base font-bold text-slate-400">
									1st place wins
								</span>
							</div>
						</td>
						<td class="text-center text-2xl font-extrabold">
							<div class="flex flex-col">
								<span>
									{{ placementWins!.second }}<br />
								</span>
								<span class="text-base font-bold text-slate-400">
									2nd place wins
								</span>
							</div>
						</td>
						<td class="text-center text-2xl font-extrabold">
							<div class="flex flex-col">
								<span>
									{{ placementWins!.third }}<br />
								</span>
								<span class="text-base font-bold text-slate-400">
									3rd place wins
								</span>
							</div>
						</td>
					</tr>
				</table>

				<!-- Weeks won -->
				<table class="minigames-won">
					<tr class="cursor-default bg-slate-900/50">
						<th align="center">Week</th>
						<th align="center">Minigame</th>
						<th align="center">Placement</th>
					</tr>

					<tr :class="'cursor-default hover:bg-slate-800/50 ' + (index % 2 === 0 ? 'bg-slate-950/50' : 'bg-slate-900/50')"
						v-for="minigame, index in minigamesWon" :key="index">
						<td align="center">
							{{ minigame.week_number }}
						</td>
						<td align="center">
							<a :href="'/events/' + minigame.minigame_id"
								class=" flex hover:bg-slate-200/10 rounded py-1 px-2">
								{{ minigame.minigame }}
							</a>
						</td>
						<td align="center">
							{{ minigame.placement }}
						</td>
					</tr>
				</table>
			</div>
			<div class="flex-1 mt-8">
				<img class="avatar" :src="`https://crafatar.com/renders/body/${player.uuid}`" />
				<!-- <iframe :src="`https://minerender.org/embed/skin/?skin=${player.username}&shadow=true`" frameborder="0"></iframe> -->
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

const { data: player } = await useAsyncData("player", async () => {
	const { data, error } = await client
		.from("sotfc_players")
		.select("*")
		.eq("username", route.params.username)
		.single();

	if (error) {
		console.log(error);
		return;
	}
	return data;
});

const { data: minigamesWon } = await useAsyncData("minigamesWon", async () => {
	const { data, error } = await client
		.from("sotfc_summary")
		.select("week_number, minigame, placement, date, minigame_id")
		.order("date", { ascending: false })
		.eq("player", route.params.username);

	if (error) {
		console.log(error);
		return;
	}

	return data;
});

const { data: placementWins } = await useAsyncData("placementWins", async () => {
	const { data, error } = await client
		.from("sotfc_summary")
		.select("placement")
		.eq("player", route.params.username);

	if (error) {
		console.log(error);
		return;
	}

	let first = data.filter(x => x.placement === 1).length || 0;
	let second = data.filter(x => x.placement === 2).length || 0;
	let third = data.filter(x => x.placement === 3).length || 0;

	return {
		first,
		second,
		third
	};
});
</script>

<style scoped lang="postcss">
.profile {
	@apply max-w-4xl mx-auto w-full;
	@apply p-4 rounded;
	@apply bg-sky-400/20;
	@apply md:flex;

	.profile-body {
		@apply flex flex-col gap-4 w-full max-w-xl sm:max-w-3xl md:max-w-xl;
	}

	.name-container {
		@apply sm:flex items-end gap-2;

		h1 {
			@apply text-4xl lg:text-5xl font-bold;
		}

		h2.player-name {
			@apply text-lg text-slate-300;
		}
	}

	.date-joined {
		@apply text-sm text-slate-400 font-extrabold;
		@apply w-full;
	}

	.player-name {
		@apply text-xl text-neutral-400;
	}

	.placement-table,
	.minigames-won {
		@apply w-full lg:max-w-3xl md:max-w-xl rounded border-collapse;

		tr>th {
			@apply p-2;
		}

		th,
		td {
			@apply select-none;
			@apply p-2;
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

	.tags {
		@apply flex gap-2 cursor-default select-none;
	}

	.avatar {
		@apply -scale-x-100 mx-auto;
	}

}
</style>