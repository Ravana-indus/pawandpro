import React from "react"
import { EntityHeader } from "@/components/admin/EntityHeader"

type PermissionLevel = "Full" | "Read" | "Edit" | "-"

interface RolePermissions {
  role: string
  users: PermissionLevel
  products: PermissionLevel
  listings: PermissionLevel
  orders: PermissionLevel
  vets: PermissionLevel
  community: PermissionLevel
  settings: PermissionLevel
}

const permissionMatrix: RolePermissions[] = [
  { role: "SUPER_ADMIN", users: "Full", products: "Full", listings: "Full", orders: "Full", vets: "Full", community: "Full", settings: "Full" },
  { role: "ADMIN", users: "Full", products: "Full", listings: "Full", orders: "Full", vets: "Full", community: "Full", settings: "Read" },
  { role: "MARKETPLACE_STAFF", users: "-", products: "Edit", listings: "Edit", orders: "Edit", vets: "-", community: "-", settings: "-" },
]

const columns: { key: keyof RolePermissions; label: string }[] = [
  { key: "role", label: "Role" },
  { key: "users", label: "Users" },
  { key: "products", label: "Products" },
  { key: "listings", label: "Listings" },
  { key: "orders", label: "Orders" },
  { key: "vets", label: "Vets" },
  { key: "community", label: "Community" },
  { key: "settings", label: "Settings" },
]

function PermissionCell({ value }: { value: PermissionLevel }) {
  if (value === "Full") {
    return <span className="material-symbols-outlined text-primary">check_circle</span>
  }
  if (value === "Read" || value === "Edit") {
    return <span className="text-on-surface-variant text-sm">{value}</span>
  }
  return <span className="material-symbols-outlined text-outline">remove</span>
}

export default function PermissionsPage() {
  return (
    <div className="space-y-6">
      <EntityHeader
        title="Role Permissions"
        subtitle="Permission matrix for all roles"
        backHref="/admin/settings"
        backLabel="All Settings"
      />

      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/20 overflow-hidden">
        <div className="p-6 border-b border-outline-variant/20">
          <h2 className="text-lg font-bold text-on-surface">Permission Overview</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Read-only view of role-based access control
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant/20">
                {columns.map((col) => (
                  <th key={col.key} className="text-left p-4 text-sm font-semibold text-on-surface-variant">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissionMatrix.map((row, idx) => (
                <tr key={row.role} className={idx !== permissionMatrix.length - 1 ? "border-b border-outline-variant/20" : ""}>
                  {columns.map((col) => (
                    <td key={col.key} className="p-4 text-sm">
                      {col.key === "role" ? (
                        <span className="font-medium text-on-surface">{row[col.key]}</span>
                      ) : (
                        <div className="flex justify-center">
                          <PermissionCell value={row[col.key]} />
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}