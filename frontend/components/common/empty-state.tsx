import React from "react";
import { LucideIcon, Inbox, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30",
        className
      )}
    >
      <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-3">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-700 text-white hover:bg-blue-800 transition-colors shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function ErrorState({
  message = "Something went wrong while retrieving welfare records.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 my-4">
      <AlertTriangle className="h-8 w-8 text-rose-600 dark:text-rose-400 mb-2" />
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Unable to Load Data</h4>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
