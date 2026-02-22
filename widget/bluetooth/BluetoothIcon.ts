export class BluetoothIcon {
	static icons = {
		off: "󰂲",
		on: "󰂯",
		connected: "󰂯",
	};

	static getBluetoothIcon(status: string): string {
		return BluetoothIcon.icons[status as keyof typeof BluetoothIcon.icons] || "󰂲";
	}
}
