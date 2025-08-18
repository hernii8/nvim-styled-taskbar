export class BatteryIcon {
	static batteryIcons = [
		{
			minPercenteage: 5,
			icon: '󰂎',
			charging: false
		},
		{
			minPercenteage: 10,
			icon: '󰁺',
			charging: false
		},
		{
			minPercenteage: 20,
			icon: '󰁻',
			charging: false
		},
		{
			minPercenteage: 30,
			icon: '󰁼',
			charging: false
		},
		{
			minPercenteage: 40,
			icon: '󰁽',
			charging: false
		},
		{
			minPercenteage: 50,
			icon: '󰁾',
			charging: false
		},
		{
			minPercenteage: 60,
			icon: '󰁿',
			charging: false
		},
		{
			minPercenteage: 70,
			icon: '󰂀',
			charging: false
		},
		{
			minPercenteage: 80,
			icon: '󰂁',
			charging: false
		},
		{
			minPercenteage: 90,
			icon: '󰂂',
			charging: false
		},
		{
			minPercenteage: 100,
			icon: '󰁹',
			charging: false
		},
		{
			minPercenteage: 10,
			icon: '󰢜',
			charging: true
		},
		{
			minPercenteage: 20,
			icon: '󰂆',
			charging: true
		},
		{
			minPercenteage: 30,
			icon: '󰂇',
			charging: true
		},
		{
			minPercenteage: 40,
			icon: '󰂈',
			charging: true
		},
		{
			minPercenteage: 50,
			icon: '󰢝',
			charging: true
		},
		{
			minPercenteage: 60,
			icon: '󰂉',
			charging: true
		},
		{
			minPercenteage: 70,
			icon: '󰢞',
			charging: true
		},
		{
			minPercenteage: 80,
			icon: '󰂊',
			charging: true
		},
		{
			minPercenteage: 90,
			icon: '󰂋',
			charging: true
		},
		{
			minPercenteage: 100,
			icon: '󰂅',
			charging: true
		},
	]


	public static getBatteryIcon(isCharging: boolean, currentPercenteage: number): string | undefined {
		return BatteryIcon.batteryIcons.filter(el => el.charging == isCharging).find(el => currentPercenteage <= el.minPercenteage)?.icon;
	}

}
