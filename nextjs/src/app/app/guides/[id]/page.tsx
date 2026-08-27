'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { BookOpen, Tag, ArrowLeft, Calendar, User, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageProvider';
import { useParams } from 'next/navigation';

const guides: Record<string, {
  id: string;
  title: string;
  description: string;
  category: 'dismantled' | 'spiritual' | 'general' | 'events';
  content: string;
  publishDate: string;
  author?: string;
  externalUrl?: string;
}> = {
  'dismantled-basics': {
    id: 'dismantled-basics',
    title: 'Playing with Dismantled Items - Basics',
    description: 'Learn the fundamentals of using dismantled items in Guns of Glory. Understand how to obtain, upgrade, and effectively use dismantled equipment.',
    category: 'dismantled',
    content: `# Playing with Dismantled Items - Basics

## What are Dismantled Items?
Dismantled items are equipment pieces that have been broken down into their component parts. In Guns of Glory, these can be obtained from various sources and reassembled or used for crafting.

## How to Obtain Dismantled Items
1. **Dismantling Equipment**: Use the Blacksmith to dismantle unwanted equipment
2. **Event Rewards**: Some events grant dismantled item fragments
3. **Alliance Gifts**: Alliance members may gift dismantled components
4. **Store Purchases**: Special packs may contain dismantled items

## Best Practices
- Keep spiritual power low while dismantling
- Focus on dismantling items you won't use
- Save rare components for high-tier equipment
- Check kingdom rules before trading components`,
    publishDate: '2024-01-15',
    author: 'Kingdom Council'
  },
  'dismantled-advanced': {
    id: 'dismantled-advanced',
    title: 'Advanced Dismantled Item Strategies',
    description: 'Advanced techniques for maximizing value from dismantled items, including optimal crafting paths and resource management.',
    category: 'dismantled',
    content: `# Advanced Dismantled Item Strategies

## Crafting Optimization
- Prioritize crafting equipment that matches your troop type
- Use dismantled components to fill gaps in your gear sets
- Time crafting with kingdom events for bonus rewards

## Resource Management
- Track component inventory weekly
- Trade excess components with trusted alliance members
- Set spiritual power thresholds for dismantling activities

## Kingdom Coordination
- Coordinate dismantling schedules with kingdom leadership
- Share surplus components with members who need them
- Report spiritual power levels after major dismantling sessions`,
    publishDate: '2024-02-20',
    author: 'Senior Strategist'
  },
  'spiritual-power-management': {
    id: 'spiritual-power-management',
    title: 'Spiritual Power Management Guide',
    description: 'Comprehensive guide on maintaining low spiritual power as required by kingdom rules. Includes thresholds, monitoring, and compliance strategies.',
    category: 'spiritual',
    content: `# Spiritual Power Management Guide

## Why Keep Spiritual Power Low?
High spiritual power attracts unwanted attention and can trigger kingdom-wide events that are detrimental to all members. The kingdom enforces a strict threshold.

## Kingdom Threshold
- **Maximum Allowed**: 1,000,000 spiritual power
- **Recommended**: Stay below 500,000 for safety margin
- **Monitoring**: Weekly screenshots required

## Strategies to Maintain Low Power
1. **Regular Dismantling**: Break down high-power equipment
2. **Troop Management**: Avoid over-training high-tier troops
3. **Research Timing**: Delay spiritual research until necessary
4. **Equipment Choices**: Use lower-tier equipment when possible

## Compliance Checklist
- [ ] Weekly screenshot uploaded
- [ ] Power value below threshold
- [ ] No sudden spikes detected
- [ ] Alliance leader notified of changes`,
    publishDate: '2024-01-10',
    author: 'Kingdom Enforcer'
  },
  'general-strategy': {
    id: 'general-strategy',
    title: 'General Kingdom Strategy',
    description: 'Overall strategy guide for kingdom members covering resource management, alliance cooperation, and long-term growth.',
    category: 'general',
    content: `# General Kingdom Strategy

## Resource Management
- Balance resource production with consumption
- Prioritize food and wood for troop training
- Use gold for research and building upgrades

## Alliance Cooperation
- Participate in alliance events daily
- Help allies with building and research
- Coordinate attacks during kingdom events

## Long-term Growth
- Set monthly goals for each member
- Track progress with shared spreadsheets
- Adjust strategies based on kingdom performance`,
    publishDate: '2024-03-01',
    author: 'Kingdom Leader'
  },
  'event-guide': {
    id: 'event-guide',
    title: 'Event Participation Guide',
    description: 'How to maximize rewards from kingdom events while maintaining spiritual power compliance.',
    category: 'events',
    content: `# Event Participation Guide

## Event Types
1. **Killing Events**: Focus on low-power targets
2. **Gathering Events**: Coordinate with alliance for efficiency
3. **Training Events**: Plan troop queues in advance
4. **Research Events**: Time spiritual research carefully

## Spiritual Power During Events
- Events often temporarily increase spiritual power
- Plan dismantling sessions before major events
- Monitor power levels daily during event weeks
- Have emergency dismantling plan ready

## Maximizing Rewards
- Complete all daily event tasks
- Coordinate with alliance for group objectives
- Save speedups for event boost periods
- Track personal and alliance rankings`,
    publishDate: '2024-03-15',
    author: 'Event Coordinator'
  }
};

const categoryLabels: Record<string, string> = {
  dismantled: 'Dismantled Items',
  spiritual: 'Spiritual Power',
  general: 'General Strategy',
  events: 'Events'
};

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  dismantled: BookOpen,
  spiritual: Tag,
  general: ArrowRight,
  events: ChevronRight
};

export default function GuideDetailPage() {
  const params = useParams();
  const { t } = useLanguage();
  const guide = guides[params.id as string];

  if (!guide) {
    return (
      <div className="space-y-6 p-6">
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Guide not found</p>
            <Link href="/app/guides" className="btn btn-primary mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Guides
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CategoryIcon = categoryIcons[guide.category] || BookOpen;

  return (
    <div className="space-y-6 p-6">
      <Link href="/app/guides" className="btn btn-outline inline-flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        {t('guides.readMore') || 'Back to Guides'}
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700 mb-2 inline-block">
                {t('guides.categories.' + guide.category) || categoryLabels[guide.category]}
              </span>
              <CardTitle className="text-2xl">{guide.title}</CardTitle>
            </div>
            <CategoryIcon className="h-8 w-8 text-primary-500" />
          </div>
          <CardDescription>{guide.description}</CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(guide.publishDate).toLocaleDateString()}
            </span>
            {guide.author && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                by {guide.author}
              </span>
            )}
          </div>
          
          <div className="space-y-4 whitespace-pre-wrap text-gray-800 dark:text-gray-200 leading-relaxed">
            {guide.content.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line.startsWith('# ') && (
                  <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-gray-100">
                    {line.replace('# ', '')}
                  </h1>
                )}
                {line.startsWith('## ') && (
                  <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-800 dark:text-gray-200">
                    {line.replace('## ', '')}
                  </h2>
                )}
                {line.startsWith('### ') && (
                  <h3 className="text-xl font-bold mt-4 mb-2 text-gray-700 dark:text-gray-300">
                    {line.replace('### ', '')}
                  </h3>
                )}
                {line.startsWith('- [ ]') && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    <span>{line.replace('- [ ]', '').trim()}</span>
                  </label>
                )}
                {line.startsWith('- ') && !line.startsWith('- [ ]') && (
                  <p className="flex items-center gap-2 ml-4">
                    <span className="h-2 w-2 rounded-full bg-gray-400" />
                    {line.replace('- ', '').trim()}
                  </p>
                )}
                {line.match(/^\d+\./) && (
                  <p className="ml-4">{line}</p>
                )}
                {!line.startsWith('#') && !line.startsWith('-') && !line.match(/^\d+\./) && line.trim() !== '' && (
                  <p>{line}</p>
                )}
                {line.trim() === '' && <br />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Link href="/app/guides" className="btn btn-outline flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('guides.readMore') || 'Back to Guides'}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}