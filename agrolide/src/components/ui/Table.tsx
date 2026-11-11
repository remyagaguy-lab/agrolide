import * as React from 'react'
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils/formatters'

/**
 * Tableau de données. Toujours fournir un <TableCaption> (visible ou `sr-only`) : c'est le nom accessible du tableau.
 * Le conteneur défile horizontalement sur mobile au lieu de casser la mise en page.
 */
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** `compact` : lignes de 40 px pour l'administration (desktop). */
  density?: 'comfortable' | 'compact'
  wrapperClassName?: string
}

export function Table({ density = 'comfortable', className, wrapperClassName, ...props }: TableProps) {
  return (
    <div
      data-density={density}
      className={cn('group w-full overflow-x-auto rounded-card border border-outline-variant bg-surface-container-lowest', wrapperClassName)}
    >
      <table className={cn('w-full border-collapse text-left text-body-md text-on-surface', className)} {...props} />
    </div>
  )
}

export function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn('p-4 text-left text-title-md text-on-surface', className)} {...props} />
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('bg-surface-container', className)} {...props} />
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&>tr:last-child]:border-b-0', className)} {...props} />
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('border-b border-outline-variant transition-colors hover:bg-surface-container-low', className)} {...props} />
}

export type SortDirection = 'ascending' | 'descending' | 'none'

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Active l'affichage du tri ; fournir `onSort` pour le rendre cliquable. */
  sort?: SortDirection
  onSort?: () => void
}

export function TableHead({ className, children, sort, onSort, ...props }: TableHeadProps) {
  const Icon = sort === 'ascending' ? ArrowUp : sort === 'descending' ? ArrowDown : ChevronsUpDown
  return (
    <th
      scope="col"
      aria-sort={sort}
      className={cn(
        'whitespace-nowrap px-4 text-label-md uppercase tracking-wide text-on-surface-variant',
        'h-12 group-data-[density=compact]:h-10',
        className,
      )}
      {...props}
    >
      {onSort ? (
        <button type="button" onClick={onSort} className="inline-flex items-center gap-1.5 rounded-tag uppercase tracking-wide">
          {children}
          <Icon className="size-4" aria-hidden="true" />
        </button>
      ) : (
        children
      )}
    </th>
  )
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-3 align-middle group-data-[density=compact]:py-2', className)} {...props} />
}
