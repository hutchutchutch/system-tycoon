[
    {
      "id": "compute_server",
      "name": "Compute Server",
      "category": "compute",
      "icon_name": "server",
      "color": "#3B82F6",
      "short_description": "Runs your application code",
      "detailed_description": "Compute servers are the workhorses of any system. They execute your application logic, process requests, and coordinate with other services. Think of them as the \"brain\" that makes decisions and performs calculations.",
      "concepts": {
        "core": [
          "Request processing",
          "Application logic",
          "CPU and memory resources"
        ],
        "scaling": [
          "Vertical scaling (bigger servers)",
          "Horizontal scaling (more servers)"
        ],
        "considerations": [
          "Response time",
          "Concurrent users",
          "Processing complexity"
        ]
      },
      "use_cases": {
        "examples": [
          "Web application hosting",
          "API endpoints",
          "Background job processing",
          "Real-time data processing"
        ]
      },
      "compatible_with": [
        "data_store",
        "file_storage",
        "cache",
        "message_queue",
        "load_balancer"
      ],
      "unlock_level": 1,
      "sort_order": 1,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "serverless_function",
      "name": "Serverless Function",
      "category": "compute",
      "icon_name": "zap",
      "color": "#F59E0B",
      "short_description": "Event-driven code execution",
      "detailed_description": "Serverless functions run your code in response to events without managing servers. You only pay for actual execution time, making them perfect for variable workloads and microservices.",
      "concepts": {
        "core": [
          "Event-driven execution",
          "Automatic scaling",
          "Pay-per-use pricing"
        ],
        "patterns": [
          "Request/response",
          "Stream processing",
          "Scheduled tasks"
        ],
        "considerations": [
          "Cold starts",
          "Execution time limits",
          "Stateless design"
        ]
      },
      "use_cases": {
        "examples": [
          "Image thumbnail generation",
          "Webhook processing",
          "Data transformation",
          "Scheduled cleanup tasks"
        ]
      },
      "compatible_with": [
        "api_gateway",
        "message_queue",
        "file_storage",
        "data_store"
      ],
      "unlock_level": 2,
      "sort_order": 2,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "container_service",
      "name": "Container Service",
      "category": "compute",
      "icon_name": "box",
      "color": "#8B5CF6",
      "short_description": "Lightweight application packaging",
      "detailed_description": "Containers package applications with their dependencies, ensuring consistency across environments. They start faster than VMs and use resources more efficiently, making them ideal for microservices.",
      "concepts": {
        "core": [
          "Application isolation",
          "Resource efficiency",
          "Portability"
        ],
        "orchestration": [
          "Container scheduling",
          "Service discovery",
          "Auto-scaling"
        ],
        "considerations": [
          "Image size",
          "Security scanning",
          "Registry management"
        ]
      },
      "use_cases": {
        "examples": [
          "Microservices deployment",
          "CI/CD pipelines",
          "Development environments",
          "Batch processing"
        ]
      },
      "compatible_with": [
        "container_registry",
        "load_balancer",
        "service_mesh",
        "monitoring"
      ],
      "unlock_level": 2,
      "sort_order": 3,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "file_storage",
      "name": "File Storage",
      "category": "storage",
      "icon_name": "hard-drive",
      "color": "#8B5CF6",
      "short_description": "Stores files and media",
      "detailed_description": "File storage systems handle unstructured data like images, videos, documents, and backups. Unlike databases that store structured records, these store complete files that can be retrieved by their location.",
      "concepts": {
        "core": [
          "Object storage",
          "File systems",
          "Content addressing"
        ],
        "features": [
          "Direct URL access",
          "Metadata storage",
          "Versioning"
        ],
        "considerations": [
          "Storage costs",
          "Access frequency",
          "Geographic distribution"
        ]
      },
      "use_cases": {
        "examples": [
          "User uploaded images",
          "Video content",
          "Backup archives",
          "Static website assets"
        ]
      },
      "compatible_with": [
        "compute_server",
        "cdn",
        "serverless_function"
      ],
      "unlock_level": 1,
      "sort_order": 4,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "data_store",
      "name": "Data Store",
      "category": "database",
      "icon_name": "database",
      "color": "#059669",
      "short_description": "Persists your application data",
      "detailed_description": "Data stores keep information safe and organized. They ensure data survives server restarts and can be queried efficiently. The choice between different types depends on your data structure and access patterns.",
      "concepts": {
        "core": [
          "Data persistence",
          "Query capabilities",
          "ACID properties"
        ],
        "types": [
          "Relational (structured)",
          "Document (flexible)",
          "Key-Value (simple)",
          "Graph (relationships)"
        ],
        "considerations": [
          "Query complexity",
          "Data relationships",
          "Consistency requirements"
        ]
      },
      "use_cases": {
        "examples": [
          "User accounts and profiles",
          "Product catalogs",
          "Transaction records",
          "Application state"
        ]
      },
      "compatible_with": [
        "compute_server",
        "cache",
        "serverless_function",
        "data_replica"
      ],
      "unlock_level": 1,
      "sort_order": 5,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "cache",
      "name": "Cache",
      "category": "database",
      "icon_name": "zap",
      "color": "#EF4444",
      "short_description": "Speeds up data access",
      "detailed_description": "Caches store frequently accessed data in fast memory, reducing database load and improving response times. They're essential for scaling applications and providing sub-millisecond latency.",
      "concepts": {
        "core": [
          "In-memory storage",
          "TTL management",
          "Cache invalidation"
        ],
        "patterns": [
          "Cache-aside",
          "Write-through",
          "Write-behind"
        ],
        "considerations": [
          "Memory limits",
          "Eviction policies",
          "Cache coherence"
        ]
      },
      "use_cases": {
        "examples": [
          "Session storage",
          "Database query results",
          "API response caching",
          "Computed values"
        ]
      },
      "compatible_with": [
        "compute_server",
        "data_store",
        "load_balancer"
      ],
      "unlock_level": 2,
      "sort_order": 6,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "load_balancer",
      "name": "Load Balancer",
      "category": "network",
      "icon_name": "git-branch",
      "color": "#F59E0B",
      "short_description": "Distributes traffic across servers",
      "detailed_description": "Load balancers distribute incoming requests across multiple servers, ensuring no single server is overwhelmed. They provide high availability, scalability, and can perform health checks to route traffic only to healthy instances.",
      "concepts": {
        "core": [
          "Traffic distribution",
          "Health checking",
          "Session persistence"
        ],
        "algorithms": [
          "Round robin",
          "Least connections",
          "IP hash",
          "Weighted"
        ],
        "considerations": [
          "SSL termination",
          "Connection pooling",
          "Geographic routing"
        ]
      },
      "use_cases": {
        "examples": [
          "Web application scaling",
          "API gateway",
          "Database read replicas",
          "Microservices routing"
        ]
      },
      "compatible_with": [
        "compute_server",
        "container_service",
        "api_gateway"
      ],
      "unlock_level": 2,
      "sort_order": 7,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "cdn",
      "name": "Content Delivery Network",
      "category": "network",
      "icon_name": "globe",
      "color": "#06B6D4",
      "short_description": "Delivers content globally",
      "detailed_description": "CDNs cache and serve content from locations near users, reducing latency and server load. They're essential for global applications, static assets, and improving user experience worldwide.",
      "concepts": {
        "core": [
          "Edge caching",
          "Geographic distribution",
          "Origin shielding"
        ],
        "features": [
          "Static content delivery",
          "Dynamic acceleration",
          "DDoS protection"
        ],
        "considerations": [
          "Cache invalidation",
          "Regional coverage",
          "SSL certificates"
        ]
      },
      "use_cases": {
        "examples": [
          "Website assets (JS, CSS, images)",
          "Video streaming",
          "Software downloads",
          "API acceleration"
        ]
      },
      "compatible_with": [
        "file_storage",
        "compute_server",
        "load_balancer"
      ],
      "unlock_level": 3,
      "sort_order": 8,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "api_gateway",
      "name": "API Gateway",
      "category": "network",
      "icon_name": "shield",
      "color": "#7C3AED",
      "short_description": "Manages API traffic",
      "detailed_description": "API Gateways provide a single entry point for all API requests, handling authentication, rate limiting, request routing, and protocol translation. They simplify client interactions and protect backend services.",
      "concepts": {
        "core": [
          "Request routing",
          "Authentication",
          "Rate limiting"
        ],
        "features": [
          "API versioning",
          "Request/response transformation",
          "Analytics"
        ],
        "considerations": [
          "Latency overhead",
          "Single point of failure",
          "Configuration complexity"
        ]
      },
      "use_cases": {
        "examples": [
          "Microservices aggregation",
          "Mobile app backends",
          "Third-party API access",
          "WebSocket management"
        ]
      },
      "compatible_with": [
        "compute_server",
        "serverless_function",
        "load_balancer",
        "auth_service"
      ],
      "unlock_level": 3,
      "sort_order": 9,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "message_queue",
      "name": "Message Queue",
      "category": "integration",
      "icon_name": "mail",
      "color": "#7C3AED",
      "short_description": "Enables async communication",
      "detailed_description": "Message queues decouple services by allowing asynchronous communication. Producers send messages without waiting for consumers, enabling better scalability and fault tolerance in distributed systems.",
      "concepts": {
        "core": [
          "Asynchronous processing",
          "Message durability",
          "Delivery guarantees"
        ],
        "patterns": [
          "Pub/sub",
          "Work queues",
          "Request/reply",
          "Event streaming"
        ],
        "considerations": [
          "Message ordering",
          "Duplicate handling",
          "Dead letter queues"
        ]
      },
      "use_cases": {
        "examples": [
          "Order processing",
          "Email notifications",
          "Data pipeline",
          "Event-driven workflows"
        ]
      },
      "compatible_with": [
        "compute_server",
        "serverless_function",
        "container_service"
      ],
      "unlock_level": 3,
      "sort_order": 10,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "auth_service",
      "name": "Authentication Service",
      "category": "security",
      "icon_name": "shield",
      "color": "#DC2626",
      "short_description": "Manages user identity",
      "detailed_description": "Authentication services handle user registration, login, and access control. They provide secure identity management, supporting various authentication methods and integration protocols.",
      "concepts": {
        "core": [
          "User authentication",
          "Authorization",
          "Session management"
        ],
        "protocols": [
          "OAuth 2.0",
          "SAML",
          "OpenID Connect",
          "JWT"
        ],
        "considerations": [
          "Password policies",
          "MFA support",
          "Token expiration"
        ]
      },
      "use_cases": {
        "examples": [
          "User login systems",
          "Single sign-on (SSO)",
          "API authentication",
          "Role-based access control"
        ]
      },
      "compatible_with": [
        "compute_server",
        "api_gateway",
        "data_store"
      ],
      "unlock_level": 2,
      "sort_order": 11,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "secrets_manager",
      "name": "Secrets Manager",
      "category": "security",
      "icon_name": "key",
      "color": "#DC2626",
      "short_description": "Stores sensitive data securely",
      "detailed_description": "Secrets managers centrally store and manage sensitive information like API keys, database passwords, and certificates. They provide encryption, access control, and audit logging for compliance.",
      "concepts": {
        "core": [
          "Encryption at rest",
          "Access policies",
          "Audit logging"
        ],
        "features": [
          "Automatic rotation",
          "Version control",
          "Dynamic secrets"
        ],
        "considerations": [
          "Key management",
          "Backup strategies",
          "Compliance requirements"
        ]
      },
      "use_cases": {
        "examples": [
          "Database credentials",
          "API keys",
          "SSL certificates",
          "Encryption keys"
        ]
      },
      "compatible_with": [
        "compute_server",
        "container_service",
        "serverless_function"
      ],
      "unlock_level": 3,
      "sort_order": 12,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "monitoring",
      "name": "Monitoring Service",
      "category": "analytics",
      "icon_name": "activity",
      "color": "#F97316",
      "short_description": "Tracks system health",
      "detailed_description": "Monitoring services collect metrics, logs, and traces to provide visibility into system health and performance. They enable proactive issue detection and help understand system behavior.",
      "concepts": {
        "core": [
          "Metrics collection",
          "Log aggregation",
          "Distributed tracing"
        ],
        "features": [
          "Alerting",
          "Dashboards",
          "Anomaly detection"
        ],
        "considerations": [
          "Data retention",
          "Cardinality limits",
          "Query performance"
        ]
      },
      "use_cases": {
        "examples": [
          "Application performance monitoring",
          "Infrastructure metrics",
          "Error tracking",
          "Business KPIs"
        ]
      },
      "compatible_with": [
        "compute_server",
        "container_service",
        "serverless_function",
        "data_store"
      ],
      "unlock_level": 2,
      "sort_order": 13,
      "created_at": "2025-07-17 20:11:34.257157+00"
    },
    {
      "id": "data_warehouse",
      "name": "Data Warehouse",
      "category": "analytics",
      "icon_name": "bar-chart",
      "color": "#F97316",
      "short_description": "Analyzes large datasets",
      "detailed_description": "Data warehouses optimize for analytical queries across large datasets. They support complex aggregations, historical analysis, and business intelligence workloads that would overwhelm transactional databases.",
      "concepts": {
        "core": [
          "Columnar storage",
          "Query optimization",
          "Data modeling"
        ],
        "patterns": [
          "ETL/ELT",
          "Star schema",
          "Data marts"
        ],
        "considerations": [
          "Query costs",
          "Data freshness",
          "Storage optimization"
        ]
      },
      "use_cases": {
        "examples": [
          "Business intelligence",
          "Customer analytics",
          "Financial reporting",
          "Trend analysis"
        ]
      },
      "compatible_with": [
        "data_store",
        "message_queue",
        "compute_server"
      ],
      "unlock_level": 4,
      "sort_order": 14,
      "created_at": "2025-07-17 20:11:34.257157+00"
    }
  ]