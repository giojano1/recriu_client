export const queryKeys = {
  // User-related queries
  user: {
    all: ["user"] as const,
    current: () => [...queryKeys.user.all, "current"] as const,
  },

  // Company-related queries (for future use)
  company: {
    all: ["company"] as const,
    current: () => [...queryKeys.company.all, "current"] as const,
    detail: (id: string) => [...queryKeys.company.all, "detail", id] as const,
  },

  // Add more feature keys as needed
} as const;
