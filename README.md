# Welcome to Job Application Tracker

## Project info

This project originally started as an attempt to vibe code using Lovable.  Lovable came up with a halfway decent prototype UI, but couldn't get anything else right, so I've stopped using it.  Instead, I've been throwing coding tools at the mess in an attempt to fix it, and to give me a feel for their unique strengths and weaknesses.  Each fork has their own branch here in this repo.  Somewhere along the line I may split into separate repos, but not today:

`using-cline`: Cline - primarily using gpt-4.1

`using-copilot`: Github Copilot - primarily using o4-mini

`using-warp`: Warp - using Claude 4 Sonnet

### Paused
`using-codex`: ChatGPT Codex - using codex-1 (o3)

## How can I run this code?

I can't guarantee `main` or any of the above branches will be in a working state.  In the future I may try to guarantee `main` works, but again, not today. 

Nominally, follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up environment variables (see Environment Configuration below).
cp .env.example .env
# Edit .env with your actual configuration values

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

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
- **`VITE_SUPABASE_ANON_KEY`**: Your Supabase anonymous key
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

