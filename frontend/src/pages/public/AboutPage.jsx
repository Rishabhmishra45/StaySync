import React from "react";
import { motion } from "framer-motion";
import {
  Star,
  Users,
  Award,
  Heart,
  Shield,
  Clock,
  Building,
  CheckCircle,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const AboutPage = () => {
  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Booking",
      desc: "Safe and reliable booking experience for guests.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "24/7 Support",
      desc: "Round-the-clock assistance whenever you need it.",
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Trusted Platform",
      desc: "Built with modern standards for hospitality workflows.",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Guest First",
      desc: "Personalized experiences for every guest stay.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Happy Guests", icon: <Users className="w-8 h-8" /> },
    { value: "4.9★", label: "Average Rating", icon: <Star className="w-8 h-8" /> },
    { value: "120+", label: "Properties", icon: <Building className="w-8 h-8" /> },
    { value: "24/7", label: "Support", icon: <Clock className="w-8 h-8" /> },
  ];

  const team = [
    {
      name: "Alex Johnson",
      role: "Founder & CEO",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Sarah Williams",
      role: "Head of Hospitality",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    },
    {
      name: "Emma Davis",
      role: "Customer Success",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    },
  ];

  const values = [
    "Transparent pricing with no hidden fees",
    "Sustainable and eco-friendly practices",
    "Community engagement and support",
    "Continuous innovation in guest experience",
    "Highest standards of cleanliness and safety",
    "Cultural sensitivity and local partnerships",
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>About Us - StaySync | Luxury Hotel Management</title>
        <meta
          name="description"
          content="Learn about StaySync's mission to revolutionize hotel management with technology and exceptional hospitality"
        />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/10 dark:from-primary/15 dark:via-secondary/10 dark:to-accent/10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519690889869-e705e59f72e1?auto=format&fit=crop&w=2070')] bg-cover bg-center opacity-[0.08] dark:opacity-[0.06]" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent dark:from-gray-950 dark:via-gray-950/40" />
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-16 sm:py-20 md:py-24 text-center">
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="mx-auto max-w-4xl"
            >
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/60 px-4 py-2 text-xs font-medium text-gray-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                <span className="h-2 w-2 rounded-full bg-primary" />
                About StaySync
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Redefining{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Hospitality
                </span>
              </h1>

              <p className="mt-5 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400">
                StaySync combines modern technology with exceptional hospitality
                standards to deliver seamless stays and smarter operations.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button size="lg" className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
                  Explore Features
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Contact Us
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* OUR STORY */}
        <section className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
                <Award className="w-4 h-4 text-primary" />
                Our Story
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-5">
                Built for modern hotels
              </h2>

              <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  Founded in 2020, StaySync started with one goal: make hotel
                  operations seamless while keeping the guest experience at the
                  center of everything.
                </p>
                <p>
                  We observed the gap between traditional property systems and
                  expectations of today’s travelers. StaySync bridges that gap
                  with intuitive tools and a hospitality-first approach.
                </p>
                <p>
                  Today, we help properties across multiple regions to streamline
                  workflows and elevate guest satisfaction.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Faster operations
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Reduce manual work with smart workflows.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Better guest care
                  </p>
                  <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Personalized stays through better insights.
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="rounded-3xl border border-gray-200 bg-white/70 p-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-3">
                    <img
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                      alt="Luxury Lobby"
                      className="rounded-2xl shadow-md h-44 sm:h-48 w-full object-cover"
                      loading="lazy"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"
                      alt="Guest Experience"
                      className="rounded-2xl shadow-md h-60 sm:h-64 w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="space-y-3 mt-8">
                    <img
                      src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80"
                      alt="Modern Room"
                      className="rounded-2xl shadow-md h-60 sm:h-64 w-full object-cover"
                      loading="lazy"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
                      alt="Hotel Service"
                      className="rounded-2xl shadow-md h-44 sm:h-48 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 hidden sm:block h-24 w-24 rounded-full bg-primary/20 blur-2xl" />
              <div className="absolute -top-6 -right-6 hidden sm:block h-24 w-24 rounded-full bg-secondary/20 blur-2xl" />
            </motion.div>
          </div>
        </section>

        {/* STATS */}
        <section className="mb-16 sm:mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
              >
                <Card className="p-5 sm:p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="mx-auto inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* VALUES + FEATURES */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              Our Core Values
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do at StaySync.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
              >
                <Card
                  hoverable
                  className="p-6 text-center h-full border border-gray-200/80 dark:border-white/10"
                >
                  <div className="mx-auto inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="mt-10">
            <Card className="p-6 sm:p-8 border border-gray-200/80 dark:border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* TEAM */}
        <section className="mb-16 sm:mb-20">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
              Meet Our Leadership
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The team behind StaySync’s vision and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.55 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300 border border-gray-200/80 dark:border-white/10">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-primary/10">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary font-semibold mb-4 text-sm">
                    {member.role}
                  </p>

                  <div className="flex justify-center gap-3">
                    <button
                      type="button"
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition dark:bg-gray-800 dark:hover:bg-gray-700"
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition dark:bg-gray-800 dark:hover:bg-gray-700"
                      aria-label="Twitter"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z" />
                      </svg>
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section>
          <Card className="p-8 sm:p-12 text-center border-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Hotel Management?
            </h2>

            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Join hotels using StaySync to improve guest experience and simplify
              hotel operations through smarter tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Get Started Free
              </Button>
              <Button size="lg" variant="outline">
                Schedule a Demo
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
};

export default AboutPage;
