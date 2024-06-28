<template>
  <main>
    <body>
      <div id="root">
        <div class="container">
          <div class="header-title">
            <h1>Nuxt SSO Implementation</h1>
          </div>
          <div class="content">
            <div class="json">
              <div id="authentication-response" class="json-container-view">
                <VueJsonPretty :data="authData" />
              </div>
            </div>
            <br />
            <br />
            <div class="json">
              <div id="authentication-response" class="json-container-view">
                <VueJsonPretty :data="accessToken" />
              </div>
            </div>
            <br />
            <br />
            <div class="json">
              <div id="authentication-response" class="json-container-view">
                <VueJsonPretty :data="idTtoken" />
              </div>
            </div>
            <br />
            <br />
            <button class="btn primary mt-4" @click="handleLogOut">
              Logout
            </button>
          </div>
        </div>
      </div>
    </body>
  </main>
</template>

<script lang="ts" setup>
import VueJsonPretty from "vue-json-pretty";
import { useAuthStore } from "~/stores/auth";

const { $authData, $accessToken, $IDToken } = useNuxtApp();
const authStore = useAuthStore();

const authData: Ref<any> = ref(null);
const accessToken: Ref<any> = ref(null);
const idTtoken: Ref<any> = ref(null);

onMounted(async () => {
  authData.value = await $authData();
  accessToken.value = await $accessToken();
  idTtoken.value = await $IDToken();
});

const handleLogOut = () => {
  authStore.logout();
};
</script>
