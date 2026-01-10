import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, Phone, MapPin, Clock, 
  Send, MessageSquare, HelpCircle,
  CheckCircle, XCircle, Loader2
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  phone: z.string().optional(),
})

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      phone: '',
    }
  })

  const contactInfo = [
    { icon: <Phone className="w-6 h-6" />, title: 'Phone', info: '+1 (555) 123-4567', desc: 'Available 24/7' },
    { icon: <Mail className="w-6 h-6" />, title: 'Email', info: 'support@staysync.com', desc: 'Response within 2 hours' },
    { icon: <MapPin className="w-6 h-6" />, title: 'Headquarters', info: '123 Luxury Street', desc: 'Hospitality City, HC 10001' },
    { icon: <Clock className="w-6 h-6" />, title: 'Business Hours', info: 'Monday - Friday', desc: '9:00 AM - 6:00 PM EST' },
  ]

  const faqs = [
    { question: 'How quickly do you respond to inquiries?', answer: 'We respond to all inquiries within 2 hours during business hours, and within 6 hours outside business hours.' },
    { question: 'Do you offer 24/7 support?', answer: 'Yes, our emergency support line is available 24/7 for urgent hotel management issues.' },
    { question: 'Can I schedule a product demo?', answer: 'Absolutely! You can schedule a personalized demo through our booking system or contact us directly.' },
    { question: 'What regions do you serve?', answer: 'We serve hotels worldwide, with dedicated support teams in North America, Europe, Asia, and the Middle East.' },
  ]

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      console.log('Form submitted:', data)
      toast.success('Message sent successfully!')
      setIsSubmitted(true)
      reset()
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Contact Us - StaySync | Get in Touch</title>
        <meta name="description" content="Contact StaySync for inquiries, support, or partnership opportunities. We're here to help transform your hotel management." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2070')] bg-cover bg-center opacity-10" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have questions? We're here to help. Reach out to our team for support, partnerships, or inquiries.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div>
            <Card className="p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {info.title}
                      </h3>
                      <p className="text-gray-900 dark:text-white mt-1">{info.info}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                        {info.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  {['Twitter', 'LinkedIn', 'Instagram', 'Facebook'].map((platform) => (
                    <button
                      key={platform}
                      className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      aria-label={`Follow on ${platform}`}
                    >
                      <div className="w-5 h-5 bg-gray-400 rounded-full" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* FAQ Section */}
            <Card className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <HelpCircle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Message Sent Successfully!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Thank you for contacting StaySync. Our team will get back to you within 2 hours during business hours.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)}>
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center space-x-3 mb-8">
                    <MessageSquare className="w-6 h-6 text-primary" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Send us a Message
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        error={errors.name?.message}
                        disabled={isSubmitting}
                        {...register('name')}
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        placeholder="you@example.com"
                        error={errors.email?.message}
                        disabled={isSubmitting}
                        {...register('email')}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Phone Number (Optional)"
                        placeholder="+1 (555) 123-4567"
                        disabled={isSubmitting}
                        {...register('phone')}
                      />
                      <Input
                        label="Subject"
                        placeholder="How can we help you?"
                        error={errors.subject?.message}
                        disabled={isSubmitting}
                        {...register('subject')}
                      />
                    </div>

                    <Textarea
                      label="Your Message"
                      placeholder="Please provide details about your inquiry..."
                      rows={6}
                      error={errors.message?.message}
                      disabled={isSubmitting}
                      {...register('message')}
                    />

                    <div className="flex items-center space-x-4">
                      <Button
                        type="submit"
                        size="lg"
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                      
                      {isSubmitting && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Please wait while we send your message...
                        </p>
                      )}
                    </div>
                  </form>
                </>
              )}

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="text-2xl font-bold text-primary">2h</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Average Response Time</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="text-2xl font-bold text-primary">98%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Emergency Support</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Map/Location */}
            <Card className="p-6 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Visit Our Headquarters
                </h3>
                <Button variant="outline" size="sm">
                  Get Directions
                </Button>
              </div>
              
              <div className="h-64 rounded-lg bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    123 Luxury Street, Hospitality City
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Interactive map coming soon
                  </p>
                </div>
              </div>
            </Card>

            {/* Support Types */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Technical Support
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Platform assistance and troubleshooting
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Sales Inquiries
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pricing, demos, and partnership opportunities
                </p>
              </Card>

              <Card className="p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Customer Success
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Account management and best practices
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContactPage