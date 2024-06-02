// vai ser o layout de todas as páginas que vão estar dentro do dashboard
import { DashboardHeader } from './components/header';

// quando criamos um layout a gente recebe por paremetro sempre o children
export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<DashboardHeader />
			{children}
		</>
	);
}
