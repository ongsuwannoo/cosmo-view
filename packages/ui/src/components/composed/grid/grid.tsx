import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  children: ReactNode;
  className?: string;
  cols?: 1 | 2 | 3 | 4 | 6 | 12 | { default?: number; md?: number; lg?: number };
  gap?: 1 | 2 | 3 | 4 | 5 | 6 | 8;
}

export function Grid({ children, className = '', cols = 3, gap = 4 }: GridProps) {
  let gridClasses = 'grid';

  // Handle responsive cols
  if (typeof cols === 'object') {
    const { default: defaultCols = 1, md, lg } = cols;

    // Default columns
    if (defaultCols === 1) gridClasses += ' grid-cols-1';
    else if (defaultCols === 2) gridClasses += ' grid-cols-2';
    else if (defaultCols === 3) gridClasses += ' grid-cols-3';
    else if (defaultCols === 4) gridClasses += ' grid-cols-4';
    else if (defaultCols === 6) gridClasses += ' grid-cols-6';
    else if (defaultCols === 12) gridClasses += ' grid-cols-12';

    // Medium screen columns
    if (md === 1) gridClasses += ' md:grid-cols-1';
    else if (md === 2) gridClasses += ' md:grid-cols-2';
    else if (md === 3) gridClasses += ' md:grid-cols-3';
    else if (md === 4) gridClasses += ' md:grid-cols-4';
    else if (md === 6) gridClasses += ' md:grid-cols-6';
    else if (md === 12) gridClasses += ' md:grid-cols-12';

    // Large screen columns
    if (lg === 1) gridClasses += ' lg:grid-cols-1';
    else if (lg === 2) gridClasses += ' lg:grid-cols-2';
    else if (lg === 3) gridClasses += ' lg:grid-cols-3';
    else if (lg === 4) gridClasses += ' lg:grid-cols-4';
    else if (lg === 6) gridClasses += ' lg:grid-cols-6';
    else if (lg === 12) gridClasses += ' lg:grid-cols-12';
  } else {
    // Handle simple number cols
    if (cols === 1) gridClasses += ' grid-cols-1';
    else if (cols === 2) gridClasses += ' grid-cols-2';
    else if (cols === 3) gridClasses += ' grid-cols-3';
    else if (cols === 4) gridClasses += ' grid-cols-4';
    else if (cols === 6) gridClasses += ' grid-cols-6';
    else if (cols === 12) gridClasses += ' grid-cols-12';
  }

  // Add gap classes
  if (gap === 1) gridClasses += ' gap-1';
  else if (gap === 2) gridClasses += ' gap-2';
  else if (gap === 3) gridClasses += ' gap-3';
  else if (gap === 4) gridClasses += ' gap-4';
  else if (gap === 5) gridClasses += ' gap-5';
  else if (gap === 6) gridClasses += ' gap-6';
  else if (gap === 8) gridClasses += ' gap-8';

  return <div className={cn(gridClasses, className)}>{children}</div>;
}
