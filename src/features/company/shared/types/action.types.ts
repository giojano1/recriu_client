/**
 * Action result type for company creation
 * Discriminated union for type-safe error handling
 */
export type CreateCompanyActionResult =
  | {
      success: true;
      companyId: string;
      redirectUrl: string;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Backend API response type for company creation
 */
export type CreateCompanyResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    slug: string;
    website?: string;
    size: string;
    createdAt?: string;
    updatedAt?: string;
  };
};
