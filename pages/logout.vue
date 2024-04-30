<script setup lang="ts">
import type { Database, Tables } from "~/types/database.types";
const client = useSupabaseClient<Database>();
client.auth.signOut();
useRouter().push("/");
</script>