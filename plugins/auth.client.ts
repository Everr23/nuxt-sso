// # Documentacion
// Qué es SSO: https://is.docs.wso2.com/en/6.1.0/references/concepts/single-sign-on/
// Qué es OpenID Connect (OIDC): https://is.docs.wso2.com/en/6.1.0/references/concepts/authentication/intro-oidc/
// Libreria @asgardeo/auth-spa: https://www.npmjs.com/package/@asgardeo/auth-spa
// Nuxt Plugins: https://nuxt.com/docs/guide/directory-structure/plugins

// # Modo
// Para este plugin de integración de la libreria de WSO2 asgardeo/auth-spa funcione
// este debe ejecutarse unicamente en el lado del cliente
// para ello el archivo se nombra con la extensión .client.ts

import { defineNuxtPlugin } from "#app";
import {
  AsgardeoSPAClient,
  type AuthSPAClientConfig,
  Hooks,
} from "@asgardeo/auth-spa";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin((nuxtApp) => {
  // El cliente de SSO es una clase y primero debe instanciarse
  const auth = AsgardeoSPAClient.getInstance();

  // Configuracion del cliente
  const config_LOCAL: AuthSPAClientConfig = {
    signInRedirectURL: "http://localhost:8080/",
    signOutRedirectURL: "http://localhost:8080/",
    // clientID: "YKDvoMxnsKfiVPBp4bMw_hMXQGQa",
    clientID: "PD3EdgtCssQLs0FQIcB3zMcF8ooa",
    clientSecret: "jePgYuSlOzYQyWcf_Hbv8YQbhGIa",
    baseUrl: "https://localhost:9443",
    scope: ["openid", "profile", "email"],
    // validateIDToken: false,
  };

  // Configuracion del cliente
  const config_SERVERUNA: AuthSPAClientConfig = {
    signInRedirectURL: "https://chic-beignet-049884.netlify.app/auth/sso/login",
    signOutRedirectURL:
      "https://chic-beignet-049884.netlify.app/auth/sso/login",
    clientID: "O35AClmEikHEWejYDlB65_Hss7wa",
    baseUrl: "https://ssodesa.una.ac.cr",
    scope: ["openid", "profile", "email"],
    validateIDToken: false,
  };

  // Una vez instanciado, el cliente se inicializa pasando la configuracion como parametro
  auth?.initialize(config_SERVERUNA);

  // Se inicia el flujo de inicio de sesión con este método
  auth?.signIn();

  // El hook `sign-in` se utiliza para activar una función callback después de que el inicio de sesión sea exitoso
  auth?.on(Hooks.SignIn, (response) => {
    const authStore = useAuthStore();

    // Informacion sobre el usuario que acaba de iniciar sesion
    const userInfo: IUserInfo = {
      email: response.email,
      fullName: response.displayName,
      name: response.givenName,
      lastName: response.familyName,
      photoUrl: response.profile,
      role: "Admin",
    };

    // Informacion de sesion del usuario
    const authData: IAuthData = {
      isAuthenticated: true,
      jti: response.jti,
      sub: response.sub,
    };

    // Cargar informacion de la sesion en el store de Pinia
    authStore.update(userInfo, authData);
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
      IDToken: async () => {
        return await auth?.getIDToken();
      },
      OIDCServiceEndpoints: async () => {
        return await auth?.getOIDCServiceEndpoints();
      },
    },
  };
});
