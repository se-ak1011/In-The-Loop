export const AppConfig = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  aiSummaryEndpoint: process.env.EXPO_PUBLIC_AI_SUMMARY_ENDPOINT ?? '',
} as const;

export const hasSupabaseConfig = Boolean(AppConfig.supabaseUrl && AppConfig.supabaseAnonKey);
export const hasAiSummaryEndpoint = Boolean(AppConfig.aiSummaryEndpoint);
