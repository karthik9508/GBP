import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const features = [
    {
        icon: "🔍",
        title: "Free GBP Audit",
        description: "Get a 0-100 health score with actionable recommendations. No login required.",
        color: "from-blue-500/20 to-cyan-500/20",
    },
    {
        icon: "📅",
        title: "Smart Post Scheduler",
        description: "Schedule weeks in advance with a beautiful calendar view. All post types supported.",
        color: "from-purple-500/20 to-pink-500/20",
    },
    {
        icon: "🤖",
        title: "AI Review Responses",
        description: "GPT-4 powered replies in professional, friendly, or apologetic tones. One-click posting.",
        color: "from-emerald-500/20 to-teal-500/20",
    },
    {
        icon: "📊",
        title: "Dashboard & Analytics",
        description: "Track scheduled posts, reviews, audit history, and usage metrics at a glance.",
        color: "from-amber-500/20 to-orange-500/20",
    },
    {
        icon: "🔔",
        title: "Real-time Notifications",
        description: "Never miss a review. Get instant alerts when customers leave feedback.",
        color: "from-red-500/20 to-rose-500/20",
    },
    {
        icon: "💳",
        title: "Flexible Pricing",
        description: "Pay with UPI, Cards, Net Banking, or Wallets. Start free, upgrade when ready.",
        color: "from-indigo-500/20 to-violet-500/20",
    },
];

const plans = [
    {
        name: "Free",
        price: "₹0",
        period: "forever",
        description: "Perfect to start",
        features: ["1 free audit", "Profile score report", "Basic recommendations", "Email report"],
        cta: "Get Started Free",
        highlighted: false,
    },
    {
        name: "Pro Monthly",
        price: "₹399",
        period: "/month",
        description: "For growing businesses",
        features: [
            "Everything in Free",
            "47-Point GBP Checklist",
            "Competitor Analysis",
            "AI Keyword Suggestions",
            "Review Sentiment Analysis",
            "Step-by-Step Fix Guide",
            "Unlimited Premium Audits",
        ],
        cta: "Get Pro Monthly",
        highlighted: false,
    },
    {
        name: "Pro Annual",
        price: "₹1,999",
        period: "/year",
        description: "Best value — save 58%",
        features: [
            "Everything in Pro Monthly",
            "47-Point GBP Checklist",
            "Competitor Analysis",
            "AI Keyword Suggestions",
            "Review Sentiment Analysis",
            "Step-by-Step Fix Guide",
            "Priority Support",
        ],
        cta: "Get Pro Annual",
        highlighted: true,
    },
];

const testimonials = [
    {
        name: "Rahul Sharma",
        business: "Sharma's Kitchen, Delhi",
        text: "GBP Pro helped us increase our Google visibility by 40%. The AI review responses save us hours every week!",
        rating: 5,
    },
    {
        name: "Priya Patel",
        business: "Glow Beauty Salon, Mumbai",
        text: "The post scheduler is a game-changer. We went from posting once a month to 3 times a week. Our bookings doubled!",
        rating: 5,
    },
    {
        name: "Dr. Ankit Mehta",
        business: "Mehta Dental Clinic, Bangalore",
        text: "The audit tool showed us exactly what was wrong with our profile. After fixing the issues, we got 60% more calls.",
        rating: 5,
    },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
                <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 md:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🚀</span>
                        <span className="text-xl font-bold gradient-text">GBP Pro</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
                        <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                        <a href="#testimonials" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">Sign In</Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="gradient" size="sm">Get Started Free</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 gradient-primary opacity-5" />
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm">
                        ✨ Now with AI-powered review responses
                    </Badge>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto">
                        Automate your{" "}
                        <span className="gradient-text">Google Business Profile</span>
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Schedule posts, respond to reviews with AI, and optimize your local SEO —
                        all in one place. Built for Indian businesses.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                        <Link href="/signup">
                            <Button variant="gradient" size="xl" className="w-full sm:w-auto animate-pulse-glow">
                                Start Free Audit →
                            </Button>
                        </Link>
                        <a href="#features">
                            <Button variant="outline" size="xl" className="w-full sm:w-auto">
                                See How It Works
                            </Button>
                        </a>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                        No credit card required • Free audit in 30 seconds
                    </p>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4">Features</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Everything you need to <span className="gradient-text">dominate local search</span>
                        </h2>
                        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                            From free audits to AI-powered review responses, GBP Pro gives you the tools
                            to maximize your Google Business Profile visibility.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <Card
                                key={feature.title}
                                className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-0 bg-gradient-to-br opacity-0 animate-fade-in"
                                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                            >
                                <CardContent className="p-6">
                                    <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-4 md:px-6 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4">Pricing</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Simple, <span className="gradient-text">affordable</span> pricing
                        </h2>
                        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                            Start free, upgrade to Pro for ₹399/month or save 58% with the annual plan.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {plans.map((plan) => (
                            <Card
                                key={plan.name}
                                className={`relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${plan.highlighted
                                    ? "border-primary shadow-lg shadow-primary/20 scale-[1.02]"
                                    : ""
                                    }`}
                            >
                                {plan.highlighted && (
                                    <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
                                )}
                                <CardHeader>
                                    {plan.highlighted && (
                                        <Badge className="w-fit mb-2 gradient-primary border-0">Best Value</Badge>
                                    )}
                                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        <span className="text-muted-foreground ml-1">{plan.period}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-2 text-sm">
                                                <span className="text-emerald-500">✓</span>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href="/signup">
                                        <Button
                                            variant={plan.highlighted ? "gradient" : "outline"}
                                            className="w-full"
                                        >
                                            {plan.cta}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <Badge variant="secondary" className="mb-4">Testimonials</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Loved by <span className="gradient-text">local businesses</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial) => (
                            <Card key={testimonial.name} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex gap-1 mb-4">
                                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                                            <span key={i} className="text-amber-400">⭐</span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                        &ldquo;{testimonial.text}&rdquo;
                                    </p>
                                    <div>
                                        <p className="font-semibold text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-muted-foreground">{testimonial.business}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 md:px-6">
                <div className="max-w-4xl mx-auto text-center rounded-2xl gradient-primary p-12 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                    <div className="relative">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to grow your business?
                        </h2>
                        <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
                            Join hundreds of Indian businesses already using GBP Pro to dominate local search.
                            Start with a free audit today.
                        </p>
                        <Link href="/signup">
                            <Button size="xl" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-xl">
                                Start Your Free Audit →
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-12 px-4 md:px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-2xl">🚀</span>
                                <span className="text-lg font-bold gradient-text">GBP Pro</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Automate your Google Business Profile. Built with ❤️ in India.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Product</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                                <li><Link href="/login" className="hover:text-foreground transition-colors">Login</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Resources</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4 text-sm">Legal</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="hover:text-foreground transition-colors">Refund Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t mt-8 pt-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} GBP Pro. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
