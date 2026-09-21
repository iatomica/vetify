// VetOS Central RBAC & ABAC Policy Engine
// Do not hardcode permission checks inside UI components.

import type { UserRole, UserSession } from '../../domain/types';

export type ActionCapability =
  | 'org:manage_settings'
  | 'branch:create_update'
  | 'staff:manage_users'
  | 'tutor:create_update'
  | 'patient:create_update'
  | 'patient:view_profile'
  | 'clinical:view_timeline'
  | 'clinical:append_note'
  | 'consultation:create'
  | 'consultation:amend'
  | 'prescription:create_sign'
  | 'pharmacy:dispense'
  | 'vaccination:record'
  | 'lab:order'
  | 'lab:enter_result'
  | 'imaging:order'
  | 'imaging:upload_report'
  | 'hospital:admit_discharge'
  | 'hospital:execute_task'
  | 'surgery:schedule'
  | 'surgery:operate_record'
  | 'appointment:book_cancel'
  | 'queue:checkin_triage'
  | 'queue:call_to_box'
  | 'inventory:manage_stock'
  | 'billing:issue_invoice'
  | 'payments:record_refund'
  | 'audit:view_logs';

export interface PolicyResourceContext {
  organizationId?: string;
  ownerId?: string;
  patientId?: string;
  veterinarianId?: string;
}

export const PolicyEngine = {
  /**
   * Evaluates if a given user session can perform an action capability on a target resource.
   */
  can(session: UserSession | null, capability: ActionCapability, resource?: PolicyResourceContext): boolean {
    if (!session) return false;

    // 1. Super Admin bypass (system maintainer)
    if (session.role === 'SUPER_ADMIN') return true;

    // 2. Strict multi-tenant isolation invariant
    if (resource?.organizationId && resource.organizationId !== session.organizationId) {
      return false;
    }

    // 3. Pet Owner permissions (self-scoped only)
    if (session.role === 'PET_OWNER') {
      if (capability === 'patient:view_profile' || capability === 'clinical:view_timeline') {
        return !resource?.ownerId || resource.ownerId === session.userId;
      }
      if (capability === 'appointment:book_cancel') {
        return true;
      }
      return false;
    }

    // 4. Role capability evaluation
    switch (capability) {
      case 'org:manage_settings':
        return session.role === 'ORGANIZATION_ADMIN';

      case 'branch:create_update':
      case 'staff:manage_users':
        return ['ORGANIZATION_ADMIN', 'BRANCH_MANAGER'].includes(session.role);

      case 'tutor:create_update':
      case 'patient:create_update':
      case 'patient:view_profile':
        return [
          'ORGANIZATION_ADMIN',
          'BRANCH_MANAGER',
          'VETERINARIAN',
          'SPECIALIST',
          'VETERINARY_ASSISTANT',
          'NURSE',
          'RECEPTIONIST',
          'CASHIER'
        ].includes(session.role);

      case 'clinical:view_timeline':
        return [
          'ORGANIZATION_ADMIN',
          'BRANCH_MANAGER',
          'VETERINARIAN',
          'SPECIALIST',
          'VETERINARY_ASSISTANT',
          'NURSE',
          'RECEPTIONIST'
        ].includes(session.role);

      case 'clinical:append_note':
        return ['VETERINARIAN', 'SPECIALIST', 'VETERINARY_ASSISTANT', 'NURSE'].includes(session.role);

      case 'consultation:create':
      case 'prescription:create_sign':
      case 'lab:order':
      case 'imaging:order':
      case 'surgery:operate_record':
        // Only licensed veterinarians & specialists may prescribe, diagnose or operate
        return ['VETERINARIAN', 'SPECIALIST'].includes(session.role);

      case 'consultation:amend':
        return (
          session.role === 'ORGANIZATION_ADMIN' ||
          (['VETERINARIAN', 'SPECIALIST'].includes(session.role) && resource?.veterinarianId === session.userId)
        );

      case 'vaccination:record':
        return ['ORGANIZATION_ADMIN', 'VETERINARIAN', 'SPECIALIST', 'VETERINARY_ASSISTANT'].includes(session.role);

      case 'lab:enter_result':
        return ['LAB_TECHNICIAN', 'VETERINARIAN', 'SPECIALIST'].includes(session.role);

      case 'imaging:upload_report':
        return ['SPECIALIST', 'VETERINARIAN', 'ORGANIZATION_ADMIN'].includes(session.role);

      case 'hospital:admit_discharge':
        return ['ORGANIZATION_ADMIN', 'BRANCH_MANAGER', 'VETERINARIAN', 'SPECIALIST'].includes(session.role);

      case 'hospital:execute_task':
        return ['NURSE', 'VETERINARY_ASSISTANT', 'VETERINARIAN', 'SPECIALIST'].includes(session.role);

      case 'queue:checkin_triage':
        return [
          'RECEPTIONIST',
          'VETERINARY_ASSISTANT',
          'NURSE',
          'BRANCH_MANAGER',
          'ORGANIZATION_ADMIN'
        ].includes(session.role);

      case 'queue:call_to_box':
        return ['VETERINARIAN', 'SPECIALIST'].includes(session.role);

      case 'appointment:book_cancel':
        return [
          'RECEPTIONIST',
          'VETERINARY_ASSISTANT',
          'BRANCH_MANAGER',
          'ORGANIZATION_ADMIN',
          'VETERINARIAN',
          'CASHIER'
        ].includes(session.role);

      case 'inventory:manage_stock':
        return ['ORGANIZATION_ADMIN', 'BRANCH_MANAGER', 'PHARMACY_STAFF'].includes(session.role);

      case 'pharmacy:dispense':
        return ['PHARMACY_STAFF', 'VETERINARIAN', 'ORGANIZATION_ADMIN'].includes(session.role);

      case 'billing:issue_invoice':
      case 'payments:record_refund':
        return ['CASHIER', 'RECEPTIONIST', 'BRANCH_MANAGER', 'ORGANIZATION_ADMIN'].includes(session.role);

      case 'audit:view_logs':
        return ['ORGANIZATION_ADMIN', 'SUPER_ADMIN'].includes(session.role);

      default:
        return false;
    }
  },

  /**
   * Helper to format readable role badge
   */
  getRoleBadge(role: UserRole): { label: string; color: string } {
    switch (role) {
      case 'SUPER_ADMIN':
        return { label: 'Super Admin', color: 'bg-rose-100 text-rose-800' };
      case 'ORGANIZATION_ADMIN':
        return { label: 'Dirección Médica / Admin', color: 'bg-forest/10 text-forest' };
      case 'BRANCH_MANAGER':
        return { label: 'Gerente Sucursal', color: 'bg-emerald-100 text-emerald-800' };
      case 'VETERINARIAN':
        return { label: 'Médico Veterinario', color: 'bg-teal-100 text-teal-800' };
      case 'SPECIALIST':
        return { label: 'Especialista', color: 'bg-purple-100 text-purple-800' };
      case 'VETERINARY_ASSISTANT':
        return { label: 'Asistente Veterinario', color: 'bg-cyan-100 text-cyan-800' };
      case 'NURSE':
        return { label: 'Enfermería Hospitalaria', color: 'bg-sky-100 text-sky-800' };
      case 'RECEPTIONIST':
        return { label: 'Recepción & Triaje', color: 'bg-blue-100 text-blue-800' };
      case 'LAB_TECHNICIAN':
        return { label: 'Bioquímico / Lab', color: 'bg-amber-100 text-amber-800' };
      case 'PHARMACY_STAFF':
        return { label: 'Farmacia & Insumos', color: 'bg-emerald-100 text-emerald-800' };
      case 'CASHIER':
        return { label: 'Caja & Facturación', color: 'bg-slate-100 text-slate-800' };
      case 'PET_OWNER':
        return { label: 'Tutor de Mascota', color: 'bg-amber-100 text-amber-900' };
      default:
        return { label: 'Usuario', color: 'bg-slate-100 text-slate-700' };
    }
  }
};
