import React from 'react'
import { motion } from 'framer-motion'
import { 
  Star, Users, Award, Heart, 
  Shield, Clock, MapPin, Phone,
  Mail, Globe, Building, CheckCircle
} from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const AboutPage = () => {
  const features = [
    { icon: <Shield className="w-6 h-6" />, title: 'Secure Booking', desc: 'End-to-end encryption for all transactions' },
    { icon: <Clock className="w-6 h-6" />, title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
    { icon: <Award className="w-6 h-6" />, title: 'Award Winning', desc: 'Recognized excellence in hospitality' },
    { icon: <Heart className="w-6 h-6" />, title: 'Guest First', desc: 'Personalized experiences for every guest' },
  ]

  const stats = [
    { value: '50K+', label: 'Happy Guests', icon: <Users className="w-8 h-8" /> },
    { value: '4.9★', label: 'Average Rating', icon: <Star className="w-8 h-8" /> },
    { value: '120+', label: 'Properties', icon: <Building className="w-8 h-8" /> },
    { value: '24/7', label: 'Support', icon: <Clock className="w-8 h-8" /> },
  ]

  const team = [
    { name: 'Alex Johnson', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face' },
    { name: 'Sarah Williams', role: 'Head of Hospitality', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w-400&h=400&fit=crop&crop=face' },
    { name: 'Michael Chen', role: 'CTO', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face' },
    { name: 'Emma Davis', role: 'Customer Success', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face' },
  ]

  const values = [
    'Transparent pricing with no hidden fees',
    'Sustainable and eco-friendly practices',
    'Community engagement and support',
    'Continuous innovation in guest experience',
    'Highest standards of cleanliness and safety',
    'Cultural sensitivity and local partnerships',
  ]

  return (
    <>
      <Helmet>
        <title>About Us - StaySync | Luxury Hotel Management</title>
        <meta name="description" content="Learn about StaySync's mission to revolutionize hotel management with technology and exceptional hospitality" />
      </Helmet>

      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519690889869-e705e59f72e1?auto=format&fit=crop&w=2070')] bg-cover bg-center opacity-10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Redefining Hospitality
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              StaySync combines cutting-edge technology with timeless hospitality to create unforgettable experiences
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Founded in 2020, StaySync emerged from a simple idea: to make luxury hotel management seamless, efficient, and guest-focused. What started as a passion project has grown into a leading platform trusted by hotels worldwide.
                </p>
                <p>
                  Our journey began with noticing the gap between traditional hotel management systems and the needs of modern travelers. We built StaySync to bridge that gap, combining intuitive technology with deep hospitality expertise.
                </p>
                <p>
                  Today, we serve properties across 30+ countries, helping them deliver exceptional experiences while optimizing their operations.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80" 
                    alt="Luxury Lobby" 
                    className="rounded-lg shadow-lg h-48 w-full object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80" 
                    alt="Guest Experience" 
                    className="rounded-lg shadow-lg h-64 w-full object-cover"
                  />
                </div>
                <div className="space-y-4 mt-8">
                  <img 
                    src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80" 
                    alt="Modern Room" 
                    className="rounded-lg shadow-lg h-64 w-full object-cover"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80" 
                    alt="Hotel Service" 
                    className="rounded-lg shadow-lg h-48 w-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do at StaySync
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hoverable className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Values List */}
          <div className="mt-12">
            <Card className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              The passionate team behind StaySync's success
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-primary/10">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary mb-4">{member.role}</p>
                  <div className="flex justify-center space-x-3">
                    <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/>
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
          <Card className="p-12 text-center bg-gradient-to-r from-primary/10 to-secondary/10 border-0">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Hotel Management?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Join thousands of hotels already using StaySync to elevate their guest experience and streamline operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
  )
}

export default AboutPage