import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Calendar, LogOut, Menu } from 'lucide-react';


interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    const navItems = [
        { path: '/dashboard', label: 'Estadísticas', icon: LayoutDashboard },
        { path: '/entrenamientos', label: 'Entrenamientos', icon: Calendar },
        { path: '/ejercicios', label: 'Ejercicios', icon: Dumbbell },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* Mobile Header */}
            <header style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                backgroundColor: 'var(--surface)',
                borderBottom: '1px solid var(--border)',
                position: 'sticky',
                top: 0,
                zIndex: 40,
            }} className="mobile-header">
                <span style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary)' }}>FitTrack</span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <Menu />
                </button>
            </header>

            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <aside style={{
                    width: '250px',
                    backgroundColor: 'var(--surface)',
                    borderRight: '1px solid var(--border)',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100vh',
                    left: 0,
                    top: 0,
                    transform: isMobileMenuOpen ? 'translateX(0)' : undefined,
                    transition: 'transform 0.3s ease-in-out',
                    zIndex: 40,
                }} className="sidebar-desktop">
                    <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Dumbbell size={32} color="var(--danger)" />
                        <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--danger)' }}>Fitness Track</span>
                    </div>

                    <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: '0.75rem 1rem',
                                        borderRadius: 'var(--radius-md)',
                                        backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                                        color: isActive ? '#ffffff' : 'var(--text-secondary)',
                                        fontWeight: 500,
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <item.icon size={20} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <button
                        onClick={handleLogout}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--danger)',
                            fontWeight: 500,
                            marginTop: 'auto',
                            width: '100%',
                            textAlign: 'left',
                        }}
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </aside>

                {/* Main Content */}
                <main style={{
                    flex: 1,
                    maxWidth: '100%',
                    width: '100%',
                }} className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
