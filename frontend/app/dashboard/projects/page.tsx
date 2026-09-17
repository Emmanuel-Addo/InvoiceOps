"use client"
import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  status: string
  score: number | null
  created_at: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setProjects(data || [])
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Projects</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your credit analysis projects</p>
        </div>
        <Link 
          href="/dashboard/upload"
          className="bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          New Analysis
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      {projects.length === 0 && !error ? (
        <div className="bg-[#111113] border border-gray-800 rounded-xl p-12 text-center">
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p className="text-gray-400 mb-6">Upload a MoMo CSV statement to generate your first credit analysis project.</p>
          <Link 
            href="/dashboard/upload"
            className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors inline-block"
          >
            Start New Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-[#111113] border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg">{project.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  project.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-400'
                }`}>
                  {project.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Score:</span>
                  <span className="font-medium">{project.score ? `${project.score}/100` : 'Pending'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Created:</span>
                  <span className="font-medium">{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              
              <button className="w-full py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-800 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
