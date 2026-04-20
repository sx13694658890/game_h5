import { useCallback, useState } from 'react'

/**
 * 与 localStorage 同步（阶段三设置页等使用）
 */
export function useLocalStorage(key: string, initial: string): [string, (v: string) => void] {
  const [value, setValue] = useState(() => {
    try {
      return window.localStorage.getItem(key) ?? initial
    } catch {
      return initial
    }
  })

  const setStored = useCallback(
    (next: string) => {
      try {
        window.localStorage.setItem(key, next)
      } catch {
        /* ignore quota / private mode */
      }
      setValue(next)
    },
    [key]
  )

  return [value, setStored]
}
