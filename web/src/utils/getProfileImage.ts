const getProfileImage = (imageName: string) => {
	const images: {
		[key: string]: any;
	} = {
		user1: "./images/profiles/user1.png",
		user2: "./images/profiles/user2.png",
		user3: "./images/profiles/user3.png",
		user4: "./images/profiles/user4.png",
		user5: "./images/profiles/user5.png",
	};

	return images[imageName] || images["user1"]; // 默认返回 user1
};

export default getProfileImage;
