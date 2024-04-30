<template>
	<div v-if="!userData" class="flex w-full h-full items-center">
		<ProgressSpinner class="w-sm" />
	</div>
	<div v-else class="adminpanel flex flex-col mx-auto gap-8">
		<div v-if="isAdmin">
			<TabView :pt="{
		navContent: 'overflow-y-hidden overscroll-contain overscroll-auto scroll-smooth [&::-webkit-scrollbar]:hidden rounded-t'
	}">
				<TabPanel header="Minigames">
					<div v-if="userInfo">
						<Menubar :model="minigameItems">
							<template #end>
								<span class="pr-4">
									Hi, {{ userInfo.first_name }}!
								</span>
							</template>
						</Menubar>
						<DataTable ref="mgDataTable" :value="minigames" dataKey="id" :paginator="true" :rows="10"
							:filters="minigameFilters"
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
							:rowsPerPageOptions="[10, 25, 50]" sortField="week_number" :sortOrder="-1"
							currentPageReportTemplate="Showing {first} to {last} of {totalRecords} minigames">
							<template #header>
								<div class="flex flex-wrap gap-2 items-center justify-between">
									<h4 class="m-0">Manage Minigames</h4>
									<IconField iconPosition="left">
										<InputIcon>
											<i class="pi pi-search" />
										</InputIcon>
										<InputText v-model="minigameFilters['global'].value" placeholder="Search..." />
									</IconField>
								</div>
							</template>
							<Column field="week_number" header="Week #" sortable style="width: 15%"></Column>
							<Column field="name" header="Name" style="width: 60%"></Column>
							<Column field="date" header="Date" style="width: 15%"></Column>
							<Column field="published" header="Published" sortable style="width: 10%">
								<template #body="slotProps">
									<div class="flex mx-auto w-full">
										<Checkbox :model-value="slotProps.data.published" :binary="true" readonly
											class="mx-auto" />
									</div>
								</template>
							</Column>
						</DataTable>
					</div>
				</TabPanel>
				<TabPanel header="Contestants">
					<div v-if="userInfo">
						<div v-if="userInfo">
							<Menubar :model="contestantItems">
								<template #end>
									<span class="pr-4">
										Hi, {{ userInfo.first_name }}!
									</span>
								</template>
							</Menubar>
						</div>
					</div>
				</TabPanel>
			</TabView>
			<Toast />
		</div>
		<div v-else>
			<p>
				You are not an admin
			</p>
			<Button @click="navigateTo('/')" label="Return to home" class="w-fit" />
		</div>
		<Dialog v-model:visible="minigameDialog" :style="{ width: '450px' }" header="Minigame Details" :modal="true"
			class="p-fluid flex flex-col">
			<div class="flex flex-col gap-4">
				<div class="field flex flex-col gap-2">
					<label for="week_number">Week #</label>
					<InputNumber v-model="minigame.week_number" required="true" :disabled="true" />
				</div>
				<div class="field flex flex-col gap-2">
					<label for="name">Name</label>
					<InputText v-model.trim="minigame.name" required="true" autofocus class="p-2"
						:class="{ 'p-invalid': minigameSubmitted && !minigame.name }" />
					<small class="p-error" v-if="minigameSubmitted && !minigame.name">Name is required.</small>
				</div>
				<div class="field flex flex-col gap-2">
					<label for="date">Date</label>
					<Calendar v-model="minigame.date" required="true" />
				</div>
				<div class="field flex justify-between">
					<div class="flex">
						<label class="m-auto" for="published">Published</label>
					</div>
					<InputSwitch v-model="minigame.published" />
				</div>
				<!-- Save -->
				<div class="flex justify-end">
					<Button @click="minigameDialog = false" label="Cancel" class="p-button-text p-button-danger" />
					<Button @click="saveMinigame" label="Save" class="p-button-success" />
				</div>
			</div>
		</Dialog>
	</div>
</template>

<script setup lang="ts">
import Toast from "primevue/toast";
import { PrimeIcons } from 'primevue/api';

import type { Database, Tables } from "~/types/database.types";
import { FilterMatchMode } from "primevue/api";

const client = useSupabaseClient<Database>();
const isAdmin = ref(false);
const toast = useToast();

const mgDataTable = ref();
const minigames = ref();
const minigameFilters = ref({
	'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const { data: userData } = await useAsyncData("userData", async () => {
	const { data: userData, error: userError } = await client.auth.getUser();
	if (userError) {
		console.log(userError);
		return;
	}
	return userData.user;
});
if (!userData) {
	navigateTo("/login");
}
const { data: userInfo } = await useAsyncData("userInfo", async () => {
	const { data: userInfo, error: userInfoError } = await client
		.from("users")
		.select("*")
		.eq("id", userData.value.id)
		.single();
	if (userInfoError) {
		console.log(userInfoError);
	}
	return userInfo;
});
const { data: permissions } = await useAsyncData("permissions", async () => {
	const { data: permissionsData, error: permissionsError } = await client
		.from("user_roles")
		.select("*")
		.eq("user", userData.value.id)
		.eq("role", "sotfc.admin");
	if (permissionsError) {
		console.log(permissionsError);
		return false;
	}
	return permissionsData.length > 0;
});
if (permissions) {
	isAdmin.value = true;
}

const minigameItems = ref([
	{
		label: 'Add',
		icon: PrimeIcons.PLUS,
		command: () => {
			newMinigameDialog();
			// toast.add({ severity: 'info', summary: 'Minigames', detail: 'Coming soon!', life: 3000 });
		}
	}
]);

const minigame = ref({});
const minigameSubmitted = ref(false);
const minigameDialog = ref(false);

const newMinigameDialog = () => {
	minigame.value = {
		week_number: minigames.value.length + 1,
		name: "",
		date: new Date(),
		published: false
	};
	minigameSubmitted.value = false;
	minigameDialog.value = true;
}

const saveMinigame = async () => {
	minigameSubmitted.value = true;
	if (minigame.value.name === "") {
		return;
	}
	const { error } = await client
		.from("sotfc_minigames")
		.insert(minigame.value);
	if (error) {
		console.log(error);
		return;
	}
	minigames.value = [...minigames.value, minigame.value];
	minigameDialog.value = false;
}

const contestantItems = ref([
	{
		label: 'Add',
		icon: PrimeIcons.PLUS,
		command: () => {
			toast.add({ severity: 'info', summary: 'Contestants', detail: 'Coming soon!', life: 3000 });
		}
	}
]);
onMounted(async () => {
	const { data, error } = await client
		.from("sotfc_minigames")
		.select("*");
	if (error) {
		console.log(error);
		return;
	}
	minigames.value = data;
});

</script>

<style scoped lang="postcss">
.adminpanel {
	:deep(.p-tabview-header:not(.p-highlight) a) {
		@apply bg-sky-600/10;
	}
}
</style>
<style lang="postcss">
.p-inputnumber input.p-inputtext {
	@apply p-2;
}

.p-calendar input.p-inputtext {
	@apply p-2;
}
</style>
