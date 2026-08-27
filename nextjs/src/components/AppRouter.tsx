"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconHome, IconSpiriualPower, IconGuides, IconCompliance } from '@/components/PremiumIcons';
import { useLanguage } from '@/lib/LanguageProvider';

export default function AppRouter() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const routes = [
        { path: '/app', icon: IconHome, label: t('app.home') || 'Home' },
        { path: '/app/spiritual-power', icon: IconSpiriualPower, label: t('app.spiritualPower') || 'Spiritual Power' },
        { path: '/app/guides', icon: IconGuides, label: t('app.guides') || 'Guides' },
        { path: '/app/compliance', icon: IconCompliance, label: 'Compliance' },
    ];

    return (
        <>
            {routes.map((route) => {
                const isActive = pathname === route.path;
                return (
                    <Link
                        key={route.path}
                        href={route.path}
                        className={`group flex items-center px-4 py-3 text-sm font-light rounded-xl transition-all ${
                            isActive
                                ? 'bg-white/10 text-white'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <route.icon
                            className={`mr-3 h-4.5 w-4.5 ${
                                isActive ? 'text-indigo-300' : 'text-slate-500 group-hover:text-slate-300'
                            }`}
                        />
                        <span>{route.label}</span>
                        {isActive && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
                        )}
                    </Link>
                );
            })}
        </>
    );
}
