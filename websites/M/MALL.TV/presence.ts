const presence = new Presence({
	clientId: "813680039354826784"
});

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "malltvlogo"
		},
		strings = await presence.getStrings({
			browsing: "general.browsing",
			playing: "general.playing",
			paused: "general.paused",
			live: "general.live",
			homepage: "general.viewHome",
			watchVideo: "general.buttonWatchVideo",
			watchStream: "general.buttonWatchStream",
			viewChannel: "general.buttonViewChannel"
		}),
		channel = document.querySelector<HTMLHeadingElement>("h1.text-ellipsis"),
		videoElement: HTMLVideoElement =
			document.querySelector("#vp-player > video"),
		videoTitle = document.querySelector<HTMLHeadingElement>(
			"h1.video__info-title"
		),
		videoChannel = document.querySelector<HTMLAnchorElement>(
			"a.influencer__info-link"
		);
	if (document.location.pathname === "/") {
		presenceData.details = strings.homepage;
		presenceData.state = strings.browsing;
		presenceData.smallImageKey = "malltvbrowsing";
	} else if (channel) {
		presenceData.details = channel.textContent;
		presenceData.state = strings.browsing;
		presenceData.smallImageKey = "malltvbrowsing";
	} else if (videoTitle && videoChannel) {
		const videoLive: HTMLButtonElement =
			document.querySelector("button.vp-live");
		presenceData.details = videoTitle.textContent;
		presenceData.state = videoChannel.textContent;
		presenceData.buttons = [
			{
				label:
					videoLive.style.display === "none"
						? strings.watchVideo
						: strings.watchStream,
				url: document.URL.split("?")[0]
			},
			{
				label: strings.viewChannel,
				url: videoChannel.href
			}
		];
		if (videoLive.style.display !== "none") {
			presenceData.smallImageKey = "malltvlive";
			presenceData.smallImageText = strings.live;
		} else if (!videoElement.paused) {
			([presenceData.startTimestamp, presenceData.endTimestamp] =
				presence.getTimestampsfromMedia(videoElement)),
				(presenceData.smallImageKey = "malltvplaying");
			presenceData.smallImageText = strings.playing;
		} else {
			presenceData.smallImageKey = "malltvpaused";
			presenceData.smallImageText = strings.paused;
		}
	}
	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
