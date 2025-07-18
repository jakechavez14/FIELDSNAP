
import React from 'react';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Camera, Shield, Share2, TrendingUp } from 'lucide-react';

const GoogleIcon = (props) => (
    <svg viewBox="0 0 48 48" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C42.02,35.625,44,30.039,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

export default function HomePage() {
  const handleLogin = async () => {
    try {
      // This will redirect to the built-in login flow, and upon success,
      // will redirect the user to the Dashboard page.
      await User.loginWithRedirect(createPageUrl('Dashboard'));
    } catch (error) {
      console.error("Login initiation failed:", error);
    }
  };

  const features = [
    {
      icon: <Camera className="w-8 h-8 text-orange-500" />,
      title: "Document Everything",
      description: "Capture high-quality 'before' and 'after' photos for every job, creating an indisputable record of your work."
    },
    {
      icon: <Shield className="w-8 h-8 text-blue-500" />,
      title: "Protect Yourself",
      description: "Avoid disputes with clients by providing a timestamped, visual history of the job from start to finish."
    },
    {
      icon: <Share2 className="w-8 h-8 text-green-500" />,
      title: "Share with Clients",
      description: "Easily share a professional, read-only report with your clients to showcase your work and build trust."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-500" />,
      title: "Build Your Reputation",
      description: "Use your documented history of quality work to build a portfolio and win more business."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="relative isolate">
        {/* Background Gradient */}
        <div 
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" 
          aria-hidden="true"
        >
          <div 
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" 
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
            }}
          ></div>
        </div>

        {/* Header */}
        <header className="absolute inset-x-0 top-0 z-50">
          <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
            <div className="flex lg:flex-1">
              <a href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
                    <Camera className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-800">FieldSnap</span>
              </a>
            </div>
            <div className="flex lg:flex-1 lg:justify-end">
              <Button onClick={handleLogin} variant="ghost">
                Log in
              </Button>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main className="pt-24 sm:pt-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Document Your Work. Protect Your Business.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                FieldSnap is the essential tool for contractors. Create visual records of your jobs, share progress with clients, and build a bulletproof portfolio of your craftsmanship.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-y-3">
                <Button onClick={handleLogin} size="lg" className="bg-white hover:bg-slate-100 text-slate-700 shadow-lg flex items-center gap-3 border border-slate-200 px-6 py-3">
                  <GoogleIcon className="w-5 h-5" />
                  <span className="text-base font-semibold">Get Started with Google</span>
                </Button>
                <p className="text-sm text-slate-500">No password required. Secure login via Google.</p>
              </div>
            </div>

            <div className="mt-16 sm:mt-24">
              <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-10 text-center sm:grid-cols-2 lg:max-w-none lg:grid-cols-4">
                {features.map((feature) => (
                  <div key={feature.title} className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
