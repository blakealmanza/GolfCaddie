import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Section from '@/components/Section';
import GlassButton from '@/components/ui/GlassButton';
import GlassOutlineButton from '@/components/ui/GlassOutlineButton';
import { useCustomAuth } from '@/context/AuthContext';

export default function ProfilePage() {
	const { user, signoutRedirect } = useAuth();
	const { userId } = useCustomAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		signoutRedirect();
	};

	const handleBackToHome = () => {
		navigate('/');
	};

	// Extract user info from the user object
	const userEmail = user?.profile?.email || 'No email available';
	const userName = user?.profile?.name || user?.profile?.preferred_username || 'Golf Caddie User';
	const userSub = user?.profile?.sub || userId || 'Unknown';

	return (
		<>
			<Header title='Profile' />

			<Section title='Account Information'>
				<div className='self-stretch flex flex-col gap-4'>
					<div className='px-4 py-3 bg-glass rounded-lg drop-shadows border-glass'>
						<div className='flex flex-col gap-2'>
							<div className='flex justify-between items-center'>
								<span className='text-gray-600 text-sm font-medium font-barlow'>Name</span>
								<span className='text-black text-sm font-semibold font-barlow'>{userName}</span>
							</div>
							<div className='flex justify-between items-center'>
								<span className='text-gray-600 text-sm font-medium font-barlow'>Email</span>
								<span className='text-black text-sm font-semibold font-barlow'>{userEmail}</span>
							</div>
							<div className='flex justify-between items-center'>
								<span className='text-gray-600 text-sm font-medium font-barlow'>User ID</span>
								<span className='text-black text-xs font-mono font-barlow truncate'>
									{userSub ? `${userSub.slice(0, 8)}...` : 'Unknown'}
								</span>
							</div>
						</div>
					</div>
				</div>
			</Section>

			<Section title='Account Actions'>
				<div className='self-stretch flex flex-col gap-3'>
					<GlassOutlineButton
						text='Back to Home'
						onClick={handleBackToHome}
						textColor='black'
					/>
					<GlassButton
						text='Sign Out'
						onClick={handleLogout}
						className='bg-red-500/20 border-red-500/50 hover:bg-red-500/30'
					/>
				</div>
			</Section>

			<Section title='App Information'>
				<div className='self-stretch flex flex-col gap-4'>
					<div className='px-4 py-3 bg-glass rounded-lg drop-shadows border-glass'>
						<div className='flex flex-col gap-2'>
							<div className='flex justify-between items-center'>
								<span className='text-gray-600 text-sm font-medium font-barlow'>Version</span>
								<span className='text-black text-sm font-semibold font-barlow'>1.0.0</span>
							</div>
							<div className='flex justify-between items-center'>
								<span className='text-gray-600 text-sm font-medium font-barlow'>Build</span>
								<span className='text-black text-sm font-semibold font-barlow'>Production</span>
							</div>
						</div>
					</div>
				</div>
			</Section>
		</>
	);
}
