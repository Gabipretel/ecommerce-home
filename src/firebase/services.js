import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { FirebaseAuth } from './config'

// Configuración de Google Auth
const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({
  prompt: 'select_account'
})

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(FirebaseAuth, googleProvider)
    const { displayName, email, photoURL, uid } = result.user

    // Extraer nombre y apellido del displayName
    const nameParts = displayName ? displayName.split(' ') : ['Usuario', 'Google']
    const nombre = nameParts[0] || 'Usuario'
    const apellido = nameParts.slice(1).join(' ') || 'Google'

    return {
      success: true,
      user: {
        uid,
        email,
        nombre,
        apellido,
        photoURL,
        displayName,
        provider: 'google'
      }
    }
  } catch (error) {
    console.error('Error en login con Google:', error)
    return {
      success: false,
      message: error.message || 'Error al iniciar sesión con Google'
    }
  }
}

export const logoutFirebase = async () => {
  try {
    await signOut(FirebaseAuth)
    return { success: true }
  } catch (error) {
    console.error('Error en logout de Firebase:', error)
    return { 
      success: false, 
      message: error.message || 'Error al cerrar sesión' 
    }
  }
}