import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { resolveSiteImageUrl } from '@/features/siteImages/queries';
import type { Milestone } from '@/sections/about/TimelineNode';
import type { TeamMember } from '@/types';

export { resolveSiteImageUrl };

export function useMilestones() {
  return useQuery({
    queryKey: ['milestones'],
    queryFn: async () => {
      const { data, error } = await supabase.from('milestones').select('*').eq('active', true).order('position');
      if (error) throw error;
      return (data as MilestoneRow[]).map(toMilestone);
    },
  });
}

export function useMilestoneRows() {
  return useQuery({
    queryKey: ['milestones-all'],
    queryFn: async () => {
      const { data, error } = await supabase.from('milestones').select('*').order('position');
      if (error) throw error;
      return data as MilestoneRow[];
    },
  });
}

export function useTeamMembers() {
  return useQuery({
    queryKey: ['team-members'],
    queryFn: async () => {
      const { data, error } = await supabase.from('team_members').select('*').eq('active', true).order('position');
      if (error) throw error;
      return (data as TeamRow[]).map(toTeamMember);
    },
  });
}

export function useTeamRows() {
  return useQuery({
    queryKey: ['team-rows'],
    queryFn: async () => {
      const { data, error } = await supabase.from('team_members').select('*').order('position');
      if (error) throw error;
      return data as TeamRow[];
    },
  });
}

interface MilestoneRow {
  id: string;
  position: number;
  year: string;
  title: string;
  place: string;
  description: string;
  image_url: string;
  alt: string;
  active: boolean;
}

interface TeamRow {
  id: string;
  position: number;
  name: string;
  role: string;
  bio: string;
  avatar_url: string;
  favorite: string | null;
  active: boolean;
}

function toMilestone(row: MilestoneRow): Milestone {
  return {
    year: row.year,
    title: row.title,
    place: row.place,
    description: row.description,
    image: resolveSiteImageUrl(row.image_url) || '/assets/vaso-cafe.webp',
    alt: row.alt || row.title,
  };
}

function toTeamMember(row: TeamRow): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    avatar: resolveSiteImageUrl(row.avatar_url) || row.avatar_url,
    favorite: row.favorite ?? undefined,
  };
}
