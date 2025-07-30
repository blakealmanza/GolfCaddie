import ProfileIcon from '../assets/profile.svg?react';

export default function Header({ title }: { title: string }) {
	return (
		<div className='w-full inline-flex justify-between items-center overflow-hidden'>
			<h1 className='justify-center text-black text-4xl font-semibold font-barlow'>
				{title}
			</h1>
			<button
				type='button'
				className='w-10 h-10 p-2 bg-white rounded-full inline-flex flex-col justify-center items-center overflow-hidden'
			>
				<div className='w-5 h-5'>
					<ProfileIcon />
				</div>
			</button>
		</div>
	);
}
