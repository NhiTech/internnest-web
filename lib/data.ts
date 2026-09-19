import { supabase, isSupabaseConfigured } from './supabase';
import {
  FALLBACK_CITIES,
  FALLBACK_NEIGHBORHOODS,
  FALLBACK_LISTINGS,
  FALLBACK_TRANSPORT,
  FALLBACK_INTEREST_GROUPS,
  City,
  Neighborhood,
  Listing,
  TransportOption,
  InterestGroup
} from './fallback-data';

export async function getCities(): Promise<City[]> {
  if (!isSupabaseConfigured || !supabase) return FALLBACK_CITIES;
  
  try {
    const { data, error } = await supabase.from('cities').select('*');
    if (error) {
      console.warn('Supabase getCities error:', error.message);
      return FALLBACK_CITIES;
    }
    
    return data.map(row => ({
      id: row.id,
      name: row.name,
      state: row.state,
      emoji: row.emoji,
      lat: row.lat,
      lng: row.lng,
      avgRent: row.avg_rent,
      color: row.color,
      listings: row.listings ?? 0,
      groups: row.groups ?? 0
    }));
  } catch (err) {
    console.warn('Failed to fetch cities from Supabase:', err);
    return FALLBACK_CITIES;
  }
}

export async function getNeighborhoods(cityId: string): Promise<Neighborhood[]> {
  const fallback = FALLBACK_NEIGHBORHOODS[cityId]?.neighborhoods ?? [];
  if (!isSupabaseConfigured || !supabase) return fallback;

  try {
    const { data, error } = await supabase.from('neighborhoods').select('*').eq('city_id', cityId);
    if (error) {
      console.warn(`Supabase getNeighborhoods error for city ${cityId}:`, error.message);
      return fallback;
    }
    
    return data.map(row => ({
      name: row.name,
      vibe: row.vibe,
      avgRent: row.avg_rent,
      commuteScore: row.commute_score,
      safetyScore: row.safety_score,
      costScore: row.cost_score,
      transitNotes: row.transit_notes,
      bestFor: row.best_for,
      buildings: row.buildings,
      walkability: row.walkability,
      highlight: row.highlight,
      color: row.color
    }));
  } catch (err) {
    console.warn(`Failed to fetch neighborhoods for city ${cityId}:`, err);
    return fallback;
  }
}

export async function getListings(cityId: string): Promise<Listing[]> {
  const fallback = FALLBACK_LISTINGS[cityId] ?? [];
  if (!isSupabaseConfigured || !supabase) return fallback;

  try {
    const { data, error } = await supabase.from('listings').select('*').eq('city_id', cityId);
    if (error) {
      console.warn(`Supabase getListings error for city ${cityId}:`, error.message);
      return fallback;
    }
    
    return data.map(row => ({
      id: row.id,
      title: row.title,
      price: row.price,
      type: row.type,
      dates: row.dates,
      amenities: row.amenities,
      poster: row.poster_name,
      posterCompany: row.poster_company,
      verified: row.verified,
      img: row.img,
      link: row.link ?? undefined,
      transport: row.transport ?? undefined,
      neighborhood: row.neighborhood ?? undefined,
    }));
  } catch (err) {
    console.warn(`Failed to fetch listings for city ${cityId}:`, err);
    return fallback;
  }
}

export async function getTransport(cityId: string): Promise<TransportOption[]> {
  const fallback = FALLBACK_TRANSPORT[cityId] ?? [];
  if (!isSupabaseConfigured || !supabase) return fallback;

  try {
    const { data, error } = await supabase.from('transport').select('*').eq('city_id', cityId);
    if (error) {
      console.warn(`Supabase getTransport error for city ${cityId}:`, error.message);
      return fallback;
    }
    
    return data.map(row => ({
      mode: row.mode,
      icon: row.icon,
      desc: row.desc,
      cost: row.cost,
      tip: row.tip
    }));
  } catch (err) {
    console.warn(`Failed to fetch transport for city ${cityId}:`, err);
    return fallback;
  }
}

export async function getInterestGroups(cityId: string): Promise<InterestGroup[]> {
  const fallback = FALLBACK_INTEREST_GROUPS[cityId] ?? [];
  if (!isSupabaseConfigured || !supabase) return fallback;

  try {
    const { data, error } = await supabase.from('interest_groups').select('*').eq('city_id', cityId);
    if (error) {
      console.warn(`Supabase getInterestGroups error for city ${cityId}:`, error.message);
      return fallback;
    }
    
    return data.map(row => ({
      name: row.name,
      members: row.members,
      emoji: row.emoji,
      category: row.category,
      link: row.link ?? undefined,
    }));
  } catch (err) {
    console.warn(`Failed to fetch interest groups for city ${cityId}:`, err);
    return fallback;
  }
}
