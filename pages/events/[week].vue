<template>
	<Head>
		<Title>SOTFC - Week {{ $route.params.week }}</Title>
	</Head>
	Week: {{ $route.params.week }}
</template>

<script setup lang="ts">
const route = useRoute();
</script>