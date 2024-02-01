<template>
	<Head>
		<Title>SOTFC - {{ $route.params.username }}</Title>
	</Head>
	Profile: {{ $route.params.username }}
</template>

<script setup lang="ts">
const route = useRoute();
</script>