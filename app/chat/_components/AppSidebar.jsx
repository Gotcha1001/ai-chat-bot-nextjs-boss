"use client"
import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ChartAreaIcon, ChartBar, ChartBarBigIcon, ChartBarIcon, ChartBarStacked, LayoutDashboard, Settings2Icon, WalletCards } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import FeatureMotionWrapper from '@/app/components/FramerMotion/FeatureMotionWrapperMap'




export function AppSidebar() {

    const path = usePathname()
    console.log(path)

    const MenuOptions = [
        {
            title: 'Default Chat',
            icon: LayoutDashboard,
            path: '/chat'
        },
        {
            title: 'Chosen Ai Mood',
            icon: ChartBarIcon,
            path: '/chat/open-ai'
        },
        // {
        //     title: 'OpenAI Chat Funny',
        //     icon: ChartBarBigIcon,
        //     path: '/chat/funny'
        // },
        // {
        //     title: 'Gemmini Sarcastic',
        //     icon: ChartBarStacked,
        //     path: '/chat/sarcastic'
        // },
        {
            title: 'My Chats History',
            icon: ChartAreaIcon,
            path: '/chat/my-chats'
        },
        {
            title: 'Billing',
            icon: WalletCards,
            path: '/chat/billing'
        },
        {
            title: 'Settings',
            icon: Settings2Icon,
            path: '/chat/settings'
        },

    ]

    return (
        <Sidebar>
            <SidebarHeader className="bg-gradient-to-r from-purple-950 via-indigo-600 to-teal-600 flex items-center py-5">
                <Link href="/">
                    <Image src="/logos.jpg" alt="Logo" height={250} width={300} className="rounded-lg" />
                </Link>

            </SidebarHeader>
            <SidebarContent className="gradient-background2">
                <SidebarGroup>
                    <Button className="mt-5" >+ Create New Chat</Button>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className={'text-white'}>Applications</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {MenuOptions.map((menu, index) => (
                                <FeatureMotionWrapper key={index} index={index}>

                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild className="p-5">
                                            <a href={menu.path} className={`text-white text-[17px] ${path == menu.path && "text-primary bg-indigo-500"}`}>
                                                <menu.icon className="h-10 w-10" />
                                                <span>{menu.title}</span>
                                            </a>

                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </FeatureMotionWrapper>

                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}