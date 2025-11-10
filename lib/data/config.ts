const config = {
  env: {
    nextPublicUrl: process.env.NEXT_PUBLIC_URL! || 'http://localhost:3000',
    databaseUrl: process.env.DATABASE_URL!,
    // resendApiKey: process.env.RESEND_API_KEY!,
    // google: {
    //   clientId: process.env.AUTH_GOOGLE_ID!,
    //   secretKey: process.env.AUTH_GOOGLE_SECRET!,
    // },
    // uploadthing: process.env.UPLOADTHING_TOKEN!,
  },
};

export default config;
