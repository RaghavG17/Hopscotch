"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Upload, Sparkles, Target, Clock, Edit3, Save, X } from "lucide-react"
import Link from "next/link"

interface Milestone {
  id: string
  year: string
  title: string
  description: string
  image?: string
  shortTermGoals: string[]
  longTermGoals: string[]
  position: "top" | "bottom"
}

export default function TimelinePage() {
  const currentYear = new Date().getFullYear()
  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      year: "Now",
      title: "Current Focus",
      description: "Building my career in software development",
      image: "/modern-office-workspace.png",
      shortTermGoals: ["Complete current project", "Learn React Native"],
      longTermGoals: ["Become a senior developer", "Start my own company"],
      position: "top",
    },
    ...Array.from({ length: 9 }, (_, i) => ({
      id: (i + 2).toString(),
      year: (currentYear + i + 1).toString(),
      title: `Milestone ${currentYear + i + 1}`,
      description: `Goals and aspirations for ${currentYear + i + 1}`,
      image: undefined,
      shortTermGoals: ["Set new goals", "Plan next steps"],
      longTermGoals: ["Achieve long-term vision", "Build lasting impact"],
      position: (i % 2 === 0 ? "bottom" : "top") as "top" | "bottom",
    })),
  ])

  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<Milestone | null>(null)

  const handleEditMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone)
    setEditForm({ ...milestone })
    setIsEditing(true)
  }

  const handleSaveMilestone = () => {
    if (editForm) {
      setMilestones((prev) => prev.map((m) => (m.id === editForm.id ? editForm : m)))
      setSelectedMilestone(editForm)
      setIsEditing(false)
    }
  }

  const generateSuggestions = () => {
    // Mock AI suggestions - in real app this would call an AI API
    const suggestions = {
      shortTerm: [
        "Set up weekly progress reviews",
        "Join relevant professional communities",
        "Create a learning schedule",
        "Build a personal brand online",
      ],
      longTerm: [
        "Establish yourself as a thought leader",
        "Build a network of industry connections",
        "Develop expertise in emerging technologies",
        "Create multiple income streams",
      ],
    }

    if (editForm) {
      setEditForm({
        ...editForm,
        shortTermGoals: [...editForm.shortTermGoals, ...suggestions.shortTerm.slice(0, 2)],
        longTermGoals: [...editForm.longTermGoals, ...suggestions.longTerm.slice(0, 2)],
      })
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && editForm) {
      const imageUrl = URL.createObjectURL(file)
      setEditForm({ ...editForm, image: imageUrl })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <p className="text-center py-5">add reusable navbar component here</p>

      {/* Timeline Section */}
      <section className="pt-8 pb-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Life Timeline</h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Track your journey, set goals, and visualize your path to success
            </p>
          </div>

          <div className="relative">
            <div className="overflow-x-auto pb-8">
              <div className="relative min-w-max px-12">
                {/* Horizontal Timeline Line */}
                <div className="absolute top-1/2 left-0 right-0 h-2 bg-accent/30 rounded-full transform -translate-y-1/2 z-0"></div>

                {/* Staggered Milestones */}
                <div className="flex items-center space-x-32 relative z-10">
                  {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="flex flex-col items-center">
                      <div
                        className={`flex flex-col items-center ${index % 2 === 0 ? "mb-8" : "mt-8 flex-col-reverse"}`}
                      >
                        {/* Year Label */}
                        <h3 className={`text-xl font-bold text-foreground ${index % 2 === 0 ? "mb-4" : "mt-4"}`}>
                          {milestone.year}
                        </h3>

                        {/* Milestone Card */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Card className="w-44 h-44 cursor-pointer hover:shadow-2xl transition-all duration-300 group relative overflow-hidden border-2 border-border hover:border-accent">
                              <div
                                className="absolute inset-0 bg-cover bg-center"
                                style={{
                                  backgroundImage: milestone.image ? `url(${milestone.image})` : "none",
                                  backgroundColor: milestone.image ? "transparent" : "#f1f5f9",
                                }}
                              >
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                              </div>
                              <CardContent className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">{milestone.title}</h4>
                                  <p className="text-xs opacity-90 line-clamp-3">{milestone.description}</p>
                                </div>
                                <Badge variant="secondary" className="self-start text-xs">
                                  {milestone.shortTermGoals.length + milestone.longTermGoals.length} goals
                                </Badge>
                              </CardContent>
                            </Card>
                          </DialogTrigger>
                          <MilestoneModal milestone={milestone} onEdit={() => handleEditMilestone(milestone)} />
                        </Dialog>

                        {/* Connecting Line */}
                        <div
                          className={`w-1 bg-accent/60 ${
                            index % 2 === 0
                              ? "h-12 mb-60" // Top milestones: line goes down to touch middle line
                              : "h-12 mt-60" // Bottom milestones: line goes up to touch middle line
                          }`}
                        ></div>
                      </div>

                      {/* Timeline Dot */}
                      <div className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-accent rounded-full border-2 border-background shadow-lg z-20"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Scroll Hint */}
            <div className="text-center mt-4">
              <p className="text-sm text-muted-foreground">← Scroll horizontally to explore your timeline →</p>
            </div>
          </div>
        </div>
      </section>

      {/* Edit Modal */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit3 className="w-5 h-5" />
              <span>Edit Milestone</span>
            </DialogTitle>
          </DialogHeader>

          {editForm && (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label>Milestone Image</Label>
                <div className="mt-2 space-y-4">
                  <div className="flex items-center space-x-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex items-center space-x-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
                        <Upload className="w-4 h-4" />
                        <span>Upload Image</span>
                      </div>
                    </Label>
                  </div>
                  {editForm.image && (
                    <img
                      src={editForm.image || "/placeholder.svg"}
                      alt="Milestone preview"
                      className="w-32 h-24 object-cover rounded-md"
                    />
                  )}
                </div>
              </div>

              {/* Goals Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Goals & Next Steps</h3>
                  <Button onClick={generateSuggestions} variant="outline" size="sm">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Suggestions
                  </Button>
                </div>

                {/* Short Term Goals */}
                <div>
                  <Label className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4" />
                    <span>Short Term Goals</span>
                  </Label>
                  <div className="space-y-2">
                    {editForm.shortTermGoals.map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={goal}
                          onChange={(e) => {
                            const newGoals = [...editForm.shortTermGoals]
                            newGoals[index] = e.target.value
                            setEditForm({ ...editForm, shortTermGoals: newGoals })
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newGoals = editForm.shortTermGoals.filter((_, i) => i !== index)
                            setEditForm({ ...editForm, shortTermGoals: newGoals })
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditForm({
                          ...editForm,
                          shortTermGoals: [...editForm.shortTermGoals, ""],
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Short Term Goal
                    </Button>
                  </div>
                </div>

                {/* Long Term Goals */}
                <div>
                  <Label className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4" />
                    <span>Long Term Goals</span>
                  </Label>
                  <div className="space-y-2">
                    {editForm.longTermGoals.map((goal, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={goal}
                          onChange={(e) => {
                            const newGoals = [...editForm.longTermGoals]
                            newGoals[index] = e.target.value
                            setEditForm({ ...editForm, longTermGoals: newGoals })
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newGoals = editForm.longTermGoals.filter((_, i) => i !== index)
                            setEditForm({ ...editForm, longTermGoals: newGoals })
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditForm({
                          ...editForm,
                          longTermGoals: [...editForm.longTermGoals, ""],
                        })
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Long Term Goal
                    </Button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveMilestone}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function MilestoneCard({ milestone, onEdit }: { milestone: Milestone; onEdit: () => void }) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-bold text-foreground mb-4">{milestone.year}</h3>
      <Dialog>
        <DialogTrigger asChild>
          <Card className="w-48 h-48 cursor-pointer hover:shadow-lg transition-all duration-300 group relative overflow-hidden border-2 border-border">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: milestone.image ? `url(${milestone.image})` : "none",
                backgroundColor: milestone.image ? "transparent" : "#f1f5f9",
              }}
            >
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
            </div>
            <CardContent className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
              <div>
                <h4 className="text-sm font-medium mb-1">{milestone.title}</h4>
              </div>
              <Badge variant="secondary" className="self-start">
                {milestone.shortTermGoals.length + milestone.longTermGoals.length} goals
              </Badge>
            </CardContent>
          </Card>
        </DialogTrigger>
        <MilestoneModal milestone={milestone} onEdit={onEdit} />
      </Dialog>
    </div>
  )
}

// MilestoneModal component
function MilestoneModal({ milestone, onEdit }: { milestone: Milestone; onEdit: () => void }) {
  return (
    <DialogContent className="max-w-3xl p-10">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span className="text-xl">
            {milestone.year} - {milestone.title}
          </span>
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {milestone.image && (
          <img
            src={milestone.image || "/placeholder.svg"}
            alt={milestone.title}
            className="w-full h-64 object-cover rounded-md"
          />
        )}

        <p className="text-muted-foreground text-lg">{milestone.description}</p>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold flex items-center space-x-2 mb-3 text-lg">
              <Clock className="w-5 h-5" />
              <span>Short Term Goals</span>
            </h4>
            <div className="space-y-2">
              {milestone.shortTermGoals.map((goal, index) => (
                <Badge key={index} variant="secondary" className="mr-2 mb-2 text-sm px-3 py-1">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold flex items-center space-x-2 mb-3 text-lg">
              <Target className="w-5 h-5" />
              <span>Long Term Goals</span>
            </h4>
            <div className="space-y-2">
              {milestone.longTermGoals.map((goal, index) => (
                <Badge key={index} variant="outline" className="mr-2 mb-2 text-sm px-3 py-1">
                  {goal}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  )
}
