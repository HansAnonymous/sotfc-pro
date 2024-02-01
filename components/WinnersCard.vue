<template>
	<Card class="">
		<template #content>
			<div class="content">
				<slot name="content"></slot>
			</div>
		</template>
		<template #footer>
			<div class="winner-label">
				<slot name="footer"></slot>
			</div>
		</template>
	</Card>
</template>

<script lang="ts">
</script>

<style scoped lang="postcss">
:deep(.p-card-body) {
	@apply h-full flex flex-col justify-between;
}

:deep(.p-card-content) {
	flex: 1;
	display: flex;
	justify-content: center;
}

.content {
	@apply text-center text-2xl flex justify-center place-self-center;
}

.winner-label {
	@apply text-center text-3xl;
	text-shadow: 2px 2px 5px white;
}
</style>