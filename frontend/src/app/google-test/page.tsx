// Use App directory dynamic mode
export const dynamic = 'force-dynamic';

// Skip creating the Google test page entirely
export default function GoogleTestPage() {
  return (
    <div className="min-h-screen p-8 bg-gray-950 text-white">
      <h1 className="text-3xl font-bold mb-6">Google OAuth Test Page</h1>
      
      <div className="mb-8 p-4 bg-gray-900 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Google OAuth Integration</h2>
        <p className="mb-4 text-gray-300">Google OAuth integration is available in the login page.</p>
        <div className="p-3 bg-gray-800 rounded overflow-auto text-sm mb-4">
          <p>The Google OAuth test functionality has been moved to the login page for better compatibility.</p>
        </div>
      </div>

      <div className="p-4 bg-gray-900 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Testing OAuth</h2>
        <p className="mb-4">To test Google OAuth functionality:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Navigate to the <a href="/login" className="text-blue-400 hover:underline">Login Page</a></li>
          <li>Click the "Sign in with Google" button</li>
          <li>Complete the Google authentication flow</li>
        </ol>
      </div>
    </div>
  );
}
