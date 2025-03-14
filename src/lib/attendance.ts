import { supabase, isMockSupabase } from "./supabase";
import type { Database } from "./database.types";

export interface AttendanceData {
  name: string;
  nip: string;
  position: string;
  institution: string;
  region: string;
  department: string;
  signature: string;
  created_at?: string;
  id?: string;
}

// Mock data for development when Supabase is not configured
let mockAttendances: AttendanceData[] = [];

export async function saveAttendance(data: AttendanceData) {
  try {
    // Use mock implementation if Supabase is not configured
    if (isMockSupabase) {
      console.log("Using mock implementation for saveAttendance");
      const newAttendance = {
        ...data,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
      };
      mockAttendances.unshift(newAttendance);
      return { success: true, data: [newAttendance] };
    }

    console.log("Using Supabase implementation for saveAttendance");
    // Real Supabase implementation
    const { data: result, error } = await supabase
      .from("attendances")
      .insert([
        {
          name: data.name,
          nip: data.nip,
          position: data.position,
          institution: data.institution,
          region: data.region,
          department: data.department,
          signature: data.signature,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    return { success: true, data: result };
  } catch (error) {
    console.error("Error saving attendance:", error);
    return { success: false, error };
  }
}

export async function getAttendances() {
  try {
    // Use mock implementation if Supabase is not configured
    if (isMockSupabase) {
      console.log("Using mock implementation for getAttendances");
      return { success: true, data: mockAttendances };
    }

    console.log("Using Supabase implementation for getAttendances");
    // Real Supabase implementation
    const { data, error } = await supabase
      .from("attendances")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }
    return { success: true, data };
  } catch (error) {
    console.error("Error fetching attendances:", error);
    return { success: false, error };
  }
}
