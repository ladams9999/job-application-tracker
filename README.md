# Welcome to Job Application Tracker

## Project info


## Environment Configuration

This project uses environment variables for configuration. A `.env.example` file is provided as a template.

### Setup

1. Copy the example file:
   ```sh
   cp .env.example .env
   ```

2. Edit `.env` with your actual values:
   ```sh
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Development Server Configuration
   SERVER_PORT=8080
   ```

### Available Environment Variables

- **`VITE_SUPABASE_URL`**: Your Supabase project URL
- **`VITE_SUPABASE_PUBLISHABLE_KEY`**: Your Supabase publishable key
- **`SERVER_PORT`**: Port for the development server (default: 8080)

### Usage Examples

```sh
# Default port (8080)
npm run dev

# Custom port via environment variable
SERVER_PORT=3000 npm run dev

# Or set in .env file
echo "SERVER_PORT=3000" >> .env
npm run dev
```

### Security Note

The `.env` file is excluded from git to protect sensitive information. Never commit actual credentials to the repository.

