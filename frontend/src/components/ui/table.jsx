// frontend/src/components/ui/table.jsx

import * as React from "react"

import { cn } from "@/lib/utils"

const Table = ({
  className,
  ...props
}) => (
  <div data-slot="table-container" className="w-full overflow-auto">
    <table
      data-slot="table"
      className={cn("w-full caption-bottom text-sm", className)}
      {...props} />
  </div>
)

const TableHeader = ({
  className,
  ...props
}) => (
  <thead
    data-slot="table-header"
    className={cn("[&_tr]:border-b", className)}
    {...props} />
)

const TableBody = ({
  className,
  ...props
}) => (
  <tbody
    data-slot="table-body"
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props} />
)

const TableFooter = ({
  className,
  ...props
}) => (
  <tfoot
    data-slot="table-footer"
    className={cn(
      "bg-primary font-medium text-primary-foreground",
      className
    )}
    {...props} />
)

const TableRow = ({
  className,
  ...props
}) => (
  <tr
    data-slot="table-row"
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props} />
)

const TableHead = ({
  className,
  ...props
}) => (
  <th
    data-slot="table-head"
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props} />
)

const TableCell = ({
  className,
  ...props
}) => (
  <td
    data-slot="table-cell"
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props} />
)

const TableCaption = ({
  className,
  ...props
}) => (
  <caption
    data-slot="table-caption"
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props} />
)

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}