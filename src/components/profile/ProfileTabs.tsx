"use client"

import type { ReactNode } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface ProfileTabItem {
  value: string
  label: string
  content: ReactNode
}

export function ProfileTabs({
  tabs,
  defaultValue,
}: {
  tabs: ProfileTabItem[]
  defaultValue?: string
}) {
  return (
    <Tabs defaultValue={defaultValue ?? tabs[0]?.value} className="w-full">
      <TabsList className="flex w-full flex-wrap justify-start gap-1">
        {tabs.map((t) => (
          <TabsTrigger key={t.value} value={t.value}>
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((t) => (
        <TabsContent key={t.value} value={t.value} className="mt-6">
          {t.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}
