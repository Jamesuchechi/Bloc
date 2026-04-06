import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export interface SearchResult {
  id: string;
  type: 'session' | 'log' | 'client' | 'proposal';
  title: string;
  subtitle?: string;
  path: string;
}

export function useGlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const q = `%${searchQuery}%`;

    try {
      const [
        { data: sessions },
        { data: logs },
        { data: clients },
        { data: proposals }
      ] = await Promise.all([
        supabase
          .from('sessions')
          .select('id, title, notes')
          .or(`title.ilike.${q},notes.ilike.${q}`)
          .limit(5),
        supabase
          .from('log_entries')
          .select('id, description')
          .ilike('description', q)
          .limit(5),
        supabase
          .from('clients')
          .select('id, name, company, email')
          .or(`name.ilike.${q},company.ilike.${q},email.ilike.${q}`)
          .limit(5),
        supabase
          .from('proposals')
          .select('id, title, scope')
          .or(`title.ilike.${q},scope.ilike.${q}`)
          .limit(5)
      ]);

      const formattedResults: SearchResult[] = [
        ...(sessions?.map(s => ({
          id: s.id,
          type: 'session' as const,
          title: s.title,
          subtitle: s.notes?.substring(0, 50),
          path: `/focus?session=${s.id}`
        })) || []),
        ...(logs?.map(l => ({
          id: l.id,
          type: 'log' as const,
          title: l.description.substring(0, 60),
          subtitle: 'Log Entry',
          path: `/log`
        })) || []),
        ...(clients?.map(c => ({
          id: c.id,
          type: 'client' as const,
          title: c.name,
          subtitle: c.company || c.email,
          path: `/clients/${c.id}`
        })) || []),
        ...(proposals?.map(p => ({
          id: p.id,
          type: 'proposal' as const,
          title: p.title,
          subtitle: p.scope?.substring(0, 50),
          path: `/proposals`
        })) || [])
      ];

      setResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  return { query, setQuery, results, loading };
}
