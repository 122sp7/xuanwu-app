import type { ReactNode } from "react";

interface AccountRouteLayoutProps {
	readonly children: ReactNode;
}

export default function AccountRouteLayout({ children }: AccountRouteLayoutProps) {
	return children;
}
