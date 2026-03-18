// MSG91 SMS Service for OTP
// Documentation: https://docs.msg91.com/

const MSG91_BASE_URL = 'https://api.msg91.com/api/v5';

/**
 * Send OTP via MSG91
 * @param {string} phone - Phone number with country code (e.g., +919999999999)
 * @param {string} otp - OTP to send (optional, MSG91 can generate it)
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export async function sendOTP(phone, otp = null) {
    try {
        const authKey = process.env.MSG91_AUTH_KEY;
        const templateId = process.env.MSG91_OTP_TEMPLATE_ID;
        const senderId = process.env.MSG91_SENDER_ID || 'FDCOTP';

        console.log('[MSG91 DEBUG] Environment variables:');
        console.log('[MSG91 DEBUG] MSG91_AUTH_KEY exists:', !!authKey);
        console.log('[MSG91 DEBUG] MSG91_OTP_TEMPLATE_ID exists:', !!templateId);
        console.log('[MSG91 DEBUG] MSG91_SENDER_ID:', senderId);
        console.log('[MSG91 DEBUG] Phone number:', phone);
        console.log('[MSG91 DEBUG] OTP:', otp);

        if (!authKey) {
            console.error('[MSG91 DEBUG] AUTH_KEY is missing!');
            throw new Error('MSG91_AUTH_KEY not configured');
        }

        if (!templateId) {
            console.error('[MSG91 DEBUG] TEMPLATE_ID is missing!');
            throw new Error('MSG91_OTP_TEMPLATE_ID not configured');
        }

        // Build request URL
        const url = new URL(`${MSG91_BASE_URL}/otp`);
        url.searchParams.append('authkey', authKey);
        url.searchParams.append('template_id', templateId);
        url.searchParams.append('mobile', phone);
        url.searchParams.append('sender', senderId);

        // If OTP provided, use it; otherwise MSG91 generates one
        if (otp) {
            url.searchParams.append('otp', otp);
        }

        console.log('[MSG91 DEBUG] Full URL:', url.toString().replace(authKey, '***HIDDEN***'));
        console.log('[MSG91 DEBUG] Making API call...');

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('[MSG91 DEBUG] Response status:', response.status);
        console.log('[MSG91 DEBUG] Response ok:', response.ok);

        const data = await response.json();
        console.log('[MSG91 DEBUG] Response data:', JSON.stringify(data, null, 2));

        if (response.ok && data.type === 'success') {
            console.log('[MSG91 DEBUG] SUCCESS! OTP sent');
            return {
                success: true,
                message: 'OTP sent successfully',
                data: data
            };
        } else {
            console.error('[MSG91 DEBUG] FAILED:', data.message || 'Unknown error');
            return {
                success: false,
                message: data.message || 'Failed to send OTP',
                data: data
            };
        }
    } catch (error) {
        console.error('[MSG91 DEBUG] CATCH ERROR:', error);
        return {
            success: false,
            message: error.message || 'Error sending OTP'
        };
    }
}

/**
 * Verify OTP via MSG91
 * @param {string} phone - Phone number with country code
 * @param {string} otp - OTP to verify
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export async function verifyOTP(phone, otp) {
    try {
        const authKey = process.env.MSG91_AUTH_KEY;

        if (!authKey) {
            throw new Error('MSG91_AUTH_KEY not configured');
        }

        const url = new URL(`${MSG91_BASE_URL}/otp/verify`);
        url.searchParams.append('authkey', authKey);
        url.searchParams.append('mobile', phone);
        url.searchParams.append('otp', otp);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok && data.type === 'success') {
            return {
                success: true,
                message: 'OTP verified successfully',
                data: data
            };
        } else {
            return {
                success: false,
                message: data.message || 'Invalid OTP',
                data: data
            };
        }
    } catch (error) {
        console.error('MSG91 Verify OTP Error:', error);
        return {
            success: false,
            message: error.message || 'Error verifying OTP'
        };
    }
}

/**
 * Resend OTP via MSG91
 * @param {string} phone - Phone number with country code
 * @param {string} type - 'voice' or 'text'
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export async function resendOTP(phone, type = 'text') {
    try {
        const authKey = process.env.MSG91_AUTH_KEY;

        if (!authKey) {
            throw new Error('MSG91_AUTH_KEY not configured');
        }

        const url = new URL(`${MSG91_BASE_URL}/otp/retry`);
        url.searchParams.append('authkey', authKey);
        url.searchParams.append('mobile', phone);
        url.searchParams.append('retrytype', type);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok && data.type === 'success') {
            return {
                success: true,
                message: 'OTP resent successfully',
                data: data
            };
        } else {
            return {
                success: false,
                message: data.message || 'Failed to resend OTP',
                data: data
            };
        }
    } catch (error) {
        console.error('MSG91 Resend OTP Error:', error);
        return {
            success: false,
            message: error.message || 'Error resending OTP'
        };
    }
}

/**
 * Send custom SMS via MSG91
 * @param {string|string[]} phones - Phone number(s) with country code
 * @param {string} message - Message to send
 * @param {string} route - Route type: 'transactional', 'promotional', 'optin'
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export async function sendSMS(phones, message, route = 'transactional') {
    try {
        const authKey = process.env.MSG91_AUTH_KEY;
        const senderId = process.env.MSG91_SENDER_ID || 'FDCOTP';

        if (!authKey) {
            throw new Error('MSG91_AUTH_KEY not configured');
        }

        const phoneNumbers = Array.isArray(phones) ? phones.join(',') : phones;

        const url = new URL(`${MSG91_BASE_URL}/flow/`);
        
        const response = await fetch(url.toString(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authkey': authKey
            },
            body: JSON.stringify({
                sender: senderId,
                route: route,
                country: '91',
                sms: [{
                    message: message,
                    to: phoneNumbers.split(',')
                }]
            })
        });

        const data = await response.json();

        if (response.ok && data.type === 'success') {
            return {
                success: true,
                message: 'SMS sent successfully',
                data: data
            };
        } else {
            return {
                success: false,
                message: data.message || 'Failed to send SMS',
                data: data
            };
        }
    } catch (error) {
        console.error('MSG91 Send SMS Error:', error);
        return {
            success: false,
            message: error.message || 'Error sending SMS'
        };
    }
}

/**
 * Send templated OTP SMS via MSG91 Flow API
 * Use this when you have a custom template with variables like ##name##, ##number##
 * @param {string} phone - Phone number with country code (e.g., +919999999999)
 * @param {string} name - Customer name to replace ##name##
 * @param {string} otp - OTP code to replace ##number##
 * @returns {Promise<{success: boolean, message: string, data?: any}>}
 */
export async function sendTemplatedSMS(phone, name, otp) {
    try {
        const authKey = process.env.MSG91_AUTH_KEY;
        const flowId = process.env.MSG91_FLOW_ID;
        const senderId = process.env.MSG91_SENDER_ID || 'FDCOTP';

        if (!authKey) {
            throw new Error('MSG91_AUTH_KEY not configured');
        }

        if (!flowId) {
            throw new Error('MSG91_FLOW_ID not configured for templated SMS');
        }

        const response = await fetch(`${MSG91_BASE_URL}/flow/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authkey': authKey
            },
            body: JSON.stringify({
                flow_id: flowId,
                sender: senderId,
                mobiles: phone,
                name: name || 'Customer',
                number: otp
            })
        });

        const data = await response.json();

        if (response.ok && data.type === 'success') {
            return {
                success: true,
                message: 'OTP sent successfully via template',
                data: data
            };
        } else {
            return {
                success: false,
                message: data.message || 'Failed to send templated SMS',
                data: data
            };
        }
    } catch (error) {
        console.error('MSG91 Templated SMS Error:', error);
        return {
            success: false,
            message: error.message || 'Error sending templated SMS'
        };
    }
}
