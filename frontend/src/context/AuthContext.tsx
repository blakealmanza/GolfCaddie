import { createContext, type ReactNode, useContext, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';

interface AuthContextType {
	userId: string | null;
	isAuthenticated: boolean;
	idToken: string | null;
	loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthWrapper = ({ children }: { children: ReactNode }) => {
	const auth = useAuth();

	const userId = auth.user?.profile?.sub ?? null;
	const idToken = auth.user?.id_token ?? null;
	const isAuthenticated = auth.isAuthenticated;
	const loading = auth.isLoading;

	useEffect(() => {
		if (!loading && !isAuthenticated) {
			auth.signinRedirect();
		}
	}, [loading, isAuthenticated, auth]);

	const value: AuthContextType = {
		userId,
		isAuthenticated,
		idToken,
		loading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useCustomAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useCustomAuth must be used within <AuthWrapper>');
	}
	return context;
};
