# EA-H-system

Agile-based TA (Teaching Assistant) Recruitment System for BUPT International School.

A Java Web application built with Jakarta Servlet 5.0, providing core hiring workflows for TAs, MOs (Module Organizers), and administrators. Uses text-file data storage (JSON) and optional AI-powered skill matching and career suggestion features.

## Features

- **Three user roles**: TA (applicant), MO (job publisher/reviewer), Admin (system manager)
- **Job lifecycle**: Posting, searching, applying, reviewing, and filling positions
- **In-app messaging**: Direct communication between TAs and MOs
- **AI-powered recommendation**: Vector-embedding-based job-TA matching
- **AI career suggestions**: Personalized advice for TAs based on recommended positions
- **Profile management**: PDF upload/download for TA profiles with privacy controls
- **Admin dashboard**: User and job management

## Tech Stack

| Component         | Technology                      |
|-------------------|---------------------------------|
| Language          | Java (JDK 8+)                   |
| Web Framework     | Jakarta Servlet 5.0 (EE 9)      |
| JSON Handling     | Gson + gson-extras              |
| HTTP Client       | Apache HttpClient 4.5           |
| File I/O          | Apache Commons IO 2.15          |
| Build Tool        | Maven 3.6+                      |
| Web Server        | Apache Tomcat 10.1.x            |
| Frontend          | HTML5, CSS3, Vanilla JavaScript |
| Data Storage      | JSON files (no database)        |

## Prerequisites

- **JDK**: 8 or higher
- **Maven**: 3.6 or higher
- **Tomcat**: 10.1.x (Jakarta EE 9 required; Tomcat 9 and below are incompatible)
- **API Tokens** (optional, for AI features):
  - `EMBEDDING_API_TOKEN` — for AI job/TA matching and recommendation
  - `AI_API_TOKEN` — for AI-powered career suggestions (OpenAI-compatible API)

## Quick Start

### 1. Build

```bash
mvn clean package
```

This generates `target/tapj.war`.

### 2. Configure (Optional)

Copy `src/main/webapp/WEB-INF/data/config.properties.example` to `config.properties` in the same directory and fill in your API tokens:

```properties
EMBEDDING_API_TOKEN=your_token_here
AI_API_TOKEN=your_token_here
AI_API_URL=https://api.openai.com/v1/chat/completions
AI_API_MODEL=gpt-3.5-turbo
```

Alternatively, set the tokens as environment variables (`EMBEDDING_API_TOKEN`, `AI_API_TOKEN`, etc.).

### 3. Deploy

Deploy `target/tapj.war` to Tomcat 10.1.x's `webapps` directory, or use the Tomcat Manager app.

### 4. Access

Open a browser and go to `http://localhost:8080/tapj/`

## Configuration Reference

| Key               | Required For              | Fallback                     |
|-------------------|---------------------------|------------------------------|
| `EMBEDDING_API_TOKEN` | AI matching / recommendation | env var `EMBEDDING_API_TOKEN` |
| `AI_API_TOKEN`        | AI suggestion (`/suggestion`) | env var `AI_API_TOKEN`         |
| `AI_API_URL`          | Custom API endpoint       | `https://api.openai.com/v1/chat/completions` |
| `AI_API_MODEL`        | Model selection           | `gpt-3.5-turbo`              |

## Project Structure

```
src/main/
├── java/com/
│   ├── example/HelloServlet.java       # Health check endpoint
│   └── qm/bupt/
│       ├── dao/                         # Data access layer (BaseDAO + entity DAOs)
│       ├── dto/                         # Data transfer objects
│       ├── entity/                      # Domain models (User, TA, MO, Admin, Job, etc.)
│       │   └── enums/                   # Enumerations (UserType, ApplyStatus, JobStatus)
│       ├── filter/                      # Servlet filters (Auth, Encoding)
│       ├── listener/                    # Servlet context listener (SystemInit)
│       ├── service/                     # Business logic interfaces + implementations
│       └── servlet/                     # HTTP controllers (action-based routing)
└── webapp/
    ├── *.html                           # SPA-style pages (admin, ta, mo, guest, etc.)
    ├── *.css / *.js                     # Per-page styles and scripts
    └── WEB-INF/
        ├── web.xml                      # Web app configuration
        └── data/                        # JSON data files (users, jobs, applications, etc.)
```

## API Documentation

See [api.md](api.md) for the complete API reference.

All endpoints use `?action=` parameter dispatch and return a unified JSON response:

```json
{
  "code": 200,
  "msg": "success",
  "data": { ... }
}
```

| Servlet          | Path            | Actions |
|------------------|-----------------|---------|
| UserServlet      | `/user`         | 9       |
| JobServlet       | `/job`          | 7       |
| ApplicationServlet | `/application` | 5     |
| MessageServlet   | `/message`      | 5       |
| AdminServlet     | `/admin`        | 5       |
| RecommendServlet | `/recommend`    | 2       |
| EmbeddingServlet | `/embedding`    | 4       |
| SuggestionServlet| `/suggestion`   | 1       |

## Team

| Name              | GitHub Username       | QMID      |
|-------------------|-----------------------|-----------|
| Ruikai Xiao       | EchoWind-dev          | 231223900 |
| Peng Wen          | tomatooooo34          | 231223760 |
| Yunyun Wan        | MacmillanceSylvia     | 231224055 |
| Hang Yu-big       | boliliemeng           | 231223896 |
| Shizhe Wang       | zuizuizuizuifai69     | 231223944 |
| Hang Yu-mini      | yh6102                | 231223874 |

## License

MIT License
