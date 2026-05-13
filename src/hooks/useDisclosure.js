// src/hooks/useDisclosure.js
import { useState, useCallback } from 'react';

/**
 * Simple open/close/toggle hook for modals, drawers, etc.
 * @param {boolean} initial - initial open state
 */
export function useDisclosure(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open    = useCallback(() => setIsOpen(true),  []);
  const close   = useCallback(() => setIsOpen(false), []);
  const toggle  = useCallback(() => setIsOpen(v => !v), []);
  return { isOpen, open, close, toggle };
}