<template>
	<div class="mx-auto w-fit">
		<div class="bg-slate-900/50 p-5">
			<div v-if="!successfull">
				<h2 class="text-2xl font-bold">Login</h2>
				<div class="flex flex-col gap-2 pt-2">
					<label for="email">Email</label>
					<InputText v-model="email" type="text" id="email" class="p-2 bg-slate-800 w-full" />
					<!-- <label for="password">Password</label>
						<InputText v-model="password" type="password" id="password" class="p-2 bg-slate-800 w-full" /> -->
					<button @click="signInWithOtp" class="bg-slate-800/50 p-2 rounded">Sign in with email</button>
				</div>
			</div>
			<div v-else>
				<h1 class="text-3xl font-bold">Please check your email for the login link</h1>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Database, Tables } from "~/types/database.types";
const client = useSupabaseClient<Database>();

if ((await client.auth.getUser()).data.user) {
	useRouter().push("/");
}
const email = ref("");
const successfull = ref(false);

const signInWithOtp = async () => {
	const { error } = await client.auth.signInWithOtp({
		email: email.value,
		options: {
			emailRedirectTo: 'https://localhost:3000/confirm',
		}
	});
	if (error) {
		console.log(error);
	} else {
		successfull.value = true
	}
}
</script>

<style scoped lang="postcss"></style>