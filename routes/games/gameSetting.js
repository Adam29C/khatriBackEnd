const router = require("express").Router();
const dateTime = require("node-datetime");
const mongoose = require("mongoose");
const gamesProvider = require("../../model/games/Games_Provider");
const gamesSetting = require("../../model/games/AddSetting");
const session = require("../helpersModule/session");
const permission = require("../helpersModule/permission");

router.get("/", session, permission, async (req, res) => {
	try {
		const id = req.query.userId;
		const userInfo = req.session.details;
		const permissionArray = req.view;
		let finalArr = {};
		const provider = await gamesProvider.find().sort({ _id: 1 });
		let finalNew = [];

		for (index in provider) {
			let id = provider[index]._id;
			const settings = await gamesSetting
				.find({ providerId: id })
				.sort({ _id: 1 });
			finalArr[id] = {
				_id: id,
				providerName: provider[index].providerName,
				providerResult: provider[index].providerResult,
				modifiedAt: provider[index].modifiedAt,
				resultStatus: provider[index].resultStatus,
				gameDetails: settings,
			};
		}

		for (index2 in finalArr) {
			let data = finalArr[index2];
			finalNew.push(data);
		}

		if (id == 123456) {
			return res.json(finalNew);
		}

		res.render("./games/gamesetting", {
			data: finalNew,
			userInfo: userInfo,
			permission: permissionArray,
			title: "Game Settings",
		});
	} catch (e) {
		res.json({ message: e });
	}
});

router.post("/insertSettings", session, async (req, res) => {
	try {
		const dt = dateTime.create();
		const formatted = dt.format("Y-m-d H:M:S");
		const providerId = req.body.gameid;
		const gameDay = req.body.gameDay;
		const find = await gamesSetting.findOne({
			providerId: providerId,
			gameDay: gameDay,
		});
		let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		if (!find) {
			if (gameDay === "All") {
				let finalArr=[]
				let uniqueDays;
				const providerSetting = await gamesSetting.find({ providerId: providerId }, { gameDay: 1, providerId: 1 });
				if (providerSetting.length > 0) {
					let daysFromArray1 = providerSetting.map(item => item.gameDay);
					let allDays = new Set([...daysFromArray1, ...days]);
					uniqueDays = [...allDays].filter(day => !daysFromArray1.includes(day) || !days.includes(day));
				} else {
					uniqueDays = days
				}
				for (let day of uniqueDays) {
					finalArr.push({
						providerId: providerId,
						gameDay: day,
						OBT: req.body.game1,
						CBT: req.body.game2,
						OBRT: req.body.game3,
						CBRT: req.body.game4,
						isClosed: req.body.status,
						modifiedAt: formatted
					})
				}
				await gamesSetting.insertMany(finalArr)
			} else {
				const settings = new gamesSetting({
					providerId: providerId,
					gameDay: gameDay,
					OBT: req.body.game1,
					CBT: req.body.game2,
					OBRT: req.body.game3,
					CBRT: req.body.game4,
					isClosed: req.body.status,
					modifiedAt: formatted
				});
				await settings.save();
			}
			res.json({
				status: 1,
				message: "Successfully Inserted Timings For " + gameDay
			});
		} else {
			res.json({
				status: 1,
				message: "Details Already Filled For " + gameDay
			});
		}
		// let result;
		// let promiseArr = [];

		// for(let day of gameDays){
		// 	if (!find) {
		// 		const settings = new gamesSetting({
		// 			providerId: providerId,
		// 			gameDay: day,
		// 			OBT: req.body.game1.toString(),
		// 			CBT: req.body.game2.toString(),
		// 			OBRT: req.body.game3.toString(),
		// 			CBRT: req.body.game4.toString(),
		// 			isClosed: req.body.status,
		// 			modifiedAt: formatted,
		// 		});
		// 		promiseArr.push(await settings.save());

		// 	}
		// }

		// result = await Promise.all(promiseArr);

		// if(result) {
		// 	res.json({
		// 		status: 1,
		// 		message: "Successfully Inserted Timings For " + gameDays.join(),
		// 	});
		// } else {
		// 	res.json({
		// 		status: 1,
		// 		message: "Details Already Filled For " +  gameDays.join(),
		// 	});
		// }
	} catch (e) {
		res.status(400).send(e);
	}
});

router.get("/addSetting", session, permission, async (req, res) => {
	try {
		const provider = await gamesProvider.find().sort({ _id: 1 });
		const userInfo = req.session.details;
		const permissionArray = req.view;
		const check = permissionArray["gamesSetting"].showStatus;
		if (check === 1) {
			res.render("./games/addSetting", {
				data: provider,
				userInfo: userInfo,
				permission: permissionArray,
				title: "Game Setting",
			});
		} else {
			res.render("./dashboard/starterPage", {
				userInfo: userInfo,
				permission: permissionArray,
				title: "Dashboard",
			});
		}
	} catch (e) {
		res.json({ message: e });
	}
});

router.patch("/", session, async (req, res) => {
	try {
		const dt = dateTime.create();
		const formatted = dt.format("Y-m-d H:M:S");
		await gamesSetting.updateOne(
			{ _id: req.body.id },
			{
				$set: {
					OBT: req.body.obt,
					CBT: req.body.cbt,
					OBRT: req.body.obrt,
					CBRT: req.body.cbrt,
					isClosed: req.body.close,
					modifiedAt: formatted,
				},
			}
		);
		res.redirect("/gamesSetting");
	} catch (e) {
		res.json(e);
	}
});

router.post("/updateAll", session, async (req, res) => {
	try {
		const dt = dateTime.create();
		const formatted = dt.format("Y-m-d H:M:S");

		await gamesSetting.updateMany(
			{ providerId: req.body.providerId },
			{
				$set: {
					OBT: req.body.obtTime,
					CBT: req.body.cbtTime,
					OBRT: req.body.obrtTime,
					CBRT: req.body.cbrtTime,
					isClosed: req.body.openClose,
					modifiedAt: formatted,
				},
			}
		);
		res.redirect("/gamesSetting");
	} catch (e) {
		res.redirect("./games/multiedit");
	}
});

router.post("/:providerId", session, permission, async (req, res) => {
	try {
		const id = mongoose.Types.ObjectId(req.params.providerId);
		const userInfo = req.session.details;
		const permissionArray = req.view;
		gamesProvider.aggregate(
			[
				{ $match: { _id: id } },
				{
					$lookup: {
						from: "games_settings",
						localField: "_id",
						foreignField: "providerId",
						as: "gameDetails",
					},
				},
			],
			function (error, result) {
				if (error) throw error;
				else {
					const check = permissionArray["gamesSetting"].showStatus;
					if (check === 1) {
						res.render("./games/multiedit", {
							data: result,
							userInfo: userInfo,
							permission: permissionArray,
							title: "Edit Multiple",
						});
					} else {
						res.render("./dashboard/starterPage", {
							userInfo: userInfo,
							permission: permissionArray,
							title: "Dashboard",
						});
					}
				}
			}
		);
	} catch (error) {
		res.json({ message: error });
	}
});

module.exports = router;
