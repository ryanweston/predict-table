import { signIn } from 'next-auth/react'

export default () => (
  <button onClick={() => signIn('google')}>Sign in with Google</button>
)
