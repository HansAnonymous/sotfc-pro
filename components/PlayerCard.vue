<template>
	<a :href="`/contestants/${player.username}`" class="player-card">
		<img :src="`https://crafatar.com/renders/body/${player.uuid}`" width="48" />
		<div class="player-info">
			<h1>
				{{ player.username }}
			</h1>
			<div class="info-body">
				<div class="tags">
					<div class="tag-container" v-for="tag, index in player.tags" :key="index">
						<Tag v-if="tag === 'Host'" :value="tag" severity="success" />
						<Tag v-else-if="tag === 'Developer'" :value="tag" severity="info" />
						<Tag v-else-if="tag === 'Builder'" :value="tag" severity="warning" />
						<Tag v-else :value="tag" severity="danger" />
					</div>
				</div>
				<p class="member-since">
					Member Since: {{ player.member_since }}
				</p>
			</div>
		</div>
	</a>
</template>

<script setup lang="ts">
import type { Database, Tables } from "~/types/database.types";

interface PlayerCardProps {
	player: Tables<"sotfc_players">
}
const {
	player = {
		color: "",
		id: "",
		member_since: "",
		name: "AntiHans",
		notes: "",
		username: "AntiHans",
		uuid: "",
		tags: "",
	}
} = defineProps<PlayerCardProps>();
</script>

<style scoped lang="postcss">
.player-card {
	@apply flex items-center gap-6 px-4 py-3 rounded bg-sky-600/10 hover:bg-sky-500/20;

	&:hover .member-since {
		@apply block;
	}
}

.player-info {
	@apply flex flex-col w-full h-full gap-2;
}

.info-body {
	@apply flex flex-col justify-between w-full h-full;

	h1 {
		@apply text-lg font-bold;
	}

	.tags {
		@apply flex gap-2;
	}

	.member-since {
		@apply hidden;
		@apply text-sm text-slate-300;
	}
}
</style>