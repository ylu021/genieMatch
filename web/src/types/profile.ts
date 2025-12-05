export interface ProfilePreferences {
	ageRange: [number, number];
	sharedInterests: string[];
}

export interface Profile {
	id: string;
	name: string;
	age: number;
	bio: string;
	interests: string[];
	image: string;
	preferences: ProfilePreferences;
	color?: string;
}




