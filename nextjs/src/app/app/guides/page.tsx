'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { BookOpen, ArrowRight, Tag, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/lib/LanguageProvider';

interface Guide {
  id: string;
  title: string;
  description: string;
  category: 'dismantled' | 'spiritual' | 'general' | 'events';
  content: string;
  publishDate: string;
  author?: string;
  externalUrl?: string;
}

const guides: Guide[] = [
  {
    id: 'dismantled-basics',
    title: 'Playing with Dismantled Items - Basics',
    description: 'Learn the fundamentals of using dismantled items in Guns of Glory. Understand how to obtain, upgrade, and effectively use dismantled equipment.',
    category: 'dismantled',
    content: `
# Playing with Dismantled Items - Basics

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
- Check kingdom rules before trading components
`,
    publishDate: '2024-01-15',
    author: 'Kingdom Council'
  },
  {
    id: 'dismantled-advanced',
    title: 'Advanced Dismantled Item Strategies',
    description: 'Advanced techniques for maximizing value from dismantled items, including optimal crafting paths and resource management.',
    category: 'dismantled',
    content: `
# Advanced Dismantled Item Strategies

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
- Report spiritual power levels after major dismantling sessions
`,
    publishDate: '2024-02-20',
    author: 'Senior Strategist'
  },
  {
    id: 'spiritual-power-management',
    title: 'Spiritual Power Management Guide',
    description: 'Comprehensive guide on maintaining low spiritual power as required by kingdom rules. Includes thresholds, monitoring, and compliance strategies.',
    category: 'spiritual',
    content: `
# Spiritual Power Management Guide

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
- [ ] Alliance leader notified of changes
`,
    publishDate: '2024-01-10',
    author: 'Kingdom Enforcer'
  },
  {
    id: 'general-strategy',
    title: 'General Kingdom Strategy',
    description: 'Overall strategy guide for kingdom members covering resource management, alliance cooperation, and long-term growth.',
    category: 'general',
    content: `
# General Kingdom Strategy

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
- Adjust strategies based on kingdom performance
`,
    publishDate: '2024-03-01',
    author: 'Kingdom Leader'
  },
  {
    id: 'event-guide',
    title: 'Event Participation Guide',
    description: 'How to maximize rewards from kingdom events while maintaining spiritual power compliance.',
    category: 'events',
    content: `
# Event Participation Guide

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
- Track personal and alliance rankings
`,
    publishDate: '2024-03-15',
    author: 'Event Coordinator'
  }
];

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

export default function GuidesPage() {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGuides = guides.filter(guide => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', 'dismantled', 'spiritual', 'general', 'events'];

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('guides.title') || 'Game Guides'}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary-600" />
            {t('guides.subtitle') || 'Learn how to play with dismantled items and other strategies'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('guides.search') || 'Search guides...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input input-bordered w-full pl-10"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      selectedCategory === cat
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? t('guides.categories.all') || 'All' : t('guides.categories.' + cat) || categoryLabels[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Guides Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredGuides.map((guide) => {
                const CategoryIcon = categoryIcons[guide.category] || BookOpen;
                return (
                  <Card key={guide.id} className="h-full hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary-100 text-primary-700 mb-2 inline-block">
                            {t('guides.categories.' + guide.category) || categoryLabels[guide.category]}
                          </span>
                          <CardTitle className="text-lg">{guide.title}</CardTitle>
                        </div>
                        <CategoryIcon className="h-5 w-5 text-primary-500" />
                      </div>
                      <CardDescription>{guide.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground mb-4">
                        {guide.content.split('\n').filter(Boolean).slice(0, 3).join('\n')}{guide.content.split('\n').length > 3 ? '...' : ''}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          <Tag className="inline h-3 w-3 mr-1" />
                          {t('guides.publishDate') || 'Published'}: {new Date(guide.publishDate).toLocaleDateString()}
                        </span>
                        {guide.author && <span>by {guide.author}</span>}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Link
                        href={`/app/guides/${guide.id}`}
                        className="btn btn-primary btn-sm flex items-center gap-1"
                      >
                        {t('guides.readMore') || 'Read More'}
                        <ChevronRight className="h-3 w-3" />
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>

            {filteredGuides.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t('guides.noGuides') || 'No guides available yet'}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}