'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { MessageSquare, Box } from 'lucide-react'
import { getCookie } from 'cookies-next'

import { Button } from "@/components/ui/button"

type Chat = {
  id: string;
  title: string;
}

export function Sidebar({ isVisible }: { isVisible: boolean }) {
  const router = useRouter()
  const params = useParams()
  const currentChatId = params.id as string
  const [recentChats, setRecentChats] = useState<Chat[]>([])

  useEffect(() => {
    const fetchChats = async () => {
      const token = getCookie('token') // Get the token from cookies
      if (!token) {
        console.error('No token found')
        return
      }

      try {
        const response = await fetch('http://localhost:8000/api/chat/context', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch chats')
        }

        const data = await response.json()
        setRecentChats(data)
      } catch (error) {
        console.error('Error fetching chats:', error)
      }
    }

    fetchChats()
  }, [])

  const handleNewAnalysis = () => {
    router.push(`/dashboard`)
  }

  return (
    <motion.div
      className="fixed top-0 left-0 h-screen w-64 bg-zinc-900 text-white p-4 z-40 shadow-lg"
      initial={{ x: '-100%' }}
      animate={{ x: isVisible ? 0 : '-100%' }}
      exit={{ x: '-100%' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold"></h3>
      </div>

      <div className="space-y-2 overflow-y-auto">
        <Button className="w-full mb-8" size="lg" onClick={handleNewAnalysis}>
          <MessageSquare className="mr-2 h-5 w-5" />
          <span>New Analysis</span>
        </Button>

        <h3 className="text-sm text-zinc-400 mb-4">Recent Analysis</h3>
        {recentChats.map((chat) => (
          <Link
            key={chat.id}
            href={`/dashboard/${chat.id}`}
            className={`
              flex items-center text-sm rounded-md p-2 transition-colors duration-200
              ${currentChatId === chat.id ? 'text-white bg-zinc-800' : 'text-zinc-300 hover:text-white hover:bg-zinc-800'}
            `}
          >
            <Box className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{chat.title}</span>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}


