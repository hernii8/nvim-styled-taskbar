import { createPoll } from "ags/time";
import { BatteryIcon } from "./BatteryIcon";
import { createComputed } from "ags";

export default function Battery() {
  const battery = createPoll("", 5000, "cat /sys/class/power_supply/BAT1/capacity");
  const chargingStatus = createPoll("", 5000, "cat /sys/class/power_supply/ACAD/online");

  const labelText = createComputed([battery, chargingStatus], (capacityRaw: string, chargingRaw: string) => {
    const capacity = Number(capacityRaw.trim() || "0");
    const isCharging = chargingRaw.trim() === "1";
    return `${BatteryIcon.getBatteryIcon(isCharging, capacity) || ""} ${capacityRaw}%`
  });

  return <label label={labelText} />;
}
