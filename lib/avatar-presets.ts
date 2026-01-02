"use client"

export type AvatarPreset = {
  id: string
  label: string
  src: string
}

const presets: AvatarPreset[] = [
  {
    id: "darkavatar",
    label: "Dark Avatar",
    src: "/avatar/darkavatar.png",
  },
  {
    id: "whiteavatar",
    label: "White Avatar",
    src: "/avatar/whiteavatar.png",
  },
  {
    id: "whiteavatargirl",
    label: "White Avatar Girl",
    src: "/avatar/whiteavatargirl.png",
  },
  {
    id: "blackavatargirl",
    label: "Black Avatar Girl",
    src: "/avatar/blackavatargirl.png",
  },
]

export const getAvatarPresets = () => presets

export const getPresetAvatar = (id: string) => presets.find((preset) => preset.id === id) || null

export const getPresetAvatarSrc = (id: string) => getPresetAvatar(id)?.src || null

export const isPresetAvatar = (avatar?: string | null) => Boolean(avatar && avatar.startsWith("preset:"))
