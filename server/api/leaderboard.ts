import type { Database, Tables } from "~/types/database.types";
import { createCanvas, registerFont, loadImage } from 'canvas';
import { createClient } from '@supabase/supabase-js';

const client = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);
const multipliers = [3, 2, 1];
const colors = ["#f5e45e", "#fff", "#c8778d"];

const width = 1408;
const height = 640;

const debug = false;

export default defineEventHandler(async (event) => {
	
	const canvas = createCanvas(width, height);
	const ctx = canvas.getContext('2d');

	registerFont('./assets/Minecraft.otf', { family: 'SOTFC' })

	// Draw background
	// const grad = ctx.createRadialGradient(704, 160, 0, 704, 160, 933.31);

	// grad.addColorStop(0, 'rgba(125, 165, 148, 1)');
	// grad.addColorStop(1, 'rgba(79, 212, 207, 1)');

	// ctx.fillStyle = grad;
	ctx.fillStyle = "#4fd4cf";
	ctx.fillRect(0, 0, 1408, 640);

	const { data, error } = await client
		.from("sotfc_summary")
		.select("*")
		.returns<Tables<"sotfc_summary">[]>();

	const leaderboard: { [name: string]: { name: string; points: number } } = {};
	for (let p of data!) {
		if (!p.player || !p.placement || p.placement > 3 || p.player === 'No Placements!') continue;
		let currentPoints = leaderboard[p.player]?.points || 0;
		leaderboard[p.player] = {
			name: p.player,
			points: currentPoints + multipliers[p.placement - 1]
		};
	}

	// Sort leaderboard
	const leaderboardArray = Object.values(leaderboard);
	leaderboardArray.sort((a, b) => b.points - a.points);

	// Draw leaderboard

	if (debug) {
		let bw = 10;
		let bh = 10;
		let p = 0;

		for (let x = 0; x <= width; x += bw) {
			ctx.moveTo(0.5 + x + p, p);
			ctx.lineTo(0.5 + x + p, height + p);
		}
		for (let x = 0; x <= height; x += bh) {
			ctx.moveTo(p, 0.5 + x + p);
			ctx.lineTo(width + p, 0.5 + x + p);
		}
		ctx.strokeStyle = '#000';
		ctx.stroke();
	}

	const logo = await loadImage('./assets/SOTFC_Banner.png');
	const logoWidth = 630;
	const logoHeight = 157;
	ctx.drawImage(logo, width / 2 - logoWidth / 4, 32, logoWidth / 2, logoHeight / 2);
	
	ctx.font = "bold 35pt 'SOTFC'";
	ctx.textAlign = "left";
	ctx.fillStyle = "#fff";
	ctx.fillText("Top 3 Players", 80, 160);

	// Top 3
	const topThree = leaderboardArray.slice(0, 3);
	ctx.font = "bold 35pt 'SOTFC'";
	ctx.textAlign = "left";
	for (let i = 0; i < topThree.length; i++) {
		const player = topThree[i];
		ctx.fillStyle = colors[i];
		let y = 230 + 50 * i;
		let place = ("#" + (i + 1));
		ctx.fillText(place, 80, y);
		ctx.fillStyle = "#000";
		let playerName = player.name;
		ctx.fillText(playerName, 80 + ctx.measureText(place).width + 20, y);
		let pointsX = width / 2 - ctx.measureText(player.points).width - 20;
		ctx.fillText(player.points, pointsX, y);
	}

	ctx.font = "bold 24pt 'SOTFC'";
	ctx.textAlign = "left";
	ctx.fillStyle = "#fff";
	ctx.fillText("Remaining Players", 80, 400);

	// 2 column list with next 10 players
	ctx.font = "bold 20pt 'SOTFC'";
	ctx.textAlign = "left";
	const remainingPlayers = leaderboardArray.slice(3, 13);
	for (let i = 0; i < remainingPlayers.length; i++) {
		const player = remainingPlayers[i];
		ctx.fillStyle = "#000";
		let x = i < 5 ? 80 : width / 2 + 20;
		let y = i < 5 ? 430 + 30 * i : 430 + 30 * (i - 5);
		let place = ("#" + (i + 4));
		ctx.fillText(place, x, y);
		let playerName = player.name;
		ctx.fillText(playerName, x + ctx.measureText(place.length === 2 ? place + "4" : place).width + 20, y);
		let pointsX = i < 5 ? width / 2 - ctx.measureText(player.points).width - 20 : width - ctx.measureText(player.points).width - 80;
		ctx.fillText(player.points, pointsX, y);
	}

	// rect
	ctx.fillStyle = "#00000088";
	ctx.fillRect(width / 2 + 20, 135, width / 2 - 100, 200);

	// Points Reference
	ctx.font = "bold 24pt 'SOTFC'";
	ctx.textAlign = "left";
	ctx.fillStyle = "#fff";
	let text = "Point System";
	let x = width / 2 + 20 + (width / 2 - 100) / 2 - ctx.measureText(text).width / 2;
	let y = 175;
	ctx.fillText("Point System", x, y);
	// underline
	ctx.strokeStyle = "#fff";
	ctx.beginPath();
	ctx.moveTo(x, y + 5);
	ctx.lineTo(x + ctx.measureText("Point System").width, y + 5);
	ctx.lineWidth = 3;
	ctx.stroke();

	// Points
	// First Place
	ctx.font = "bold 20pt 'SOTFC'";

	text = "FIRST PLACE : THREE POINTS";
	x = width / 2 + 20 + (width / 2 - 100) / 2 - ctx.measureText(text).width / 2;
	y = 220;
	ctx.fillStyle = colors[0];
	ctx.fillText(text, x, y);
	
	// Second Place
	text = "SECOND PLACE : TWO POINTS";
	x = width / 2 + 20 + (width / 2 - 100) / 2 - ctx.measureText(text).width / 2;
	y = 270;
	ctx.fillStyle = colors[1];
	ctx.fillText(text, x, y);
	
	// Third Place
	text = "THIRD PLACE : ONE POINT";
	x = width / 2 + 20 + (width / 2 - 100) / 2 - ctx.measureText(text).width / 2;
	y = 320;
	ctx.fillStyle = colors[2];
	ctx.fillText(text, x, y);

	return canvas.toBuffer('image/png');
});