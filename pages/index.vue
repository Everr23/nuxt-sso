<template>
  <main>
    <body>
      <div id="root">
        <div class="container">
          <div class="header-title">
            <h1>Nuxt SSO Implementation (PORT 8080)</h1>
          </div>
          <div class="content">
            <h2>Authentication Response</h2>
            <br />
            <br />
            <h3>
              Is Authenticathed: <strong>{{ isAuth }}</strong>
            </h3>
            <br />
            <br />
            <div class="json">
              <div id="authentication-response" class="json-container-view">
                <VueJsonPretty :data="authResponse" />
              </div>
            </div>

            <h2 class="mb-0 mt-4">ID token</h2>
            <br />
            <div class="row">
              <div class="column">
                <h5><b>Encoded</b></h5>
                <br />
                <div class="json-container-view">
                  <div class="code" v-if="authToken">
                    <code>
                      <span class="id-token-0" id="id-token-0">{{
                        authToken.split(".")[0]
                      }}</span
                      >.<span class="id-token-1" id="id-token-1">{{
                        authToken.split(".")[1]
                      }}</span
                      >.<span class="id-token-2" id="id-token-2">{{
                        authToken.split(".")[2]
                      }}</span>
                    </code>
                  </div>
                  <div v-else>
                    <VueJsonPretty :data="null" />
                  </div>
                </div>
              </div>
              <div class="column">
                <div class="json">
                  <h5><b>Decoded:</b> Payload</h5>
                  <br />
                  <div class="json-container-view">
                    <VueJsonPretty :data="authDecodedToken" />
                  </div>
                </div>

                <div class="json">
                  <br />
                  <h5><b>OIDC:</b> Service Endpoints</h5>
                  <br />
                  <div class="json-container-view">
                    <VueJsonPretty :data="oIDCServiceEndpoints" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="btn primary mt-4" @click="handleLogOut">Logout</button>
        </div>
      </div>
    </body>
  </main>
</template>

<script lang="ts" setup>
import VueJsonPretty from "vue-json-pretty";

const {
  $isAuthenticated,
  $authData,
  $decodedIDToken,
  $accessToken,
  $OIDCServiceEndpoints,
  $signOut,
} = useNuxtApp();

const isAuth: Ref<any> = ref(null);
const authResponse: Ref<any> = ref(null);
const authToken: Ref<any> = ref(null);
const authDecodedToken: Ref<any> = ref(null);
const oIDCServiceEndpoints: Ref<any> = ref(null);

const getAuthContext = async () => {
  isAuth.value = await $isAuthenticated();
  authResponse.value = await $authData();
  authDecodedToken.value = await $decodedIDToken();
  authToken.value = await $accessToken();
  oIDCServiceEndpoints.value = await $OIDCServiceEndpoints();
};

const handleLogOut = () => {
  $signOut();
};

getAuthContext();
</script>
