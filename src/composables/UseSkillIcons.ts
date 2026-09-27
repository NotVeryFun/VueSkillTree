export function useSkillIcons() {
  const gameModules = import.meta.glob<{
    default: string
  }>([
    '../assets/SkillIcon/_1_Game/*.svg',
    '../assets/SkillIcon/_3_Gear/*.svg'
  ],
    {
      eager: true,
    }
  )


  const iconOptions = Object.keys(gameModules)
    .map(path => path.split('/').pop() || '')

  const iconUrlMap: Record<string, string> = {}

  for (const path in gameModules) {
    const fileName =
      path.split('/').pop() || ''

    iconUrlMap[fileName] =
      gameModules[path].default
  }

  return {
    iconOptions,
    iconUrlMap,
  }
}