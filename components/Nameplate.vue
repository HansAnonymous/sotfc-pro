<template>
	<a :href='"/contestants/" + username' class="nameplate">
		<img :src="`https://crafthead.net/helm/${username}`" :width="iconSize" />
		<span class="username">
			{{ username }}
		</span>
	</a>
</template>

<script setup lang="ts">
interface NameplateProps {
	username: string
	iconSize?: string
}
const {
	username = "AntiHans",
	iconSize = "32"
} = defineProps<NameplateProps>();
</script>

<style scoped lang="postcss">
.nameplate {
	@apply transition-all;
	@apply flex gap-3 dark:hover:bg-slate-200/10 hover:bg-slate-800/30 p-1 rounded;
}

.username {
	@apply text-lg;
}
</style>