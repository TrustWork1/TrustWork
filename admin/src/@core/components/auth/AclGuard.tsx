import { ReactNode, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { ACLObj, AppAbility } from 'src/configs/acl'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { buildAbilityFor } from 'src/configs/acl'
import NotAuthorized from 'src/pages/401'
import Spinner from 'src/@core/components/spinner'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useAuth } from 'src/hooks/useAuth'
import getHomeRoute from 'src/layouts/components/acl/getHomeRoute'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props

  // ** Hooks
  const auth = useAuth()
  const router = useRouter()

  // ** State
  const [ability, setAbility] = useState<AppAbility>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (auth.user && auth.user.groups && !guestGuard && router.route === '/') {
      const homeRoute = getHomeRoute(auth.user.groups.name)
      router.replace(homeRoute)
    }
    setIsLoading(false)
  }, [auth.user, guestGuard, router])

  useEffect(() => {
    if (auth.user && !ability) {
      // Extract permissions in the format 'subject:action'
      // const userPermissions = auth.user.role?.permissions?.map((p: any) => {return p.permissionKey}) || []
      const userPermissions =
        auth.user?.groups?.permissions?.map((p: any) => {
          return p.permissionKey
        }) || []

      const userRole = auth.user.groups?.name || 'admin' // Default to 'user' if role is undefined

      const newAbility = buildAbilityFor(userRole, userPermissions)
      setAbility(newAbility)
    }
  }, [auth.user, ability])

  // Show loading spinner while authentication is being checked
  if (isLoading) {
    return <Spinner />
  }

  // If guest guard or no guard is true or any error page
  if (guestGuard || router.route === '/404' || router.route === '/500' || !authGuard) {
    // If user is logged in and their ability is built
    if (auth.user && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      // If user is not logged in (render pages like login, register, etc.)
      return <>{children}</>
    }
  }

  // Check the access of current user and render pages
  if (ability && auth.user) {
    const actions = Array.isArray(aclAbilities.action) ? aclAbilities.action : [aclAbilities.action]
    const subjects = Array.isArray(aclAbilities.subject) ? aclAbilities.subject : [aclAbilities.subject]

    // Check if the user has permission for at least one action on one subject
    const hasPermission = actions.some(action => subjects.some(subject => ability.can(action, subject)))

    if (hasPermission) {
      if (router.route === '/') {
        return <Spinner />
      }

      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    }
  }

  // If the user is logged in but we're still waiting for ability, show loading
  if (auth.user && !ability) {
    return <Spinner />
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      <NotAuthorized />
    </BlankLayout>
  )
}

export default AclGuard
