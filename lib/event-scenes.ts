import { SCENE_IDS } from '@/app/components/world/scenes';

export function sceneIds() {
  return SCENE_IDS as readonly string[];
}

export function isEventScene(value: string) {
  return (SCENE_IDS as string[]).includes(value);
}
