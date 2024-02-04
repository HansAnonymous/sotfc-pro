<template>
	<div v-if="loggedIn">
	</div>
	<div v-else class="flex flex-col mx-auto max-w-md gap-8 mt-12">
		<span class="p-float-label">
			<InputText text="password" v-model="password" type="password" id="password" class="p-2 bg-slate-800 w-full"
				@input="clearError" />
			<label for="password">Password</label>
		</span>

		<div>
			<Button label="Login" class="p-2 w-full login-btn text-black" @click="loginClick" />
			<span class="error">{{ errorText }}</span>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Database, Tables } from "~/types/database.types";
const client = useSupabaseClient<Database>();
const runtimeConfig = useRuntimeConfig();

const loggedIn = ref(false);
const password = ref("");

const errorText = ref("");

const clearError = () => {
	errorText.value = "";
}

const pass = computed(() => runtimeConfig.public.ADMIN_PASS);

const loginClick = () => {
	if (password.value) {
		if (password.value === pass.value) {
			loggedIn.value = true;
		} else {
			errorText.value = "Invalid password";
		}
	} else {
		errorText.value = "Please enter a password";
	}
}
</script>

<style scoped lang="postcss">
.login-btn {
	background-color: rgba(110, 250, 251, 0.85);
}

.error {
	@apply text-red-500 text-sm w-full;
}
</style>