export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      attendances: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          nip: string;
          position: string;
          institution: string;
          region: string;
          department: string;
          signature: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          nip: string;
          position: string;
          institution: string;
          region: string;
          department: string;
          signature: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          nip?: string;
          position?: string;
          institution?: string;
          region?: string;
          department?: string;
          signature?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
