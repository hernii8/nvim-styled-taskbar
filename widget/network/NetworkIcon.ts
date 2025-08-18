export class NetworkIcon {
	static networkIcons = [
		{
			minSignalStrength: -50,
			icon: "|||||"
		},
		{
			minSignalStrength: -60,
			icon: "||||."
		},
		{
			minSignalStrength: -67,
			icon: "|||.."
		},
		{
			minSignalStrength: -70,
			icon: "||..."
		},
		{
			minSignalStrength: -80,
			icon: "|...."
		},
	]
	static defaultIcon = "....."

	static getNetworkIcon(signalStrength: number): string {
		return NetworkIcon.networkIcons.find(el => signalStrength >= el.minSignalStrength)?.icon || NetworkIcon.defaultIcon
	}
}
