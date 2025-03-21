import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Brain, Target, LineChart, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
              Your AI Career Coach
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              Trajectory AI revolutionizes career counseling through the power of artificial intelligence.
              Get personalized guidance, bridge skill gaps, and achieve your career goals.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="text-lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Brain className="h-10 w-10" />}
              title="AI-Powered Guidance"
              description="Get personalized career advice using advanced AI algorithms"
            />
            <FeatureCard
              icon={<Target className="h-10 w-10" />}
              title="Smart Goals"
              description="Set and track career goals with actionable milestones"
            />
            <FeatureCard
              icon={<LineChart className="h-10 w-10" />}
              title="Market Insights"
              description="Access real-time job market data and trends"
            />
            <FeatureCard
              icon={<BookOpen className="h-10 w-10" />}
              title="Learning Paths"
              description="Curated courses and resources for skill development"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <TestimonialCard
              name="Sarah Johnson"
              role="Software Engineer"
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              quote="Trajectory AI helped me transition from marketing to software engineering in just 8 months!"
            />
            <TestimonialCard
              name="Michael Chen"
              role="Data Scientist"
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
              quote="The AI-powered guidance was like having a personal career mentor available 24/7."
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="Product Manager"
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
              quote="The market insights helped me negotiate a 30% higher salary in my new role."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 flex flex-col items-center text-center">
      <div className="rounded-full bg-primary/10 p-3 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

function TestimonialCard({ name, role, image, quote }: { name: string; role: string; image: string; quote: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
          <Image src={image} alt={name} fill className="object-cover" />
        </div>
        <div>
          <h4 className="font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="italic text-muted-foreground">&ldquo;{quote}&rdquo;</p>
    </Card>
  );
}