import Link from 'next/link'
import { AlertesPush } from '@/components/modules/notifications/AlertesPush'
import { ArrowLeft } from '@/components/ui/icons'

export const metadata = { title: 'Réglages des notifications' }

export default function ReglagesNotificationsPage() {
  return (
    <div className="mx-auto max-w-[720px] space-y-4 px-2 py-6 md:px-4">
      <Link
        href="/membres/notifications"
        className="ag-state inline-flex min-h-11 items-center gap-2 rounded-control text-label-lg text-on-surface-variant"
      >
        <ArrowLeft className="size-5" aria-hidden />
        Notifications
      </Link>
      <h1 className="text-headline-sm font-heading text-on-surface">Réglages des notifications</h1>
      <AlertesPush />
    </div>
  )
}
