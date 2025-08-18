import Hyprland from "gi://AstalHyprland"

const hyprland = Hyprland.get_default()

for (const client of hyprland.get_clients()) {
  print(client.workspace.name)
  print(client.title)
}
