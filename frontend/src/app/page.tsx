"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Sparkles, Zap, Target, ArrowRight, Menu, X } from "lucide-react";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const quoteIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Quote rotation effect
  useEffect(() => {
    // Rotate quotes every 6 seconds
    quoteIntervalRef.current = setInterval(() => {
      setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % 4);
    }, 6000);
    
    return () => {
      if (quoteIntervalRef.current) {
        clearInterval(quoteIntervalRef.current);
      }
    };
  }, []);

  const navItems = [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" }
  ];

  const floatingElements = [
    { icon: Sparkles, delay: "0s", duration: "6s", size: "w-8 h-8", color: "text-blue-400" },
    { icon: Target, delay: "2s", duration: "8s", size: "w-6 h-6", color: "text-emerald-400" },
    { icon: Zap, delay: "4s", duration: "7s", size: "w-10 h-10", color: "text-purple-400" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-xl border-b border-purple-500/30 shadow-2xl shadow-purple-500/10' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo with glow effect */}
            <div className="flex items-center group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  <Sparkles className="w-7 h-7 text-white animate-pulse" />
                </div>
              </div>
              <span className="ml-4 text-2xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                EnhancedCRM
              </span>
              <div className="ml-2 px-2 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full">
                <span className="text-xs font-bold text-white">AI</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="relative text-gray-300 hover:text-white transition-colors duration-300 font-semibold text-lg group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 overflow-hidden group">
                <span className="relative z-10 flex items-center gap-2">
                  Google Sign In
                  <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-3 rounded-xl bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? 
                <X className="w-6 h-6 text-white" /> : 
                <Menu className="w-6 h-6 text-white" />
              }
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-purple-500/30 shadow-2xl">
              <nav className="flex flex-col p-6 space-y-6">
                {navItems.map((item, index) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 font-semibold text-xl hover:translate-x-2 transform"
                    onClick={() => setIsMenuOpen(false)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="flex flex-col space-y-4 pt-6 border-t border-gray-700">
                  <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold text-lg shadow-xl py-3 text-center">
                    Google Sign In
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center overflow-hidden pt-20">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse"></div>
        
        {/* Mouse-following gradient */}
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl transition-all duration-300 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>

        {/* Floating animated elements */}
        {floatingElements.map((element, index) => (
          <div
            key={index}
            className={`absolute ${element.size} ${element.color} opacity-30`}
            style={{
              animation: `float ${element.duration} ${element.delay} infinite ease-in-out`,
              left: `${20 + index * 25}%`,
              top: `${30 + index * 15}%`,
            }}
          >
            <element.icon className="w-full h-full animate-spin" style={{ animationDuration: '20s' }} />
          </div>
        ))}

        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border-2 border-emerald-400/30 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Glowing badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-400/30 text-blue-300 px-6 py-3 rounded-full text-sm font-medium mb-8 animate-fade-in hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">
                Customer Relationship Management
              </span>
            </div>
            
            {/* Enhanced main heading with glowing effects */}
            <div className="relative mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-lg blur-xl opacity-70"></div>
              <h1 className="relative">
                <span className="block text-4xl md:text-6xl font-bold text-white mb-2 leading-tight tracking-tight animate-fade-in">
                  <span className="inline-block relative">
                    <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 blur-md rounded-lg"></span>
                    <span className="relative">Enhanced</span>
                  </span>
                </span>
                <span className="block text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2 animate-glow">
                  Customer Management
                </span>
              </h1>
            </div>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in">
              A comprehensive CRM solution with <span className="text-emerald-400 font-semibold">customer segmentation</span>, 
              <span className="text-blue-400 font-semibold"> personalized campaigns</span>, and 
              <span className="text-purple-400 font-semibold"> data-driven insights</span> to grow your business.
            </p>
            
            {/* CTA buttons - only keep the Explore Features button */}
            <div className="flex justify-center items-center mb-16 animate-fade-in">
              <Link 
                href="#features" 
                className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/25 flex items-center"
              >
                <Zap className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                Explore Features
              </Link>
            </div>
            
            {/* Inspirational quotes */}
            <div className="max-w-4xl mx-auto text-center relative h-[200px] mb-12">
              {[
                {
                  text: "Great customer relationships are built on understanding, not transactions.",
                  author: "Simon Sinek"
                },
                {
                  text: "The goal as a company is to have customer service that is not just the best, but legendary.",
                  author: "Sam Walton"
                },
                {
                  text: "Your most unhappy customers are your greatest source of learning.",
                  author: "Bill Gates"
                },
                {
                  text: "Customers don't expect you to be perfect. They do expect you to fix things when they go wrong.",
                  author: "Donald Porter"
                }
              ].map((quote, index) => (
                <div 
                  key={index} 
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ease-in-out ${
                    index === currentQuoteIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <div className="mb-4 text-4xl text-purple-400/30">&ldquo;</div>
                  <p className="text-xl md:text-2xl font-light text-white mb-4 leading-relaxed px-6">
                    {quote.text}
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                    <p className="mx-4 text-lg text-purple-300">
                      {quote.author}
                    </p>
                    <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes animate-fade-in {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: animate-fade-in 0.5s ease-out forwards;
          }
          @keyframes animate-glow {
            0% { text-shadow: 0 0 20px rgba(138, 75, 255, 0.5); }
            50% { text-shadow: 0 0 30px rgba(138, 75, 255, 0.8); }
            100% { text-shadow: 0 0 20px rgba(138, 75, 255, 0.5); }
          }
          .animate-glow {
            animation: animate-glow 2s ease-in-out infinite;
          }
        `}</style>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-slate-950 via-purple-950/20 to-black relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        
        {/* Enhanced floating elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-40 left-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm border border-blue-400/40 px-4 py-2 rounded-full text-xs font-medium mb-4 shadow-lg shadow-purple-900/20">
              <Target className="w-3 h-3 text-blue-400" />
              <span className="text-blue-300">POWERFUL CAPABILITIES</span>
            </div>
            <h2 className="relative text-4xl md:text-5xl font-bold mb-6">
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-lg blur-xl opacity-70"></span>
              <span className="relative bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent">
                Intuitive CRM Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage and enhance your customer relationships
            </p>
          </div>
          
          {/* Feature tabs */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left side: Feature image */}
              <div className="relative order-2 md:order-1">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-cyan-600/30 rounded-3xl blur-xl opacity-70 animate-pulse-slow"></div>
                <div className="relative bg-gray-900/70 backdrop-blur-md rounded-3xl border border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-500/20 p-1">
                  <div className="bg-gray-900 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-800/80 p-4 rounded-xl border border-blue-500/20">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center mr-3">
                              <Target className="w-4 h-4 text-blue-400" />
                            </div>
                            <span className="font-medium text-white">Customer Segmentation</span>
                          </div>
                          <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full animate-pulse-slow" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/80 p-4 rounded-xl border border-purple-500/20">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center mr-3">
                              <Zap className="w-4 h-4 text-purple-400" />
                            </div>
                            <span className="font-medium text-white">Campaign Management</span>
                          </div>
                          <span className="text-xs bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">In Progress</span>
                        </div>
                        <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full animate-pulse-slow" style={{ width: '60%', animationDelay: '1s' }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/80 p-4 rounded-xl border border-emerald-500/20">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center mr-3">
                              <Sparkles className="w-4 h-4 text-emerald-400" />
                            </div>
                            <span className="font-medium text-white">Analytics Dashboard</span>
                          </div>
                          <span className="text-xs bg-emerald-500/30 text-emerald-300 px-2 py-1 rounded-full">Optimized</span>
                        </div>
                        <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-500 to-green-500 h-full rounded-full animate-pulse-slow" style={{ width: '90%', animationDelay: '2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side: Feature list with expandable items */}
              <div className="order-1 md:order-2">
                <div className="space-y-6">
                  {[
                    {
                      title: "Customer Management",
                      icon: "👥",
                      description: "Store and manage detailed customer profiles with contact information, interaction history, and purchase records. Track customer journeys and build comprehensive profiles for personalized engagement.",
                      color: "from-blue-400 to-cyan-400",
                      gradient: "from-blue-600/30 to-cyan-600/30",
                      border: "border-blue-500/30"
                    },
                    {
                      title: "Advanced Segmentation",
                      icon: "🔍",
                      description: "Group customers based on demographics, purchase behavior, and engagement patterns to create targeted segments. Utilize AI-powered insights to identify high-value customer groups and engagement opportunities.",
                      color: "from-purple-400 to-pink-400",
                      gradient: "from-purple-600/30 to-pink-600/30",
                      border: "border-purple-500/30"
                    },
                    {
                      title: "Interactive Analytics",
                      icon: "📊",
                      description: "Visualize customer data, sales metrics, and campaign performance with interactive charts and real-time reports. Gain actionable insights through customizable dashboards with drag-and-drop capabilities.",
                      color: "from-emerald-400 to-green-400",
                      gradient: "from-emerald-600/30 to-green-600/30",
                      border: "border-emerald-500/30"
                    },
                    {
                      title: "Omni-channel Campaigns",
                      icon: "📱",
                      description: "Create, schedule, and track marketing campaigns across multiple channels to engage with your customers. Coordinate email, social media, SMS, and web campaigns from a single unified interface.",
                      color: "from-amber-400 to-orange-400", 
                      gradient: "from-amber-600/30 to-orange-600/30",
                      border: "border-amber-500/30"
                    }
                  ].map((feature, index) => (
                    <div 
                      key={index} 
                      className={`group relative bg-gray-900/50 backdrop-blur-sm border ${feature.border} rounded-xl p-6 transition-all duration-500 hover:bg-gray-800/50 overflow-hidden`}
                    >
                      <div className={`absolute -inset-1 bg-gradient-to-r ${feature.gradient} rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <div className="relative z-10 flex items-start">
                        <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mr-4 group-hover:scale-110 transition-transform`}>
                          <span className="text-2xl">{feature.icon}</span>
                        </div>
                        <div>
                          <h3 className={`text-xl font-bold mb-2 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:translate-x-1 transition-transform`}>
                            {feature.title}
                          </h3>
                          <p className="text-gray-300 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes pulse-slow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
          }
          .animate-pulse-slow {
            animation: pulse-slow 4s ease-in-out infinite;
          }
        `}</style>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-gradient-to-b from-slate-950 via-purple-950/20 to-black relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.25),transparent_70%)]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm border border-blue-400/40 px-4 py-2 rounded-full text-xs font-medium mb-4 shadow-lg shadow-purple-900/20">
              <Zap className="w-3 h-3 text-blue-400" />
              <span className="text-blue-300">SUBSCRIPTION OPTIONS</span>
            </div>
            <h2 className="relative text-4xl md:text-5xl font-bold mb-6">
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-lg blur-xl opacity-70"></span>
              <span className="relative bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Basic",
                price: "$29",
                description: "Essential CRM features for small businesses and startups.",
                features: [
                  "Up to 1,000 customer profiles",
                  "Basic segmentation",
                  "Email campaign tools",
                  "Standard reporting",
                  "Email support"
                ],
                color: "from-blue-500 to-cyan-500",
                buttonColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
                shadow: "shadow-blue-500/30",
                border: "border-blue-500/30",
                popular: false
              },
              {
                name: "Standard",
                price: "$79",
                description: "Complete CRM solution for growing businesses.",
                features: [
                  "Up to 10,000 customer profiles",
                  "Advanced segmentation",
                  "Multi-channel campaigns",
                  "Enhanced analytics",
                  "Priority support"
                ],
                color: "from-purple-500 to-pink-500",
                buttonColor: "bg-gradient-to-r from-purple-500 to-pink-500",
                shadow: "shadow-purple-500/30",
                border: "border-purple-500/40",
                popular: true
              },
              {
                name: "Plus",
                price: "$149",
                description: "Comprehensive solution for established businesses.",
                features: [
                  "Unlimited customer profiles",
                  "Custom segments",
                  "Advanced campaign tools",
                  "Custom reporting",
                  "Dedicated support"
                ],
                color: "from-emerald-500 to-green-500",
                buttonColor: "bg-gradient-to-r from-emerald-500 to-green-500",
                shadow: "shadow-emerald-500/30",
                border: "border-emerald-500/30",
                popular: false
              }
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-gray-900/60 backdrop-blur-sm border ${plan.border} rounded-2xl p-8 transition-all duration-300 hover:shadow-xl ${plan.shadow} hover:bg-gray-800/60 flex flex-col ${plan.popular ? 'transform -translate-y-4 md:-translate-y-8' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg shadow-purple-900/30">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${plan.color} rounded-2xl blur-md opacity-20 -z-10`}></div>
                <div className={`text-2xl font-bold mb-2 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                  {plan.name}
                </div>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
                <p className="text-gray-300 mb-6">{plan.description}</p>
                <div className="flex-grow">
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center text-gray-300">
                        <svg className={`w-5 h-5 bg-gradient-to-r ${plan.color} rounded-full p-1 text-white mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link 
                  href="/signup" 
                  className={`${plan.buttonColor} text-white py-3 px-6 rounded-xl font-semibold text-center hover:opacity-90 transition-all duration-300 shadow-lg ${plan.shadow}`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Dashboard Section */}
      <section id="dashboard-preview" className="py-24 bg-gradient-to-b from-black via-purple-950/20 to-slate-950 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-12">
            <div className="flex flex-col items-center gap-4 px-4 text-center sm:gap-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm border border-blue-400/40 px-4 py-2 rounded-full text-xs font-medium mb-2 shadow-lg shadow-purple-900/20">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span className="text-blue-300">INTERFACE PREVIEW</span>
              </div>
              <h2 className="relative text-3xl leading-tight font-semibold sm:text-5xl sm:leading-tight">
                <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-lg blur-xl opacity-70"></span>
                <span className="relative bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Intuitive Dashboard
                </span>
              </h2>
              <p className="text-md text-muted-foreground max-w-[600px] font-medium sm:text-xl text-gray-300">
                Modern interface designed for productivity and ease of use
              </p>
            </div>

            <div className="relative w-full max-w-5xl mx-auto group">
              {/* Glow effect behind the dashboard */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-cyan-600/40 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-purple-900/30 border border-purple-500/30 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 z-0"></div>
                <div className="relative z-10 bg-gray-900/70 backdrop-blur-sm p-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 bg-gray-800 rounded px-4 py-1 text-xs text-gray-400 flex-1">
                      EnhancedCRM Dashboard
                    </div>
                  </div>
                  <div className="bg-gray-800/80 rounded-xl p-4 transition-all duration-300 group-hover:bg-gray-800/90 border border-purple-500/20">
                    <div className="block relative overflow-hidden rounded-lg group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <img 
                        src="https://www.launchuicomponents.com/app-light.png" 
                        alt="CRM Dashboard Preview" 
                        className="rounded-lg w-full h-auto transition-all duration-500 group-hover:scale-[1.02]"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm px-6 py-3 rounded-full font-semibold text-white shadow-xl">
                          View Dashboard
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-b from-black via-purple-950/20 to-slate-950 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.25),transparent_70%)]"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/30 to-blue-600/30 backdrop-blur-sm border border-purple-400/40 px-4 py-2 rounded-full text-xs font-medium mb-4 shadow-lg shadow-purple-900/20">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="text-purple-300">WHAT OUR CLIENTS SAY</span>
            </div>
            <h2 className="relative text-4xl md:text-5xl font-bold mb-6">
              <span className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-lg blur-xl opacity-70"></span>
              <span className="relative bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Customer Testimonials
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Hear from businesses that have transformed their customer relationships
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "EnhancedCRM has completely revolutionized how we manage our customer relationships. The segmentation tools are incredibly powerful.",
                name: "Sarah Johnson",
                title: "Marketing Director, TechGrowth Inc.",
                image: "https://randomuser.me/api/portraits/women/32.jpg",
                color: "from-blue-600/20 to-cyan-600/20",
                border: "border-blue-500/30",
                textColor: "text-blue-400"
              },
              {
                quote: "The insights we've gained through the analytics dashboard have directly contributed to a 37% increase in our customer retention rate.",
                name: "Michael Chen",
                title: "CEO, Velocity Partners",
                image: "https://randomuser.me/api/portraits/men/68.jpg",
                color: "from-purple-600/20 to-pink-600/20",
                border: "border-purple-500/30",
                textColor: "text-purple-400"
              },
              {
                quote: "Setting up campaigns is so intuitive, and the performance tracking gives us actionable data that has improved our conversion rates.",
                name: "Emma Rodriguez",
                title: "Customer Success Manager, Nova Solutions",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
                color: "from-emerald-600/20 to-green-600/20",
                border: "border-emerald-500/30",
                textColor: "text-emerald-400"
              },
            ].map((testimonial, index) => (
              <div 
                key={index} 
                className={`relative bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:${testimonial.border} rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-purple-900/20 group`}
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${testimonial.color} rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10`}></div>
                <div className="relative z-10">
                  <div className="mb-6 text-4xl text-gray-600 group-hover:text-gray-500 transition-colors">&ldquo;</div>
                  <p className="text-gray-300 mb-6 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="flex items-center">
                    <div className="relative">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${testimonial.color} rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="relative w-12 h-12 rounded-full mr-4 border-2 border-gray-700 group-hover:border-transparent transition-all duration-300"
                      />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold group-hover:text-white transition-colors">{testimonial.name}</h4>
                      <p className={`text-gray-400 text-sm group-hover:${testimonial.textColor} transition-colors`}>{testimonial.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link 
              href="/testimonials" 
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold group"
            >
              View more customer stories
              <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-b from-slate-950 via-purple-950/20 to-black relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-sm border border-blue-400/40 px-4 py-2 rounded-full text-xs font-medium mb-4 shadow-lg shadow-purple-900/20">
              <Zap className="w-3 h-3 text-blue-400" />
              <span className="text-blue-300">GET IN TOUCH</span>
            </div>
            <h2 className="relative text-4xl md:text-5xl font-bold mb-6">
              <span className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-lg blur-xl opacity-70"></span>
              <span className="relative bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Contact Us
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions or need assistance? Reach out to our team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Information */}
            <div className="relative group bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-blue-500/30 rounded-2xl p-8 transition-all duration-300 shadow-lg shadow-black/20">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
              <h3 className="text-2xl font-bold text-white mb-6">Connect With Us</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-500/30 p-3 rounded-lg mr-4 shadow-inner shadow-blue-500/10">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Email</h4>
                    <a href="mailto:support@enhancedcrm.com" className="text-gray-300 hover:text-blue-400 transition-colors">
                      support@enhancedcrm.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-500/30 p-3 rounded-lg mr-4 shadow-inner shadow-purple-500/10">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Phone</h4>
                    <a href="tel:+15555555555" className="text-gray-300 hover:text-purple-400 transition-colors">
                      +1 (555) 555-5555
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-emerald-500/30 p-3 rounded-lg mr-4 shadow-inner shadow-emerald-500/10">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Location</h4>
                    <p className="text-gray-300">
                      100 Innovation Drive<br />
                      San Francisco, CA 94103
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-800">
                <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
                <div className="flex space-x-4">
                  {[
                    { name: "Twitter", icon: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" },
                    { name: "LinkedIn", icon: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" },
                    { name: "GitHub", icon: "M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" },
                  ].map((social, index) => (
                    <a 
                      key={index}
                      href="#" 
                      className="bg-gray-800/80 hover:bg-gray-700/80 p-3 rounded-lg transition-colors group"
                      aria-label={social.name}
                    >
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                        <path d={social.icon} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="relative group bg-gray-900/50 backdrop-blur-sm border border-gray-800 hover:border-purple-500/30 rounded-2xl p-8 transition-all duration-300 shadow-lg shadow-black/20">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-500 -z-10"></div>
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full bg-gray-800/70 border border-gray-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 hover:shadow-purple-900/50"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(67,56,202,0.3),transparent_70%)]"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-blue-600/30 rounded-lg blur-xl opacity-70"></div>
            <h2 className="relative text-4xl font-bold text-white mb-6">
              Ready to Transform Your Customer Relationships?
            </h2>
          </div>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Get started today and see the difference our AI-powered CRM can make for your business.
          </p>
          <Link 
            href="/signup" 
            className="inline-flex items-center px-8 py-4 bg-white text-purple-900 rounded-xl font-bold text-lg shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 hover:bg-gray-100 hover:scale-105"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
                <span className="ml-3 text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:from-blue-400 group-hover:to-purple-400 transition-colors">EnhancedCRM</span>
              </div>
              <p className="mt-2 max-w-xs text-gray-500">Intelligent customer relationship management powered by AI</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="hover:text-blue-400 transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors">Demo</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Careers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-emerald-400 transition-colors">API</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p>© 2023 EnhancedCRM. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="hover:text-purple-400 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.29 8.18 6.264 9.504.4.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}


