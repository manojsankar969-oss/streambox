# StreamBox - Your IMDB Clone

StreamBox is a full-featured movie and TV show discovery platform built with Next.js 15, Supabase, and the TMDB API.

![StreamBox Banner](https://via.placeholder.com/1200x400?text=StreamBox)

## Features

- **Movie Discovery** - Browse popular, top-rated, trending, and upcoming movies
- **TV Shows** - Explore popular TV shows with detailed information
- **Actors & Celebrities** - View actor profiles and filmography
- **User Authentication** - Sign up/login with Supabase Auth
- **Watchlist** - Save movies and TV shows to your personal watchlist
- **Reviews & Ratings** - Write and read user reviews and ratings
- **Advanced Search** - Search across movies, TV shows, and actors
- **Dark/Light Theme** - Toggle between themes
- **Responsive Design** - Works on all devices

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library |
| **Tailwind CSS** | Styling |
| **Supabase** | Database & Authentication |
| **TMDB API** | Movie & TV data |
| **TanStack Query** | Data fetching & caching |
| **Vercel** | Deployment |

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- TMDB API key (optional - comes with a default key)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/streambox.git
cd streambox
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

### Database Setup

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Copy and paste the contents of `supabase/schema.sql`
5. Run the SQL

## Project Structure

```
streambox/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── movies/             # Movies pages
│   │   ├── tv/                # TV Shows pages
│   │   ├── actors/             # Actors pages
│   │   ├── search/             # Search page
│   │   ├── watchlist/          # Watchlist page
│   │   ├── profile/            # Profile page
│   │   ├── login/             # Login page
│   │   └── register/           # Register page
│   ├── components/            # React components
│   │   ├── layout/            # Layout components (Navbar, Footer)
│   │   ├── movies/            # Movie-related components
│   │   └── ui/                # UI components
│   ├── lib/                   # Libraries
│   │   ├── supabase/          # Supabase client
│   │   └── tmdb/              # TMDB API client
│   └── hooks/                  # Custom React hooks
├── supabase/
│   └── schema.sql              # Database schema
├── public/                     # Static files
└── ...config files
```

## Environment Variables

| Variable | Description | Required |
|---------|-------------|----------|
| `NEXT_PUBLIC_TMDB_API_KEY` | TMDB API key | No (has default) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Docker

```bash
docker-compose up -d
```

## API Routes

### Movies
- `GET /api/movies/popular` - Popular movies
- `GET /api/movies/trending` - Trending movies
- `GET /api/movies/[id]` - Movie details

### TV Shows
- `GET /api/tv/popular` - Popular TV shows
- `GET /api/tv/trending` - Trending TV shows
- `GET /api/tv/[id]` - TV show details

### Search
- `GET /api/search?q=&type=` - Search all content

### User
- `POST /api/watchlist` - Add to watchlist
- `DELETE /api/watchlist` - Remove from watchlist
- `POST /api/reviews` - Add review
- `DELETE /api/reviews` - Delete review

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for providing the API
- [Supabase](https://supabase.com/) for database and authentication
- [Vercel](https://vercel.com/) for hosting
- All open-source contributors

## Support

If you found this helpful, please give it a ⭐

---

Built with ❤️ by StreamBox Team