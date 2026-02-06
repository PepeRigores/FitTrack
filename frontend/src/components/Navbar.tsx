import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={{ padding: '1rem', background: '#333', color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>Fitness Tracker</Link>
            </div>
            <div>
                {isAuthenticated ? (
                    <>
                        <Link to="/" style={{ color: '#fff', marginRight: '1rem' }}>Dashboard</Link>
                        <Link to="/entrenamientos" style={{ color: '#fff', marginRight: '1rem' }}>Entrenamientos</Link>
                        <Link to="/ejercicios" style={{ color: '#fff', marginRight: '1rem' }}>Ejercicios</Link>
                        <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: '#fff', marginRight: '1rem' }}>Login</Link>
                        <Link to="/register" style={{ color: '#fff' }}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
