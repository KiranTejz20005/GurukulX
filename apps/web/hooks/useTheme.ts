"use client"

import * as React from "react"

export type Theme = "light" | "dark" | "system"

export function useTheme() {
  const [theme, setThemeState] = React.useState<Theme>("dark")

  React.useEffect(() => {
    const saved = (localStorage.getItem("gurukulx-theme") as Theme) || "dark"
    setThemeState(saved)
    applyTheme(saved)
  }, [])

  const applyTheme = (t: Theme) => {
    const root = document.documentElement
    if (t === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      if (prefersDark) {
        root.classList.add("dark")
      } else {
        root.classList.remove("dark")
      }
    } else if (t === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("gurukulx-theme", newTheme)
    applyTheme(newTheme)
  }

  return { theme, setTheme }
}
