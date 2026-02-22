import { Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";
import { createComputed } from "ags";
import { BluetoothIcon } from "./BluetoothIcon";

export default function Bluetooth() {
  const bluetoothStatus = createPoll("off", 1000,
    `bash -c "
    if bluetoothctl info | grep -q 'Connected: yes'; then
      echo connected
    elif bluetoothctl show | grep -q 'Powered: yes'; then
      echo on
    else
      echo off
    fi
  "`
  );

  const icon = createComputed([bluetoothStatus], (status: string) =>
    BluetoothIcon.getBluetoothIcon(status.trim())
  );

  return (
    <menubutton halign={Gtk.Align.CENTER}>
      <label label={icon} />
      <popover>
        <box orientation={Gtk.Orientation.VERTICAL} spacing={6}>
          <label label="Bluetooth Devices" />
          <label label={bluetoothStatus} />
        </box>
      </popover>
    </menubutton>
  );
}
