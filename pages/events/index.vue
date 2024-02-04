<template>
	<Head>
		<Title>Events - SOTFC</Title>
	</Head>
	<h1 class="text-center text-5xl py-6 font-bold">Events</h1>
	<table class="table">
		<tr class="cursor-default bg-slate-900/50">
			<th class="">Event</th>
			<th class="">Date</th>
		</tr>
		<tr :class="'cursor-default hover:bg-slate-800/50 ' + (index % 2 === 0 ? 'bg-slate-950/50' : 'bg-slate-900/50')"
			v-for="event, index in  events " :key="index">
			<td class="p-2">
				<a :href="'/events/' + event.id" class=" flex hover:bg-slate-200/10 rounded py-1 px-2">
					{{ event.name }}
				</a>
			</td>
			<td class="p-2">{{ event.date }}</td>
		</tr>
	</table>
</template>

<script setup lang="ts">
import type { Database, Tables } from "~/types/database.types";
const client = useSupabaseClient<Database>();

const { data: events } = await useAsyncData("events", async () => {
	const { data, error } = await client
		.from("sotfc_minigames")
		.select("*")
		.order("date", { ascending: false })
		.returns<Tables<"sotfc_minigames">[]>();
	if (error) {
		console.log(error);
		return;
	}
	return data;
})
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