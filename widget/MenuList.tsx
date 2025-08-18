
import Apps from "gi://AstalApps"

export default function MenuList() {
  const apps = new Apps.Apps({
    nameMultiplier: 2,
    entryMultiplier: 0,
    executableMultiplier: 2,
  })
  return (
    <box
      name="menu-list"
    >
      <label label=':' />
      <entry
        placeholderText="Start typing..."
      />
    </box >
  )
}
