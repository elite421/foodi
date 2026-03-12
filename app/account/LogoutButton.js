'use client';

export default function LogoutButton() {
    return (
        <button onClick={() => {
            document.cookie = 'fc_user_session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
            window.location.href = '/';
        }} style={{
            padding: '12px 24px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8,
            fontWeight: 700, cursor: 'pointer', fontSize: '1rem', transition: 'background 0.2s'
        }} onMouseOver={e => e.currentTarget.style.background = '#fecaca'} onMouseOut={e => e.currentTarget.style.background = '#fee2e2'}>
            Sign Out
        </button>
    );
}
