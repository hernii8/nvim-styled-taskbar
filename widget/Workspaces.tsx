
import { execAsync } from "ags/process"
import { createPoll } from "ags/time";

export default function Workspaces() {
  const workspaceIndicator = createPoll("", 100, async () => {
    const current = await execAsync(`bash -c "hyprctl activeworkspace -j | jq '.id'"`)
    let total = await execAsync(`bash -c "hyprctl workspaces | grep '^workspace ID' | wc -l"`)

    if (Number.parseInt(current) > Number.parseInt(total)) {
      total = current
    }

    return `${current.trim()}:${total.trim()}`
  })

  return <label
    label={workspaceIndicator}
    css={`
    color: #131312;
    background: #a99982;
    font-weight: bold;
    padding: 0 15px;
  `}
  />
}
