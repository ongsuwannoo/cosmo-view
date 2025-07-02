import { type ComponentProps, createContext, forwardRef, useContext, useState } from 'react';
import { cn } from '@/lib/utils';

// Tabs Context
const TabsContext = createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

// Tabs Root
interface TabsProps extends ComponentProps<'div'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ value, defaultValue, onValueChange, className, ...props }, ref) => {
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const currentValue = value ?? internalValue;

    const handleValueChange = (newValue: string) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    return (
      <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn('w-full', className)} {...props} />
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = 'Tabs';

// Tabs List
interface TabsListProps extends ComponentProps<'div'> {}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
          className
        )}
        {...props}
      />
    );
  }
);

TabsList.displayName = 'TabsList';

// Tabs Trigger
interface TabsTriggerProps extends ComponentProps<'button'> {
  value: string;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, className, ...props }, ref) => {
    const context = useContext(TabsContext);

    if (!context) {
      throw new Error('TabsTrigger must be used within Tabs');
    }

    const isSelected = context.value === value;

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isSelected ? 'bg-background text-foreground shadow-sm' : 'hover:bg-muted/50',
          className
        )}
        onClick={() => context.onValueChange(value)}
        {...props}
      />
    );
  }
);

TabsTrigger.displayName = 'TabsTrigger';

// Tabs Content
interface TabsContentProps extends ComponentProps<'div'> {
  value: string;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value, className, ...props }, ref) => {
    const context = useContext(TabsContext);

    if (!context) {
      throw new Error('TabsContent must be used within Tabs');
    }

    if (context.value !== value) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(
          'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className
        )}
        {...props}
      />
    );
  }
);

TabsContent.displayName = 'TabsContent';
