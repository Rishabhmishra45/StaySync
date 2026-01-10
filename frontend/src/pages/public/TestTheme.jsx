import React from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Check, X, AlertCircle, Home } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import { useTheme } from '../../app/providers/ThemeProvider'

const ThemeTest = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <Helmet>
        <title>Theme Test - StaySynce</title>
      </Helmet>

      <div className="min-h-screen bg-background p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Card className="mb-8 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Theme Testing
                </h1>
                <p className="text-gray-500 mt-2">
                  Current theme: <span className="font-bold capitalize">{theme}</span>
                </p>
              </div>
              <Button
                onClick={toggleTheme}
                className="flex items-center space-x-2"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-5 h-5" />
                    <span>Switch to Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5" />
                    <span>Switch to Dark</span>
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Test Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Test Card 1 */}
            <Card hoverable className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Home className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Hotel Rooms</h2>
                    <p className="text-sm text-gray-500">Manage your rooms</p>
                  </div>
                </div>
                <Badge variant="primary">12 Active</Badge>
              </div>
              <p className="text-foreground mb-4">
                This text should be readable in both light and dark modes.
              </p>
              <Button className="w-full">View All Rooms</Button>
            </Card>

            {/* Test Card 2 */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Sample Form
              </h2>
              <div className="space-y-4">
                <Input 
                  label="Email Address" 
                  placeholder="you@example.com"
                />
                <Input 
                  label="Password" 
                  type="password" 
                  placeholder="••••••••"
                />
                <Button className="w-full bg-primary hover:bg-primary/90">
                  Submit
                </Button>
              </div>
            </Card>
          </div>

          {/* Color Test */}
          <Card className="mt-6 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">
              Color Test - Should change with theme
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary text-white">
                Primary Color
              </div>
              <div className="p-4 rounded-lg bg-secondary text-white">
                Secondary Color
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                Card Background
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

export default ThemeTest