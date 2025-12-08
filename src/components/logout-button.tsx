'use client'

import { Button } from './ui/button'
import { logout } from '../actions/auth-action'

const LogoutButton = () => {

  const handleLogout = async () => {
    await logout();
  }

  return (
    <Button onClick={handleLogout}>Sair</Button>
  )
}

export default LogoutButton