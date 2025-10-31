import Overlay from "@/components/Overlay";
import type { Profile } from "@/types/profile";
import getProfileImage from "@/utils/getProfileImage";

function ProfileCard({ profile: user }: { profile: Profile }) {
	// const showLike = useTransform(x, [50, 150], [0, 1]);
	// const showNope = useTransform(x, [-150, -50], [1, 0]);
	// const showSuperLike = useTransform(y, [50, 150], [0, 1]);

	return (
		<section
			className={`bg-linear-to-br ${user.color} w-full h-full flex flex-col`}
		>
			<div>
				<img
					className="absolute inset-0 w-full h-full object-cover"
					src={getProfileImage(user.image)}
					alt={user.name}
				/>
			</div>
			{/* Profile Image Area - Using gradient as placeholder */}

			{/* Profile Info */}
			<div className="absolute bottom-0 left-0 right-0 max-h-[150px] grow p-4 bg-linear-to-t from-black/90 via-black/60 to-transparent text-white flex flex-col justify-end gap-2">
				{/* <Overlay type="semi-black" /> */}
				<h2 className="text-3xl font-bold">
					{user.name} <span className="opacity-70">{user.age}</span>
				</h2>

				{/* Interests */}
				<div className="mt-2 text-sm leading-none -mx-1 flex flex-wrap gap-y-3 gap-x-1">
					{user.interests.map((interest, idx) => (
						<span
							key={idx}
							className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium leading-none"
						>
							{interest}
						</span>
					))}
				</div>
				<p className="text-sm opacity-90 pt-2 pb-4">{user.bio}</p>
			</div>
		</section>
	);
}

export default ProfileCard;
