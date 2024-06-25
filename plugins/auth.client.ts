// # Documentacion
// Qué es SSO: https://is.docs.wso2.com/en/6.1.0/references/concepts/single-sign-on/
// Qué es OpenID Connect (OIDC): https://is.docs.wso2.com/en/6.1.0/references/concepts/authentication/intro-oidc/
// Libreria @asgardeo/auth-spa: https://www.npmjs.com/package/@asgardeo/auth-spa
// Nuxt Plugins: https://nuxt.com/docs/guide/directory-structure/plugins

// # Modo
// Para este plugin de integración de la libreria de WSO2 asgardeo/auth-spa funcione
// este debe ejecutarse unicamente en el lado del cliente
// para ello el archivo se nombra con la extensión .client.ts

// 45.162.204.17   "http://45.162.204.17:8080",    "http://10.10.0.10:8080"
import { defineNuxtPlugin } from "#app";
import { AsgardeoSPAClient, Hooks } from "@asgardeo/auth-spa";

export default defineNuxtPlugin((nuxtApp) => {
  // El cliente de SSO es una clase y primero debe instanciarse
  const auth = AsgardeoSPAClient.getInstance();

  // Una vez instanciado, el cliente se inicializa pasando los parámetros relevantes
  auth?.initialize({
    signInRedirectURL: "http://localhost:8080/",
    signOutRedirectURL: "http://localhost:8080/",
    clientID: "YKDvoMxnsKfiVPBp4bMw_hMXQGQa",
    baseUrl: "https://localhost:9443",
    scope: ["openid", "profile", "email"],
  });

  // Se inicia el flujo de inicio de sesión con este método
  auth?.signIn();

  // El hook `sign-in` se utiliza para activar una función callback después de que el inicio de sesión sea exitoso
  auth?.on(Hooks.SignIn, (response) => {
    console.log("You have successfully signed in!", response);
  });

  // Plugin Injections: se expone la información de la sesión proporcionando helpers en la instancia NuxtApp
  /* Ejemplo de consumo: 
    const { $isAuthenticated, $authData } = useNuxtApp();
  */
  return {
    provide: {
      signOut: async () => {
        auth?.signOut();
      },
      isAuthenticated: async () => {
        return await auth?.isAuthenticated();
      },
      authData: async () => {
        return await auth?.getBasicUserInfo();
      },
      decodedIDToken: async () => {
        return await auth?.getDecodedIDToken();
      },
      accessToken: async () => {
        return await auth?.getAccessToken();
      },
      OIDCServiceEndpoints: async () => {
        return await auth?.getOIDCServiceEndpoints();
      },
    },
  };
});
