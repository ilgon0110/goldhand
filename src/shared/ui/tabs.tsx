'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & { variant?: 'default' | 'line' }
>(({ className, variant = 'default', ...props }, ref) => (
  <TabsPrimitive.List
    className={cn(
      'group',
      variant === 'default' &&
        'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
      variant === 'line' &&
        'flex overflow-x-auto border-b border-stone-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
      className,
    )}
    data-variant={variant}
    ref={ref}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    className={cn(
      // 공통
      'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium',
      'ring-offset-background transition-all',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',

      // default variant
      'rounded-sm px-3 py-1.5',
      'data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',

      // line variant (group context로 자동 적용)
      'group-data-[variant=line]:rounded-none',
      'group-data-[variant=line]:-mb-px group-data-[variant=line]:px-[22px] group-data-[variant=line]:pb-[14px] group-data-[variant=line]:pt-4',
      'group-data-[variant=line]:border-b-2 group-data-[variant=line]:border-b-transparent',
      'group-data-[variant=line]:bg-transparent group-data-[variant=line]:text-stone-500',
      'group-data-[variant=line]:hover:text-stone-900',
      'group-data-[variant=line]:data-[state=active]:border-b-gold',
      'group-data-[variant=line]:data-[state=active]:bg-transparent',
      'group-data-[variant=line]:data-[state=active]:font-semibold',
      'group-data-[variant=line]:data-[state=active]:text-stone-900',
      'group-data-[variant=line]:data-[state=active]:shadow-none',

      className,
    )}
    ref={ref}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    ref={ref}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
