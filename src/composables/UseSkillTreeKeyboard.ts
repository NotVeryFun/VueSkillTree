export function useSkillTreeKeyboard({
  duplicateSelected,
  deleteSelected,
  undo,
  redo,
}: {
  duplicateSelected: () => void
  deleteSelected: () => void
  undo: () => void
  redo: () => void
}) {

  const handleKeyDown = (event: KeyboardEvent) => {

    // ============================================================
    // Input / Textarea / Select / ContentEditable
    // ============================================================

    const target = event.target as HTMLElement | null
    console.log("[handleKeyDown] event.ctrlKey")
    console.log(event.ctrlKey)

    console.log("[handleKeyDown] event.shiftKey")
    console.log(event.shiftKey)

    console.log("[handleKeyDown] event.key.toLowerCase()")
    console.log(event.key.toLowerCase())
    if (
      target?.tagName === 'INPUT' ||
      target?.tagName === 'TEXTAREA' ||
      target?.tagName === 'SELECT' ||
      target?.isContentEditable
    ) {
      return
    }

    // ============================================================
    // Ctrl + Shift + Z
    // Redo
    // ============================================================

    if (
      event.ctrlKey &&
      event.shiftKey &&
      event.key.toLowerCase() === 'z'
    ) {
      event.preventDefault()

      redo()

      return
    }

    // ============================================================
    // Ctrl + Z
    // Undo
    // ============================================================

    if (
      event.ctrlKey &&
      !event.shiftKey &&
      event.key.toLowerCase() === 'z'
    ) {
      event.preventDefault()

      undo()

      return
    }

    // ============================================================
    // Ctrl + D
    // Duplicate
    // ============================================================

    if (
      event.shiftKey &&
      event.key.toLowerCase() === 'd'
    ) {
      event.preventDefault()

      duplicateSelected()

      return
    }

    // ============================================================
    // Delete / Backspace
    // ============================================================

    if (
      event.key === 'Delete' ||
      event.key === 'Backspace'
    ) {
      event.preventDefault()

      deleteSelected()

      return
    }
  }

  return {
    handleKeyDown,
  }
}