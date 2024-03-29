import { useCallback } from "react";
import { signInWithPopup, UserCredential, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, OAuthProvider } from 'firebase/auth';
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

import { LoadingContextProvider, AuthContextProvider } from "../context";
import { auth } from "../firebase";
import { fetchApi, queries } from "./Fetching";
import { useToast } from "../hooks/useToast";

export const useAuthentication = () => {
  const { setLoading } = LoadingContextProvider();

  const { setUser, setUserTemp, redirect, setRedirect } = AuthContextProvider();

  const toast = useToast();
  const router = useRouter();

  const getSessionCookie = useCallback(async (tokenID) => {
    if (tokenID) {
      const authResult = await fetchApi({
        query: queries.auth,
        variables: { idToken: tokenID },
      });
      if (authResult?.sessionCookie) {
        const { sessionCookie } = authResult;
        // Setear en localStorage token JWT
        Cookies.set("sessionCivitas", sessionCookie, { domain: process.env.NEXT_PUBLIC_DOMINIO ?? "" });
        return sessionCookie
      } else {
        console.warn("No se pudo cargar la cookie de sesión por que hubo un problema")
        throw new Error("No se pudo cargar la cookie de sesión por que hubo un problema")
      }
    } else {
      console.warn("No hay tokenID para pedir la cookie de sesion")
      throw new Error("No hay tokenID para pedir la cookie de sesion")
    }

  }, [])

  const signIn = useCallback(
    async (type, payload) => {
      /*
          ### Login por primera vez
          1.- Verificar tipo de login y tomar del diccionario el metodo
          2.- Obtener el tokenID del usuario
          3.- Enviar tokenID a API para recibir la sessionCookie
          4.- Almacenar en una cookie el token de la sessionCookie
          5.- Mutar el contexto User de React con los datos de Firebase + MoreInfo (API BODAS)
      */
      setLoading(true);

      const types = {
        provider: async () => {
          try {
            const asdf = await signInWithPopup(auth, payload)

            return asdf
          } catch (error) {
            setLoading(false);
            const er = error.toString().split(".")[0].split(": Error ")[1]
            if (er == "(auth/account-exists-with-different-credential)") {
              toast("error", "El correo asociado a su provedor ya se encuentra registrado en bodasdehoy.com");
            }
          }
        },
        credentials: async () => await signInWithEmailAndPassword(auth, payload.identifier, payload.password)
      };

      // Autenticar con firebase
      try {
        const res = await types[type]();
        if (res) {
          // Solicitar datos adicionales del usuario
          const moreInfo = await fetchApi({
            query: queries.getUser,
            variables: { uid: res.user.uid },
          });
          if (moreInfo?.status && res?.user?.email) {
            const token = (await res?.user?.getIdTokenResult())?.token;
            const sessionCookie = await getSessionCookie(token)
            if (sessionCookie) { }
            // Actualizar estado con los dos datos
            setUser({ ...res.user, ...moreInfo });

            /////// REDIRECIONES ///////
            await router.push(!redirect ? "/" : redirect)
            ///////////////////////////
          } else {
            console.log(60056, "error", "aun no está registrado")
            toast("error", "aun no está registrado");
            //verificar que firebase me devuelva un correo del usuario
            if (res?.user?.email) {
              //seteo usuario temporal pasar nombre y apellido de firebase a formulario de registro
              setUserTemp({ ...res.user });
              toast("success", "Seleccione quien eres y luego completa el formulario");
            } else {
              toast("error", "usted debe tener asociado un correo a su cuenta de proveedor");
            }
          }
        }
      } catch (error) {
        toast("error", "correo o contraseña inválida");
      }
      setLoading(false);
    },
    [redirect, getSessionCookie, router, setLoading, setUser, setUserTemp, toast]
  );

  const _signOut = useCallback(async () => {
    await fetchApi({ query: queries.signOut, variables: { sessionCookie: Cookies.get("sessionCivitas") } })
    Cookies.remove("sessionCivitas", { domain: process.env.NEXT_PUBLIC_DOMINIO ?? "" });
    Cookies.remove("idToken", { domain: process.env.NEXT_PUBLIC_DOMINIO ?? "" });
    setUser(null);
    await signOut(auth);
    await router.push("/");
    toast("success", "Gracias por visitarnos, te esperamos luego 😀");
  }, [router, setUser, toast])


  const resetPassword = async (values, setStage) => {// funcion para conectar con con firebase para enviar el correo 
    if (values?.identifier !== "") {
      try {
        await sendPasswordResetEmail(auth, values?.identifier);
        setStage("login")
        toast("success", "Email enviado correctamente")
      } catch (error) {
        toast("error", "Error, email no encontrado")
        console.log(1201, error);
      }
    } else {
      toast("error", "introduce un correo")
    }
  };

  return { signIn, getSessionCookie, _signOut, resetPassword };
};
