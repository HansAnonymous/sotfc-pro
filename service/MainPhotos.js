export const MainPhotos = {
	getData() {
		return [
			{
				itemImageSrc: 'assets/m35_Lockout_ship.png',
				alt: 'Spawn ship for minigame 35: Lockout',
				title: 'Spawn ship for Minigame 35: Lockout',
			},
			{
				itemImageSrc: 'assets/m33_Golf.png',
				alt: 'Minigame 33: Golf',
				title: 'Minigame 33: Golf',
			},
			{
				itemImageSrc: 'assets/m30_Laser_Tag_lobby.png',
				alt: 'Lobby for Minigame 30: Laser Tag',
				title: 'Lobby for Minigame 30: Laser Tag',
			},
			{
				itemImageSrc: 'assets/m28_Mario_Kart_group.png',
				alt: 'Group photo for Minigame 28: Mario Kart',
				title: 'Group photo for Minigame 28: Mario Kart',
			},
			{
				itemImageSrc: 'assets/m28_Mario_Kart.png',
				alt: 'Minigame 28: Mario Kart',
				title: 'Minigame 28: Mario kart',
			}
		]
	},
	getImages() {
		return Promise.resolve(this.getData());
	}
}