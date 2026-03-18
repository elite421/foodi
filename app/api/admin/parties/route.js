import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/auth';
import { getParties, addParty, updateParty, deleteParty, getPartyById } from '@/app/lib/dataManager';

async function checkAdmin() { 
    const a = await verifySession(); 
    if (!a) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); 
    return null; 
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (id) {
            const party = await getPartyById(id);
            if (!party) return NextResponse.json({ error: 'Party not found' }, { status: 404 });
            return NextResponse.json(party);
        }
        
        const parties = await getParties();
        return NextResponse.json(parties);
    } catch (e) { 
        return NextResponse.json({ error: e.message }, { status: 500 }); 
    }
}

export async function POST(request) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const body = await request.json();
        const party = await addParty(body);
        return NextResponse.json(party, { status: 201 });
    } catch (e) { 
        return NextResponse.json({ error: e.message }, { status: 500 }); 
    }
}

export async function PUT(request) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const body = await request.json();
        await updateParty(body.id, body);
        return NextResponse.json({ success: true });
    } catch (e) { 
        return NextResponse.json({ error: e.message }, { status: 500 }); 
    }
}

export async function DELETE(request) {
    const d = await checkAdmin(); if (d) return d;
    try {
        const { searchParams } = new URL(request.url);
        await deleteParty(searchParams.get('id'));
        return NextResponse.json({ success: true });
    } catch (e) { 
        return NextResponse.json({ error: e.message }, { status: 500 }); 
    }
}
