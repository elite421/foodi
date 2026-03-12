'use client';

export default function PrintButton() {
    return (
        <button onClick={() => window.print()} style={{
            padding: '10px 20px', background: '#4338ca', color: 'white', border: 'none', borderRadius: 6, fontWeight: 700, cursor: 'pointer'
        }}>
            Print / Download PDF
        </button>
    );
}
