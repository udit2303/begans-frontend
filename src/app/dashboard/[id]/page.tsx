'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronRight, Bell, Camera, Shield, Upload, X, Box, Layers } from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"
import { motion } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Sidebar } from "@/components/DashboardSidebar"

const detectionData = [
  { month: 'Jan', value: 65 },
  { month: 'Feb', value: 80 },
  { month: 'Mar', value: 95 },
  { month: 'Apr', value: 75 },
  { month: 'May', value: 85 },
  { month: 'Jun', value: 90 },
]

const categoryData = [
  { name: 'Military Vehicles', value: 40 },
  { name: 'Personnel', value: 35 },
  { name: 'Buildings', value: 25 },
]

const COLORS = ['#3B82F6', '#6366F1', '#8B5CF6']

export default function MilitaryVisionDashboard() {
  const [showSidebar, setShowSidebar] = useState(false)
  const [showDetection, setShowDetection] = useState(true)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const params = useParams()
  const chatId = params.id as string
  const [chatHistory, setChatHistory] = useState([
    { text: "Analyze this drone footage for vehicles", isUser: false },
    { text: "I've detected 2 military vehicles in the northern sector. Confidence level is 95%. Would you like detailed positioning?", isUser: false },
  ])
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const sidebarTriggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  const handleSendMessage = () => {
    if (message.trim()) {
      setChatHistory([
        ...chatHistory,
        { text: message, isUser: true },
        { text: `AI Response: ${message}`, isUser: false },
      ])
      setMessage("")
    }
  }

  const handleCaptureImage = () => {
    alert("Capture image functionality is not implemented yet.")
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }


  const handleMouseEnter = () => setShowSidebar(true);
  const handleMouseLeave = (event: React.MouseEvent) => {
    // Check if mouse is leaving both Vision Intelligence and Sidebar
    if (
      !event.relatedTarget ||
      !(event.relatedTarget as HTMLElement).closest(".sidebar")
    ) {
      setShowSidebar(false);
    }
  };
  return (
    <div className="flex min-h-screen bg-background dark:bg-zinc-900">
      <motion.div
      className="flex min-h-screen bg-background dark:bg-zinc-900"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      <div
      className="flex min-h-screen bg-background dark:bg-zinc-900"
      onMouseLeave={handleMouseLeave}
      >
      {/* Sidebar */}
      <Sidebar isVisible={showSidebar} />
      </div>
    </motion.div>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b dark:border-zinc-700">
          <div className="flex items-center">
            <div 
              ref={sidebarTriggerRef}
              className="relative z-50"
              onMouseEnter={handleMouseEnter}
              >
              <h1 className={`text-2xl font-bold cursor-pointer transition-colors duration-200 ${
          showSidebar ? "text-white " : "dark:text-white"
        }`}>
                Vision Intelligence
              </h1>
            </div>
            <div className="mt-1 ml-10 text-sm text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300 px-3 py-1 rounded-full inline-block">
              All Detection Models Active
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="dark:text-white dark:border-zinc-700">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt="User avatar" />
              <AvatarFallback>VA</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <div className="flex flex-1 gap-4 pt-4 pl-4 pr-4">
          <div className="flex-1">
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Image Analysis</h2>
              <Tabs defaultValue="original">
                <TabsList className="bg-background dark:bg-zinc-800 border-b dark:border-zinc-700 rounded-none w-full justify-start h-auto p-0 gap-6">
                  <TabsTrigger value="original" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 pb-2 dark:text-white">
                    Original
                  </TabsTrigger>
                  <TabsTrigger value="detection" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 pb-2 dark:text-white">
                    Detection
                  </TabsTrigger>
                  <TabsTrigger value="segmentation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 pb-2 dark:text-white">
                    Segmentation
                  </TabsTrigger>
                  <TabsTrigger value="thermal" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 pb-2 dark:text-white">
                    Thermal
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="original" className="mt-4">
                  <Card className={`border-2 border-dashed bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 mx-auto transition-all duration-300 ease-in-out ${uploadedImage ? 'max-h-[200px]' : 'max-h-[400px]'}`}>
                    <CardContent className="flex flex-col items-center justify-center py-6 min-h-[200px]">
                      {uploadedImage ? (
                        <div className="relative w-full h-[150px]">
                          <Image
                            src={uploadedImage}
                            alt="Uploaded image"
                            fill
                            className="object-contain"
                            priority
                          />
                        </div>
                      ) : (
                        <Upload className="h-10 w-10 text-gray-400 dark:text-gray-600" />
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {uploadedImage ? "Image uploaded successfully" : "Upload an image to begin analysis"}
                      </p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <Button onClick={triggerFileInput} className="mt-4">
                        {uploadedImage ? "Change Image" : "Upload Image"}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 pt-0 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Box className="h-4 w-4" />
                  Objects
                </div>
                <div className="text-2xl font-bold dark:text-white">24</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Layers className="h-4 w-4" />
                  Segments
                </div>
                <div className="text-2xl font-bold dark:text-white">12</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Box className="h-4 w-4" />
                  Confidence
                </div>
                <div className="text-2xl font-bold dark:text-white">95%</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <Shield className="h-4 w-4" />
                  Threat Level
                </div>
                <div className="text-2xl font-bold dark:text-white">Low</div>
              </div>
            </div>

            <Card className={`
              mt-4 transition-all duration-300 ease-in-out
              ${uploadedImage ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}
            `}>
              <CardContent className="p-4">
                <div
                  ref={chatContainerRef}
                  className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg mb-4 overflow-y-auto h-[250px] custom-scrollbar"
                >
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg mb-2 break-words ${
                        message.isUser
                          ? "bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100 self-end ml-auto text-right"
                          : "bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 self-start mr-auto text-left"
                      }`}
                      style={{ 
                        width: "fit-content",
                        maxWidth: "700px"
                      }}
                    >
                      <p>{message.text}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="dark:border-zinc-700 dark:text-white"
                    onClick={handleCaptureImage}
                  >
                    <Camera className="h-4 w-4" />
                    <span className="sr-only">Capture Image</span>
                  </Button>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                    placeholder="Type your message..."
                  />
                  <Button
                    variant="primary"
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    onClick={handleSendMessage}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Send Message</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowDetection(!showDetection)}
            className="dark:text-white dark:border-zinc-700 transition-transform duration-300 ease-in-out"
          >
            <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${showDetection ? '' : 'rotate-180'}`} />
            <span className="sr-only">{showDetection ? 'Hide Detection Results' : 'Show Detection Results'}</span>
          </Button>
          <div className={`
            w-full lg:w-80 mt-4 lg:mt-0
            transition-all duration-300 ease-in-out
            ${showDetection ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}
          `}>
            <Card className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold dark:text-white">Detection Results</CardTitle>
                <Button variant="link" className="text-blue-600 dark:text-blue-400 text-sm p-0" onClick={() => setShowAnalytics(true)}>
                  Full Analytics →
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-4 dark:text-white">Detected Objects</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm dark:text-gray-300">Military Vehicle</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">x2</span>
                        </div>
                        <Progress value={98} className="h-1 bg-blue-100 dark:bg-blue-900" indicatorClassName="bg-blue-600 dark:bg-blue-400" />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">98% confidence</div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm dark:text-gray-300">Personnel</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">x4</span>
                        </div>
                        <Progress value={95} className="h-1 bg-blue-100 dark:bg-blue-900" indicatorClassName="bg-blue-600 dark:bg-blue-400" />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">95% confidence</div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm dark:text-gray-300">Building</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">x1</span>
                        </div>
                        <Progress value={92} className="h-1 bg-blue-100 dark:bg-blue-900" indicatorClassName="bg-blue-600 dark:bg-blue-400" />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">92% confidence</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4 dark:text-white">Detection Timeline</h3>
                    <div className="h-[200px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={detectionData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                          />
                          <YAxis 
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9CA3AF' }}
                            ticks={[0, 25, 50, 75, 100]}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'var(--background)',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#3B82F6" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-4 dark:text-white">Environmental Analysis</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Visibility</div>
                        <div className="font-medium dark:text-white">Good</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Weather</div>
                        <div className="font-medium dark:text-white">Clear</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Time</div>
                        <div className="font-medium dark:text-white">Day</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Terrain</div>
                        <div className="font-medium dark:text-white">Urban</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-semibold">Advanced Analytics Dashboard</DialogTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowAnalytics(false)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </DialogHeader>
            
            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detection Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={detectionData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--muted-foreground)' }}
                          />
                          <YAxis 
                            domain={[0, 100]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'var(--muted-foreground)' }}
                            ticks={[0, 25, 50, 75, 100]}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'var(--background)',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="var(--primary)"
                            strokeWidth={2}
                            dot={{ r: 4, fill: 'var(--primary)' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Object Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'var(--background)',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Historical Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={detectionData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis 
                          dataKey="month" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'var(--muted-foreground)' }}
                        />
                        <YAxis 
                          domain={[0, 100]}
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'var(--muted-foreground)' }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'var(--background)',
                            border: '1px solid var(--border)',
                            borderRadius: '6px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="var(--primary)"
                          strokeWidth={2}
                          dot={{ r: 4, fill: 'var(--primary)' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}