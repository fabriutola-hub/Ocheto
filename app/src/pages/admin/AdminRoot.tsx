import { Outlet } from 'react-router';
import AdminLayout from '@/features/admin/AdminLayout';

export default function AdminRoot() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
