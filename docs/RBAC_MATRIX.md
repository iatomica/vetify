# VetOS — Role-Based Access Control Matrix (`RBAC_MATRIX.md`)

## 1. Permission Architecture Principles

1. **Central Policy Enforcement:** UI components **never** hardcode business permission rules (e.g. `if (user.role === 'VETERINARIAN')`). Instead, both UI and API evaluate against granular action capabilities (e.g. `can(user, 'prescriptions:sign', resource)`).
2. **Server-Side Authorization Boundary:** All Next.js Server Actions, Route Handlers, and database queries evaluate the central policy engine before execution.
3. **Tenant Scoping:** A user's capabilities are strictly constrained within their assigned `organization_id` (and optionally `branch_id`).

---

## 2. Global RBAC Capability Matrix

| Capability / Resource | Super Admin | Org Admin | Branch Mgr | Vet | Specialist | Vet Assistant | Nurse | Receptionist | Lab Tech | Pharmacy Staff | Cashier | Pet Owner |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Tenancy & Branches** | | | | | | | | | | | | |
| `org:manage_settings` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `branch:create_update` | ✅ | ✅ | ✅ (own) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `staff:manage_users` | ✅ | ✅ | ✅ (own) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Patients & Tutors** | | | | | | | | | | | | |
| `tutor:create_update` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ (own) |
| `patient:create_update` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ (own) |
| `patient:view_profile` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ (own) |
| **Medical Records** | | | | | | | | | | | | |
| `clinical:view_timeline` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ⚠️ (labs) | ⚠️ (Rx) | ❌ | ✅ (filtered) |
| `consultation:create` | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `consultation:amend` | ❌ | ✅ (audit) | ❌ | ✅ (own) | ✅ (own) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `prescription:create_sign` | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `vaccination:record` | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ (vet sign) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Diagnostics** | | | | | | | | | | | | |
| `lab:order` | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `lab:enter_result` | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| `imaging:order` | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `imaging:upload_report` | ❌ | ❌ | ❌ | ✅ | ✅ (rad) | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Inpatient & Surgery** | | | | | | | | | | | | |
| `hospital:admit_discharge` | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `hospital:execute_task` | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `surgery:schedule` | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `surgery:operate_record` | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Appointments & Queue** | | | | | | | | | | | | |
| `appointment:book_cancel` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ✅ (own) |
| `queue:checkin_triage` | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `queue:call_to_box` | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Pharmacy & Inventory** | | | | | | | | | | | | |
| `inventory:manage_stock` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `pharmacy:dispense` | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| `pos:sell_retail` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ |
| **Billing & Audit** | | | | | | | | | | | | |
| `billing:issue_invoice` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `payments:record_refund` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| `audit:view_logs` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

*(Legend: ✅ Full Access | ❌ Forbidden | ⚠️ Scoped/Restricted Access)*

---

## 3. Programmatic Central Policy Engine

```typescript
// src/lib/auth/permissions.ts

export type Capability =
  | 'org:manage_settings'
  | 'branch:create_update'
  | 'staff:manage_users'
  | 'patient:create_update'
  | 'patient:view_profile'
  | 'clinical:view_timeline'
  | 'consultation:create'
  | 'prescription:create_sign'
  | 'pharmacy:dispense'
  | 'lab:order'
  | 'lab:enter_result'
  | 'hospital:execute_task'
  | 'queue:checkin_triage'
  | 'billing:issue_invoice';

export interface AuthSession {
  userId: string;
  organizationId: string;
  branchId?: string;
  role: UserRole;
}

export function can(session: AuthSession, capability: Capability, resource?: { organizationId?: string; ownerId?: string }): boolean {
  // 1. Multi-Tenant isolation invariant
  if (resource?.organizationId && resource.organizationId !== session.organizationId) {
    return false;
  }

  // 2. Pet Owner self-scoping
  if (session.role === 'PET_OWNER') {
    if (capability === 'patient:view_profile' || capability === 'clinical:view_timeline') {
      return resource?.ownerId === session.userId;
    }
    return capability === 'appointment:book_cancel';
  }

  // 3. Clinical capability checks
  switch (capability) {
    case 'consultation:create':
    case 'prescription:create_sign':
      return session.role === 'VETERINARIAN' || session.role === 'SPECIALIST';

    case 'pharmacy:dispense':
      return session.role === 'PHARMACY_STAFF' || session.role === 'VETERINARIAN';

    case 'lab:enter_result':
      return session.role === 'LAB_TECHNICIAN' || session.role === 'VETERINARIAN';

    case 'hospital:execute_task':
      return ['NURSE', 'VETERINARY_ASSISTANT', 'VETERINARIAN', 'SPECIALIST'].includes(session.role);

    case 'queue:checkin_triage':
      return ['RECEPTIONIST', 'VETERINARY_ASSISTANT', 'BRANCH_MANAGER', 'ORGANIZATION_ADMIN'].includes(session.role);

    case 'billing:issue_invoice':
      return ['CASHIER', 'RECEPTIONIST', 'BRANCH_MANAGER', 'ORGANIZATION_ADMIN'].includes(session.role);

    case 'org:manage_settings':
      return session.role === 'ORGANIZATION_ADMIN' || session.role === 'SUPER_ADMIN';

    default:
      return false;
  }
}
```
