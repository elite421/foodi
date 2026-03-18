import { NextResponse } from 'next/server';

export async function GET() {
    const envVars = {
        MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY ? 'EXISTS (length: ' + process.env.MSG91_AUTH_KEY.length + ')' : 'NOT FOUND',
        MSG91_OTP_TEMPLATE_ID: process.env.MSG91_OTP_TEMPLATE_ID ? 'EXISTS' : 'NOT FOUND',
        MSG91_SENDER_ID: process.env.MSG91_SENDER_ID || 'NOT FOUND',
        MSG91_FLOW_ID: process.env.MSG91_FLOW_ID ? 'EXISTS' : 'NOT FOUND',
        allEnvKeys: Object.keys(process.env).filter(k => k.includes('MSG') || k.includes('SMS')),
    };
    
    return NextResponse.json({
        success: true,
        environment: envVars,
        nodeEnv: process.env.NODE_ENV,
        message: 'Environment variables check'
    });
}
