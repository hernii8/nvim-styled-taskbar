import { createPoll } from "ags/time";
import { createComputed } from "ags";
import { NetworkIcon } from "./NetworkIcon"

export default function Network() {
  const networkStrength = createPoll("N/A", 5000, "bash -c \"iwctl station wlan0 show | grep \"RSSI\" | head -1 | awk \'{print $2}\'\"")

  const labelText = createComputed([networkStrength], (strengthRaw: string) => {
    const strength = Number(strengthRaw.trim() || "0");
    return NetworkIcon.getNetworkIcon(strength);
  });

  return <label label={labelText} />;
}
