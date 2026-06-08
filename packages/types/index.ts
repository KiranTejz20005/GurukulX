export interface User {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  customDomain?: string | null;
}

// Re-export common types
export enum Role {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  INSTRUCTOR = "INSTRUCTOR",
  STUDENT = "STUDENT"
}
