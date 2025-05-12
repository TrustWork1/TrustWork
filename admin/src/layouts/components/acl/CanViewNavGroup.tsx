/* eslint-disable newline-before-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { ReactNode, useContext } from 'react'

// ** Component Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Types
import { NavGroup, NavLink } from 'src/@core/layouts/types'

interface Props {
  navGroup?: NavGroup
  children: ReactNode
}

const CanViewNavGroup = (props: Props) => {
  // ** Props
  const { children, navGroup } = props

  // ** Hook
  const ability = useContext(AbilityContext)

  const checkForVisibleChild = (arr: NavLink[] | NavGroup[]): boolean => {
    return arr.some((item: NavLink | NavGroup) => {
      if ('children' in item && item.children) {
        return checkForVisibleChild(item.children)
      } else {
        const actions = Array.isArray(item.action) ? item.action : [item.action]
        const subjects = Array.isArray(item.subject) ? item.subject : [item.subject]
        return actions.some(action => subjects.some(subject => ability?.can(action, subject)))
      }
    })
  }

  const canViewMenuGroup = (item: NavGroup) => {
    const hasAnyVisibleChild = item.children && checkForVisibleChild(item.children)

    if (!(item.action && item.subject)) {
      return hasAnyVisibleChild
    }

    const actions = Array.isArray(item.action) ? item.action : [item.action]
    const subjects = Array.isArray(item.subject) ? item.subject : [item.subject]

    const hasPermission = actions.some(action => subjects.some(subject => ability?.can(action, subject)))

    return hasPermission && hasAnyVisibleChild
  }

  if (navGroup && navGroup.auth === false) {
    return <>{children}</>
  } else {
    return navGroup && canViewMenuGroup(navGroup) ? <>{children}</> : null
  }
}

export default CanViewNavGroup
