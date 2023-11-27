export type Environment = {
  SYPHON_CODILITY_HOST?: string;
  SYPHON_CODILITY_TOKEN?: string;
  SYPHON_EMAIL_HOST?: string;
  SYPHON_EMAIL_TOKEN?: string;
  // syphon email address where emails are sent from
  SYPHON_EMAIL_FROM?: string;
};

export const environment = process.env as Environment;
