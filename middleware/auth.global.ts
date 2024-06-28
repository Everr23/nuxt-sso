import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  // Si no hay info de la sesion en Pinia se consumen los helpers expuestos en el plugin de auth
  // Para que funcione el llamado de estas funciones helpers se debe validar que sean invocadas unicamente del lado del cliente
  if (process.client && !authStore.authData?.isAuthenticated) {
    const { $authData, $isAuthenticated } = useNuxtApp();

    const isAuthenticated = await $isAuthenticated();
    if (!isAuthenticated) {
      return;
    }

    const authResponse = await $authData();
    console.log(authResponse);

    // Informacion sobre el usuario que acaba de iniciar sesion
    const userInfo: IUserInfo = {
      email: authResponse?.email as string,
      fullName: authResponse?.name as string, //authResponse?.displayName as string,
      name: authResponse?.givenName,
      lastName: authResponse?.familyName,
      photoUrl: authResponse?.profile,
      role: "Admin",
    };

    // Informacion de sesion del usuario
    const authData: IAuthData = {
      isAuthenticated: isAuthenticated as boolean,
      jti: authResponse?.jti as string,
      sub: authResponse?.sub as string,
    };

    // Cargar auth info en el state de Pinia
    authStore.update(userInfo, authData);
  }
});
