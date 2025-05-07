"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface TrendingTopic {
  id: number
  name: string
  posts: number
}

interface TrendingTopicsProps {
  topics: TrendingTopic[]
  onTopicClick: (topicName: string) => void
}

export function TrendingTopics({ topics, onTopicClick }: TrendingTopicsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <h3 className="text-lg font-semibold">Chủ đề thịnh hành</h3>
      </CardHeader>
      <CardContent className="space-y-2">
        {topics.map((topic) => (
          <div
            key={topic.id}
            className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-slate-50 dark:hover:bg-slate-800"
            onClick={() => onTopicClick(topic.name)}
          >
            <div className="font-medium text-blue-500">{topic.name}</div>
            <div className="text-xs text-slate-500">{topic.posts} posts</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
