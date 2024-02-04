<template>
	<Head>
		<Title>Contestants - SOTFC</Title>
	</Head>
	<h1 class="text-center text-5xl py-6 font-bold">Contestants</h1>
	<div class="mx-auto md:max-w-4xl grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:max-w-7xl lg:grid-cols-4">
		<PlayerCard v-for="player in players" :key="player.id" :player="player" />
	</div>
</template>

<script setup lang="ts">
import type { Database, Tables } from "~/types/database.types";
const client = useSupabaseClient<Database>();

const { data: players } = await useAsyncData("players", async () => {
	const { data, error } = await client
		.from("sotfc_players")
		.select("*")
		.order("username", { ascending: true })
		.returns<Tables<"sotfc_players">[]>();

	if (error) {
		console.log(error);
		return;
	}

	return Object.values(data);
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