import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

/**
 * API Route handler for Google authentication
 * Acts as a proxy between the frontend Google login and backend authentication
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    console.log('API route received Google token, forwarding to backend...');
    
    // Forward the token to your backend API using a direct axios call
    // This avoids any configuration issues with the shared apiClient
    const response = await axios.post('http://localhost:5000/api/auth/google', { token });
    
    console.log('Received response from backend, sending to client...');
    
    // Make sure we have a valid response
    if (!response.data || !response.data.token || !response.data.user) {
      console.error('Invalid response from backend:', response.data);
      return NextResponse.json({
        success: false,
        message: 'Invalid response from authentication server'
      }, { status: 500 });
    }
    
    // Return the response with clear success flag and data
    return NextResponse.json({ 
      success: true, 
      user: response.data.user,
      token: response.data.token,
      message: 'Authentication successful'
    });
  } catch (error: any) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'Authentication failed' 
      },
      { status: error.response?.status || 500 }
    );
  }
}
