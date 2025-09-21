"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"

interface Achievement {
    id: string
    title: string
    description: string
    category: "milestone" | "social" | "special"
    rarity: "common" | "rare" | "epic" | "legendary"
    triggerKeywords: string[] //will proceed diff after raghav implements ai generation tasks mauybe
}

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

interface UserProgressContextType {
    completedTasks: Record<string, boolean>
    unlockedAchievements: Record<string, boolean>
    milestones: Milestone[]
    monthlyMilestones: Milestone[]
    toggleTask: (taskId: string, taskTitle?: string) => void
    checkAchievements: (taskTitle: string) => void
    updateMilestone: (milestone: Milestone, isMonthly?: boolean) => void
    getAchievementProgress: () => {
    totalAchievements: number
    unlockedAchievements: number
    milestonesCompleted: number
    }
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined)

//temo trugger wirds
const ACHIEVEMENTS: Achievement[] = [
    {
    id: "1",
    title: "Graduation",
    description: "Graduate from a school",
    category: "milestone",
    rarity: "common",
    triggerKeywords: ["graduation", "graduate", "diploma", "degree", "school"]
    },
    {
    id: "2",
    title: "Employment",
    description: "Land a job",
    category: "milestone",
    rarity: "rare",
    triggerKeywords: ["employment", "job", "career", "work", "hired", "position"]
    },
    {
    id: "3",
    title: "Promotion",
    description: "Receive a promotion at work",
    category: "milestone",
    rarity: "epic",
    triggerKeywords: ["promotion", "promoted", "senior", "lead", "manager", "advance"]
    },
    {
    id: "4",
    title: "Sweet Home",
    description: "Move out",
    category: "milestone",
    rarity: "legendary",
    triggerKeywords: ["move out", "apartment", "house", "home", "moved", "independent"]
    },
    {
    id: "5",
    title: "Dating",
    description: "Love at first sight",
    category: "social",
    rarity: "rare",
    triggerKeywords: ["dating", "relationship", "partner", "boyfriend", "girlfriend", "love"]
    },
    {
    id: "6",
    title: "Engaged",
    description: "Gotta put a ring on it",
    category: "social",
    rarity: "epic",
    triggerKeywords: ["engaged", "engagement", "propose", "ring", "fiancé", "fiancée"]
    },
    {
    id: "7",
    title: "Married",
    description: "Till death do us part",
    category: "social",
    rarity: "legendary",
    triggerKeywords: ["married", "wedding", "spouse", "husband", "wife", "marriage"]
    },
    {
    id: "8",
    title: "Parent",
    description: "Become a parent",
    category: "special",
    rarity: "epic",
    triggerKeywords: ["parent", "baby", "child", "father", "mother", "dad", "mom"]
    },
    {
    id: "9",
    title: "Grandparent",
    description: "Become a grandparent",
    category: "special",
    rarity: "legendary",
    triggerKeywords: ["grandparent", "grandchild", "grandmother", "grandfather", "grandma", "grandpa"]
    },
    {
    id: "10",
    title: "Retirement",
    description: "Retire and relax",
    category: "milestone",
    rarity: "epic",
    triggerKeywords: ["retirement", "retire", "retired", "pension", "golden years"]
    }
]

export const UserProgressProvider = ({ children }: { children: ReactNode }) => {
    const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({})
    const [unlockedAchievements, setUnlockedAchievements] = useState<Record<string, boolean>>({})

    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

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

  const [monthlyMilestones, setMonthlyMilestones] = useState<Milestone[]>([
    {
      id: "m1",
      year: "Now",
      title: "Current Month",
      description: "Focus on immediate goals and daily progress",
      image: "/modern-office-workspace.png",
      shortTermGoals: ["Complete weekly tasks", "Daily skill practice"],
      longTermGoals: ["Build consistent habits", "Track progress"],
      position: "top",
    },
    ...Array.from({ length: 11 }, (_, i) => {
      const monthIndex = (currentMonth + i + 1) % 12
      const yearOffset = Math.floor((currentMonth + i + 1) / 12)
      return {
        id: `m${i + 2}`,
        year: `${monthNames[monthIndex]} ${currentYear + yearOffset}`,
        title: `${monthNames[monthIndex]} Goals`,
        description: `Monthly objectives and milestones for ${monthNames[monthIndex]}`,
        image: undefined,
        shortTermGoals: ["Weekly targets", "Skill development"],
        longTermGoals: ["Monthly achievements", "Progress tracking"],
        position: (i % 2 === 0 ? "bottom" : "top") as "top" | "bottom",
      }
    }),
  ]) 

  const checkAchievements = (taskTitle: string) => {
    const taskTitleLower = taskTitle.toLowerCase()
    
    ACHIEVEMENTS.forEach(achievement => {
    //if already unlocked then skip
    if (unlockedAchievements[achievement.id]) 
        return

    const matchingKeyword = achievement.triggerKeywords.find(keyword => 
    taskTitleLower.includes(keyword.toLowerCase())
    )

    if (matchingKeyword) {
    setUnlockedAchievements(prev => ({
        ...prev,
        [achievement.id]: true
    }))

    //log achievement unlock (since alerts are blocked rn)
    console.log(`🎉 Achievement Unlocked: ${achievement.title}!`)
        }
    })
  }

  const toggleTask = (taskId: string, taskTitle?: string) => {
    setCompletedTasks(prev => {
        const newCompleted = !prev[taskId]
        
        //check for achievements
        if (newCompleted && taskTitle) {
        checkAchievements(taskTitle)
        }
        
        return {
        ...prev,
        [taskId]: newCompleted
        }
    })
  }

  const updateMilestone = (updatedMilestone: Milestone, isMonthly: boolean = false) => {
    if (isMonthly) {
        setMonthlyMilestones(prev => 
        prev.map(m => m.id === updatedMilestone.id ? updatedMilestone : m)
        )
    } 
    else {
        setMilestones(prev => 
        prev.map(m => m.id === updatedMilestone.id ? updatedMilestone : m)
        )
    }
  }

  const getAchievementProgress = () => {
    const totalAchievements = ACHIEVEMENTS.length
    const unlockedCount = Object.values(unlockedAchievements).filter(Boolean).length
    const milestonesCompleted = ACHIEVEMENTS
      .filter(a => a.category === 'milestone' && unlockedAchievements[a.id])
      .length

    return {
      totalAchievements,
      unlockedAchievements: unlockedCount,
      milestonesCompleted
    }
  }

  return (
    <UserProgressContext.Provider value={{ 
        completedTasks, 
        unlockedAchievements,
        milestones,
        monthlyMilestones,
        toggleTask, 
        checkAchievements,
        updateMilestone,
        getAchievementProgress
        }}>
    
    {children}
    </UserProgressContext.Provider>
    )
}

export const useUserProgress = () => {
    const context = useContext(UserProgressContext)
    if (!context) throw new Error("useUserProgress must be used within a UserProgressProvider")
    return context
}

export { ACHIEVEMENTS }