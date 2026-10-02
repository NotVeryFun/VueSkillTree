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
    .map(path => GetIconPath(path))

  const iconUrlMap: Record<string, string> = {}

  for (const path in gameModules) {
    const icon_path = GetIconPath(path)
    iconUrlMap[icon_path] =
      gameModules[path].default
  }

  return {
    iconOptions,
    iconUrlMap,
  }
}

function GetIconPath(path : string){
  
  const splited = path.split('/');
    const fileName =
      splited[splited.length - 2] + "/" + splited[splited.length - 1] || ''
  return  fileName;
}