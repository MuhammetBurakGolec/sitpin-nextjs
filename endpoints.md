# Bookmark Manager API Endpoints

## 🔐 Authentication
All endpoints require Clerk JWT token in Authorization header:
```
Authorization: Bearer <clerk_jwt_token>
```

## 📚 Bookmarks API

### GET /api/bookmarks
Get user's bookmarks with optional filtering
```javascript
// Query Parameters:
// - userId: string (required)
// - categoryId?: string (optional filter)
// - search?: string (optional search in title/url/description)

// Request:
GET /api/bookmarks?userId=user_2abc123&categoryId=cat_1&search=github

// Response:
{
  "success": true,
  "data": [
    {
      "id": "bookmark_123",
      "title": "GitHub",
      "url": "https://github.com",
      "description": "Code repository platform",
      "favicon": "https://github.com/favicon.ico",
      "categoryId": "cat_1",
      "userId": "user_2abc123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "category": {
        "id": "cat_1",
        "name": "Dev Tools",
        "color": "#f59e0b",
        "userId": "user_2abc123",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
      }
    }
  ]
}
```

### POST /api/bookmarks
Create new bookmark
```javascript
// Request Body:
{
  "title": "GitHub",
  "url": "https://github.com",
  "description": "Code repository platform", // optional
  "categoryId": "cat_1", // optional
  "userId": "user_2abc123"
}

// Response:
{
  "success": true,
  "data": {
    "id": "bookmark_123",
    "title": "GitHub",
    "url": "https://github.com",
    "description": "Code repository platform",
    "favicon": "https://github.com/favicon.ico",
    "categoryId": "cat_1",
    "userId": "user_2abc123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "category": {
      "id": "cat_1",
      "name": "Dev Tools",
      "color": "#f59e0b",
      "userId": "user_2abc123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### PUT /api/bookmarks/:id
Update existing bookmark
```javascript
// Request Body:
{
  "title": "GitHub - Updated",
  "url": "https://github.com",
  "description": "Updated description",
  "categoryId": "cat_2"
}

// Response:
{
  "success": true,
  "data": {
    "id": "bookmark_123",
    "title": "GitHub - Updated",
    "url": "https://github.com",
    "description": "Updated description",
    "favicon": "https://github.com/favicon.ico",
    "categoryId": "cat_2",
    "userId": "user_2abc123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z",
    "category": {
      "id": "cat_2",
      "name": "Work",
      "color": "#3b82f6",
      "userId": "user_2abc123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### DELETE /api/bookmarks/:id
Delete bookmark
```javascript
// Request:
DELETE /api/bookmarks/bookmark_123

// Response:
{
  "success": true,
  "message": "Bookmark deleted successfully"
}
```

## 🏷️ Categories API

### GET /api/categories
Get user's categories
```javascript
// Query Parameters:
// - userId: string (required)

// Request:
GET /api/categories?userId=user_2abc123

// Response:
{
  "success": true,
  "data": [
    {
      "id": "cat_1",
      "name": "Dev Tools",
      "color": "#f59e0b",
      "userId": "user_2abc123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "cat_2",
      "name": "Work",
      "color": "#3b82f6",
      "userId": "user_2abc123",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### POST /api/categories
Create new category
```javascript
// Request Body:
{
  "name": "Personal",
  "color": "#10b981",
  "userId": "user_2abc123"
}

// Response:
{
  "success": true,
  "data": {
    "id": "cat_3",
    "name": "Personal",
    "color": "#10b981",
    "userId": "user_2abc123",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  }
}
```

### DELETE /api/categories/:id
Delete category and remove from bookmarks
```javascript
// Request:
DELETE /api/categories/cat_1

// Response:
{
  "success": true,
  "message": "Category deleted successfully",
  "affectedBookmarks": 5 // Number of bookmarks that had their categoryId set to null
}
```

## 🔍 Utility APIs (Optional)

### GET /api/utils/favicon
Get favicon URL for a website
```javascript
// Query Parameters:
// - url: string (required)

// Request:
GET /api/utils/favicon?url=https://github.com

// Response:
{
  "success": true,
  "data": {
    "favicon": "https://github.com/favicon.ico"
  }
}
```

### GET /api/utils/metadata
Get website metadata (title, description)
```javascript
// Query Parameters:
// - url: string (required)

// Request:
GET /api/utils/metadata?url=https://github.com

// Response:
{
  "success": true,
  "data": {
    "title": "GitHub: Let's build from here",
    "description": "GitHub is where over 100 million developers shape the future of software, together.",
    "favicon": "https://github.com/favicon.ico"
  }
}
```

## 🔐 Clerk Integration - Go Fiber

### JWT Token Verification Middleware
```go
package middleware

import (
    "crypto/rsa"
    "encoding/json"
    "fmt"
    "net/http"
    "strings"
    "time"

    "github.com/gofiber/fiber/v2"
    "github.com/golang-jwt/jwt/v5"
)

type JWKSResponse struct {
    Keys []JWK `json:"keys"`
}

type JWK struct {
    Kid string `json:"kid"`
    N   string `json:"n"`
    E   string `json:"e"`
    Kty string `json:"kty"`
    Use string `json:"use"`
}

func ClerkAuth() fiber.Handler {
    return func(c *fiber.Ctx) error {
        authHeader := c.Get("Authorization")
        if authHeader == "" {
            return c.Status(401).JSON(fiber.Map{
                "success": false,
                "error":   "Unauthorized",
                "message": "Missing Authorization header",
            })
        }

        tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
        
        // Parse token without verification first to get kid
        token, _, err := new(jwt.Parser).ParseUnverified(tokenString, jwt.MapClaims{})
        if err != nil {
            return c.Status(401).JSON(fiber.Map{
                "success": false,
                "error":   "Unauthorized",
                "message": "Invalid token format",
            })
        }

        // Get kid from header
        kid, ok := token.Header["kid"].(string)
        if !ok {
            return c.Status(401).JSON(fiber.Map{
                "success": false,
                "error":   "Unauthorized",
                "message": "Missing kid in token header",
            })
        }

        // Get public key from Clerk JWKS
        publicKey, err := getPublicKeyFromJWKS(kid)
        if err != nil {
            return c.Status(401).JSON(fiber.Map{
                "success": false,
                "error":   "Unauthorized",
                "message": "Failed to get public key",
            })
        }

        // Verify token
        parsedToken, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return publicKey, nil
        })

        if err != nil || !parsedToken.Valid {
            return c.Status(401).JSON(fiber.Map{
                "success": false,
                "error":   "Unauthorized",
                "message": "Invalid token",
            })
        }

        claims, ok := parsedToken.Claims.(jwt.MapClaims)
        if !ok {
            return c.Status(401).JSON(fiber.Map{
                "success": false,
                "error":   "Unauthorized",
                "message": "Invalid token claims",
            })
        }

        // Set user ID in context
        c.Locals("userId", claims["sub"].(string))
        return c.Next()
    }
}

func getPublicKeyFromJWKS(kid string) (*rsa.PublicKey, error) {
    jwksURL := fmt.Sprintf("https://%s/.well-known/jwks.json", os.Getenv("CLERK_DOMAIN"))
    
    resp, err := http.Get(jwksURL)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    var jwks JWKSResponse
    if err := json.NewDecoder(resp.Body).Decode(&jwks); err != nil {
        return nil, err
    }

    for _, key := range jwks.Keys {
        if key.Kid == kid {
            return parseRSAPublicKey(key.N, key.E)
        }
    }

    return nil, fmt.Errorf("key not found")
}
```

### Go Fiber Handler Examples
```go
// GET /api/bookmarks
func (h *BookmarkHandler) GetBookmarks(c *fiber.Ctx) error {
    userID := c.Locals("userId").(string) // Clerk user ID from JWT
    
    // Your bookmark fetching logic here...
    
    return c.JSON(fiber.Map{
        "success": true,
        "data":    bookmarks,
    })
}

// POST /api/bookmarks
func (h *BookmarkHandler) CreateBookmark(c *fiber.Ctx) error {
    userID := c.Locals("userId").(string) // Clerk user ID from JWT
    
    var req struct {
        Title       string  `json:"title" validate:"required"`
        URL         string  `json:"url" validate:"required,url"`
        Description *string `json:"description"`
        CategoryID  *string `json:"categoryId"`
    }

    if err := c.BodyParser(&req); err != nil {
        return c.Status(400).JSON(fiber.Map{
            "success": false,
            "error":   "Bad request",
            "message": "Invalid request body",
        })
    }

    bookmark := Bookmark{
        Title:       req.Title,
        URL:         req.URL,
        Description: req.Description,
        CategoryID:  req.CategoryID,
        UserID:      userID, // Use Clerk user ID
        CreatedAt:   time.Now(),
        UpdatedAt:   time.Now(),
    }

    // Save to MongoDB...
    
    return c.Status(201).JSON(fiber.Map{
        "success": true,
        "data":    bookmark,
    })
}
```

## 📝 Data Models

### Bookmark Model
```javascript
{
  id: string,           // Unique bookmark ID
  title: string,        // Bookmark title
  url: string,          // Website URL
  description?: string, // Optional description
  favicon?: string,     // Favicon URL
  categoryId?: string,  // Optional category ID
  userId: string,       // Clerk user ID
  createdAt: Date,      // Creation timestamp
  updatedAt: Date       // Last update timestamp
}
```

### Category Model
```javascript
{
  id: string,       // Unique category ID
  name: string,     // Category name
  color: string,    // Hex color code
  userId: string,   // Clerk user ID
  createdAt: Date,  // Creation timestamp
  updatedAt: Date   // Last update timestamp
}
```

## 🚨 Error Responses

### 400 Bad Request
```javascript
{
  "success": false,
  "error": "Invalid request data",
  "details": {
    "field": "url",
    "message": "URL is required"
  }
}
```

### 401 Unauthorized
```javascript
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing JWT token"
}
```

### 403 Forbidden
```javascript
{
  "success": false,
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### 404 Not Found
```javascript
{
  "success": false,
  "error": "Not found",
  "message": "Bookmark not found"
}
```

### 500 Internal Server Error
```javascript
{
  "success": false,
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

## 🔧 Environment Variables - Go Fiber

```env
# Clerk Configuration
CLERK_DOMAIN=your-clerk-domain.clerk.accounts.dev
CLERK_JWT_AUDIENCE=your-audience
CLERK_SECRET_KEY=sk_test_...

# MongoDB
MONGODB_URI=mongodb://localhost:27017/bookmarks

# Server
PORT=3001
GO_ENV=production
```

### Go Fiber Main Application Setup
```go
package main

import (
    "context"
    "log"
    "os"

    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/cors"
    "github.com/gofiber/fiber/v2/middleware/logger"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"

    "your-app/handlers"
    "your-app/middleware"
)

func main() {
    // MongoDB connection
    client, err := mongo.Connect(context.Background(), 
        options.Client().ApplyURI(os.Getenv("MONGODB_URI")))
    if err != nil {
        log.Fatal("Failed to connect to MongoDB:", err)
    }
    defer client.Disconnect(context.Background())

    db := client.Database("bookmarks")
    bookmarkCollection := db.Collection("bookmarks")
    categoryCollection := db.Collection("categories")

    // Initialize handlers
    bookmarkHandler := &handlers.BookmarkHandler{
        Collection:         bookmarkCollection,
        CategoryCollection: categoryCollection,
    }
    utilHandler := &handlers.UtilHandler{}

    // Initialize Fiber app
    app := fiber.New(fiber.Config{
        ErrorHandler: func(c *fiber.Ctx, err error) error {
            return c.Status(500).JSON(fiber.Map{
                "success": false,
                "error":   "Internal server error",
                "message": err.Error(),
            })
        },
    })

    // Middleware
    app.Use(logger.New())
    app.Use(cors.New(cors.Config{
        AllowOrigins: "*",
        AllowHeaders: "Origin, Content-Type, Accept, Authorization",
        AllowMethods: "GET, POST, PUT, DELETE, OPTIONS",
    }))

    // Routes
    api := app.Group("/api")
    
    // Protected routes with Clerk auth
    protected := api.Use(middleware.ClerkAuth())
    
    // Bookmark routes
    protected.Get("/bookmarks", bookmarkHandler.GetBookmarks)
    protected.Post("/bookmarks", bookmarkHandler.CreateBookmark)
    protected.Put("/bookmarks/:id", bookmarkHandler.UpdateBookmark)
    protected.Delete("/bookmarks/:id", bookmarkHandler.DeleteBookmark)
    
    // Category routes
    protected.Get("/categories", bookmarkHandler.GetCategories)
    protected.Post("/categories", bookmarkHandler.CreateCategory)
    protected.Delete("/categories/:id", bookmarkHandler.DeleteCategory)
    
    // Utility routes
    protected.Get("/utils/favicon", utilHandler.GetFavicon)
    protected.Get("/utils/metadata", utilHandler.GetMetadata)

    // Health check
    app.Get("/health", func(c *fiber.Ctx) error {
        return c.JSON(fiber.Map{"status": "ok"})
    })

    port := os.Getenv("PORT")
    if port == "" {
        port = "3001"
    }

    log.Printf("Server starting on port %s", port)
    log.Fatal(app.Listen(":" + port))
}
```

## 📊 Rate Limiting (Recommended) - Go Fiber

```go
package middleware

import (
    "time"
    
    "github.com/gofiber/fiber/v2"
    "github.com/gofiber/fiber/v2/middleware/limiter"
)

func RateLimiter() fiber.Handler {
    return limiter.New(limiter.Config{
        Max:        100,
        Expiration: 1 * time.Minute,
        KeyGenerator: func(c *fiber.Ctx) string {
            // Rate limit per user
            userID := c.Locals("userId")
            if userID != nil {
                return userID.(string)
            }
            return c.IP()
        },
        LimitReached: func(c *fiber.Ctx) error {
            return c.Status(429).JSON(fiber.Map{
                "success": false,
                "error":   "Too many requests",
                "message": "Rate limit exceeded",
            })
        },
    })
}

// Usage in main.go:
// protected.Use(middleware.RateLimiter())
```

### Go Dependencies (go.mod)
```go
module your-bookmark-api

go 1.21

require (
    github.com/gofiber/fiber/v2 v2.52.0
    github.com/golang-jwt/jwt/v5 v5.2.0
    go.mongodb.org/mongo-driver v1.13.1
    github.com/PuerkitoBio/goquery v1.8.1
)
```

### Rate Limiting Rules:
- **GET requests**: 100 requests per minute per user
- **POST/PUT requests**: 30 requests per minute per user  
- **DELETE requests**: 10 requests per minute per user

Bu Go Fiber API ile frontend'deki tüm functionality'ler çalışacak! 🚀
## 🌳 API
 Endpoints Tree Structure

```
📁 External API (Go Fiber)
├── 🔐 Authentication
│   └── Authorization: Bearer <clerk_jwt_token>
│
├── 📚 /api/bookmarks
│   ├── GET    /api/bookmarks                    # Get user's bookmarks
│   │   └── Query: ?userId=user_123&categoryId=cat_1&search=github
│   ├── POST   /api/bookmarks                    # Create new bookmark
│   │   └── Body: { title, url, description?, categoryId?, userId }
│   ├── PUT    /api/bookmarks/:id                # Update bookmark
│   │   └── Body: { title, url, description?, categoryId? }
│   └── DELETE /api/bookmarks/:id                # Delete bookmark
│
├── 🏷️  /api/categories
│   ├── GET    /api/categories                   # Get user's categories
│   │   └── Query: ?userId=user_123
│   ├── POST   /api/categories                   # Create new category
│   │   └── Body: { name, color, userId }
│   └── DELETE /api/categories/:id               # Delete category
│
├── 🔍 /api/utils
│   ├── GET    /api/utils/favicon                # Get favicon URL
│   │   └── Query: ?url=https://github.com
│   └── GET    /api/utils/metadata               # Get website metadata
│       └── Query: ?url=https://github.com
│
└── 🏥 /health                                   # Health check endpoint
    └── GET    /health                           # Server status
```

### 📋 Quick Reference

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| `GET` | `/api/bookmarks` | ✅ | Get user bookmarks with filtering |
| `POST` | `/api/bookmarks` | ✅ | Create new bookmark |
| `PUT` | `/api/bookmarks/:id` | ✅ | Update existing bookmark |
| `DELETE` | `/api/bookmarks/:id` | ✅ | Delete bookmark |
| `GET` | `/api/categories` | ✅ | Get user categories |
| `POST` | `/api/categories` | ✅ | Create new category |
| `DELETE` | `/api/categories/:id` | ✅ | Delete category |
| `GET` | `/api/utils/favicon` | ✅ | Get website favicon |
| `GET` | `/api/utils/metadata` | ✅ | Get website metadata |
| `GET` | `/health` | ❌ | Health check |

### 🔄 Request Flow

```
Frontend (Next.js + Clerk)
    ↓ JWT Token
External API (Go Fiber)
    ↓ Verify JWT
MongoDB (User Data)
    ↓ Response
Frontend (UI Update)
```

**Total Endpoints:** 10 endpoints for complete bookmark management! 🎯