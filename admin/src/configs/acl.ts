// src/configs/acl.ts

import { AbilityBuilder, Ability } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any

export type ACLObj = {
  action: Actions | Actions[]
  subject: string | string[]
}

/**
 * This function defines rules based on the role and permissions.
 * Permissions should be an array of strings in the format `subject:action`.
 */
const defineRulesFor = (role: string, permissions: string[]) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  if (role === 'admin') {
    can('manage', 'all')
  } else {
    permissions.forEach(permission => {
      const [subject, action] = permission.split(':')
      if (subject && action) {
        can(action as Actions, subject as Subjects)
      } else {
        console.warn(`Invalid permission format: ${permission}`)
      }
    })
  }

  return rules
}

export const buildAbilityFor = (role: string, permissions: string[]): AppAbility => {
  return new AppAbility(defineRulesFor(role, permissions), {
    detectSubjectType: (object: any) => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: ['manage', 'create', 'read', 'update', 'delete'],
  subject: [
    'all',
    'dashboard',
    'roles_permissions',
    'roles',
    'permissions',
    'users',
    'manager',
    'client',
    'staff',
    'bookings',
    'invoice',
    'timesheet',
    'branch',
    'services',
    'shiftingtime',
    'cms'
  ]
}

export default defineRulesFor
