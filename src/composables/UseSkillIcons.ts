export function useSkillIcons() {
  const svgModules = import.meta.glob<{
    default: string
  }>(
    '../assets/SkillIcon/_1_Game/*.svg',
    {
      eager: true,
    }
  )

  const iconOptions = Object.keys(svgModules)
    .map(path => path.split('/').pop() || '')

  const iconUrlMap: Record<string, string> = {}

  for (const path in svgModules) {
    const fileName =
      path.split('/').pop() || ''

    iconUrlMap[fileName] =
      svgModules[path].default
  }

  return {
    iconOptions,
    iconUrlMap,
  }
}