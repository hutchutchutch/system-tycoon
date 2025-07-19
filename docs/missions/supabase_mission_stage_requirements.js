[
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "stage_id": "550e8400-e29b-41d4-a716-446655440001",
      "requirement_type": "component_required",
      "title": "Add Dedicated Database Server",
      "description": "The health tracking system needs a separate database server to handle the increasing load of family health reports without blocking web requests.",
      "validation_config": {
        "max_instances": 2,
        "min_instances": 1,
        "forbidden_patterns": [
          "combined_server"
        ],
        "required_components": [
          "database"
        ]
      },
      "error_message": "You still need to add a dedicated database server. Right now all the health data is stored on the same machine that's trying to serve web pages to 200+ families!",
      "hint_message": "Try dragging a Database component from the Storage category. This will give the health reports a dedicated place to be stored and queried.",
      "success_message": "Perfect! You've added a dedicated database server. This will prevent database operations from blocking web requests when families submit their health data.",
      "priority": 1,
      "points_value": 20,
      "unlock_order": 1,
      "initially_visible": true,
      "show_after_requirements": null,
      "created_at": "2025-07-18 00:52:52.060782+00",
      "updated_at": "2025-07-18 00:52:52.060782+00"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "stage_id": "550e8400-e29b-41d4-a716-446655440001",
      "requirement_type": "component_required",
      "title": "Add Dedicated Web Server",
      "description": "The system needs a web server component separate from the database to handle HTTP requests from families accessing the health tracker.",
      "validation_config": {
        "max_instances": 3,
        "min_instances": 1,
        "required_components": [
          "web_server"
        ]
      },
      "error_message": "You need a dedicated web server to handle HTTP requests from families trying to access Alex's health tracking site.",
      "hint_message": "Add a Web Server component from the Compute category. This will handle all the web traffic while your database focuses on storing health data.",
      "success_message": "Excellent! Your dedicated web server can now handle HTTP requests without competing with database operations for resources.",
      "priority": 1,
      "points_value": 20,
      "unlock_order": 2,
      "initially_visible": true,
      "show_after_requirements": null,
      "created_at": "2025-07-18 00:52:52.060782+00",
      "updated_at": "2025-07-18 00:52:52.060782+00"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440003",
      "stage_id": "550e8400-e29b-41d4-a716-446655440001",
      "requirement_type": "connection_required",
      "title": "Connect Web Server to Database",
      "description": "Your web server needs to connect to the database to store and retrieve family health reports.",
      "validation_config": {
        "source_types": [
          "web_server"
        ],
        "target_types": [
          "database"
        ],
        "max_connections": 2,
        "min_connections": 1
      },
      "error_message": "Your web server isn't connected to the database! Families won't be able to save their health reports without this connection.",
      "hint_message": "Click and drag from the web server to the database to create a connection. This allows the web server to store and retrieve health data.",
      "success_message": "Great! Your web server can now store family health reports in the database and retrieve them for analysis.",
      "priority": 1,
      "points_value": 15,
      "unlock_order": 3,
      "initially_visible": true,
      "show_after_requirements": null,
      "created_at": "2025-07-18 00:52:52.060782+00",
      "updated_at": "2025-07-18 00:52:52.060782+00"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440011",
      "stage_id": "550e8400-e29b-41d4-a716-446655440002",
      "requirement_type": "component_required",
      "title": "Add Load Balancer",
      "description": "With 1000+ families trying to upload symptom photos, you need a load balancer to distribute traffic across multiple web servers.",
      "validation_config": {
        "max_instances": 1,
        "min_instances": 1,
        "required_components": [
          "load_balancer"
        ]
      },
      "error_message": "Traffic is overwhelming your single web server! Add a load balancer to distribute the 1000+ concurrent users across multiple servers.",
      "hint_message": "Add an Application Load Balancer from the Network category. This will distribute incoming requests from families across multiple web servers.",
      "success_message": "Smart! The load balancer will distribute traffic evenly, preventing any single server from being overwhelmed by photo uploads.",
      "priority": 1,
      "points_value": 20,
      "unlock_order": 1,
      "initially_visible": true,
      "show_after_requirements": null,
      "created_at": "2025-07-18 00:53:18.736843+00",
      "updated_at": "2025-07-18 00:53:18.736843+00"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440012",
      "stage_id": "550e8400-e29b-41d4-a716-446655440002",
      "requirement_type": "component_required",
      "title": "Add Additional Web Servers",
      "description": "Scale horizontally by adding more web servers to handle the increased traffic from news coverage.",
      "validation_config": {
        "max_instances": 4,
        "min_instances": 2,
        "required_components": [
          "web_server"
        ]
      },
      "error_message": "You need at least 2 web servers to handle 1000+ concurrent users uploading symptom photos. One server isn't enough!",
      "hint_message": "Add another Web Server component. The load balancer will distribute traffic between multiple servers, preventing overload.",
      "success_message": "Perfect! Multiple web servers working together can handle much more traffic than a single overloaded server.",
      "priority": 1,
      "points_value": 25,
      "unlock_order": 2,
      "initially_visible": true,
      "show_after_requirements": null,
      "created_at": "2025-07-18 00:53:18.736843+00",
      "updated_at": "2025-07-18 00:53:18.736843+00"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440013",
      "stage_id": "550e8400-e29b-41d4-a716-446655440002",
      "requirement_type": "connection_required",
      "title": "Connect Load Balancer to Web Servers",
      "description": "Your load balancer needs to connect to all web servers to distribute traffic effectively.",
      "validation_config": {
        "source_types": [
          "load_balancer"
        ],
        "target_types": [
          "web_server"
        ],
        "min_connections": 2
      },
      "error_message": "Your load balancer isn't connected to the web servers! It can't distribute traffic without these connections.",
      "hint_message": "Draw connections from the load balancer to each web server. This allows the load balancer to send requests to different servers.",
      "success_message": "Excellent! Now the load balancer can distribute incoming requests from families across all your web servers.",
      "priority": 1,
      "points_value": 20,
      "unlock_order": 3,
      "initially_visible": true,
      "show_after_requirements": null,
      "created_at": "2025-07-18 00:53:18.736843+00",
      "updated_at": "2025-07-18 00:53:18.736843+00"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440004",
      "stage_id": "550e8400-e29b-41d4-a716-446655440001",
      "requirement_type": "component_required",
      "title": "Remove Combined Server",
      "description": "The old combined server (Alex's laptop) should be removed now that you have dedicated components.",
      "validation_config": {
        "max_instances": 0,
        "forbidden_patterns": [
          "combined_server"
        ],
        "required_components": []
      },
      "error_message": "You still have the old combined server that was causing the problems. Remove Alex's overloaded laptop from your design.",
      "hint_message": "Click on Alex's laptop and press Delete, or use the remove button. The dedicated components you've added will handle the load much better.",
      "success_message": "Perfect! You've removed the bottleneck. The separated architecture will prevent database operations from blocking web requests.",
      "priority": 1,
      "points_value": 10,
      "unlock_order": 4,
      "initially_visible": false,
      "show_after_requirements": [
        "660e8400-e29b-41d4-a716-446655440001",
        "660e8400-e29b-41d4-a716-446655440002"
      ],
      "created_at": "2025-07-18 00:52:52.060782+00",
      "updated_at": "2025-07-18 00:52:52.060782+00"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440005",
      "stage_id": "550e8400-e29b-41d4-a716-446655440001",
      "requirement_type": "performance_target",
      "title": "Achieve Target Response Time",
      "description": "The system should respond to health report submissions within 3 seconds to keep families engaged.",
      "validation_config": {
        "max_latency_ms": 3000,
        "max_cost_monthly": 200,
        "min_throughput_rps": 50
      },
      "error_message": "Your current design has an estimated response time of over 3 seconds. Families will get frustrated and stop submitting critical health data.",
      "hint_message": "The separated architecture should improve response times. Make sure your components have adequate resources and are properly connected.",
      "success_message": "Excellent! Your design now meets the performance requirements. Families can quickly submit their health reports without frustrating delays.",
      "priority": 2,
      "points_value": 25,
      "unlock_order": 5,
      "initially_visible": false,
      "show_after_requirements": [
        "660e8400-e29b-41d4-a716-446655440003"
      ],
      "created_at": "2025-07-18 00:52:52.060782+00",
      "updated_at": "2025-07-18 00:52:52.060782+00"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440014",
      "stage_id": "550e8400-e29b-41d4-a716-446655440002",
      "requirement_type": "component_required",
      "title": "Add Object Storage for Photos",
      "description": "Symptom photos are consuming web server storage. Use object storage to handle media files efficiently.",
      "validation_config": {
        "max_instances": 1,
        "min_instances": 1,
        "required_components": [
          "object_storage"
        ]
      },
      "error_message": "Photo uploads are filling up your web servers! Add object storage to handle the symptom photos that families are uploading.",
      "hint_message": "Add an Object Storage component (like S3) from the Storage category. This is designed to handle large amounts of media files.",
      "success_message": "Great choice! Object storage can handle thousands of symptom photos without impacting your web servers' performance.",
      "priority": 1,
      "points_value": 20,
      "unlock_order": 4,
      "initially_visible": false,
      "show_after_requirements": [
        "660e8400-e29b-41d4-a716-446655440013"
      ],
      "created_at": "2025-07-18 00:53:18.736843+00",
      "updated_at": "2025-07-18 00:53:18.736843+00"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440015",
      "stage_id": "550e8400-e29b-41d4-a716-446655440002",
      "requirement_type": "connection_required",
      "title": "Connect Web Servers to Object Storage",
      "description": "Web servers need to connect to object storage to upload and retrieve symptom photos.",
      "validation_config": {
        "source_types": [
          "web_server"
        ],
        "target_types": [
          "object_storage"
        ],
        "min_connections": 1
      },
      "error_message": "Your web servers can't store symptom photos without connecting to the object storage.",
      "hint_message": "Connect your web servers to the object storage so they can save the symptom photos that families upload.",
      "success_message": "Perfect! Web servers can now offload photo storage to the dedicated object storage service.",
      "priority": 1,
      "points_value": 15,
      "unlock_order": 5,
      "initially_visible": false,
      "show_after_requirements": [
        "660e8400-e29b-41d4-a716-446655440014"
      ],
      "created_at": "2025-07-18 00:53:18.736843+00",
      "updated_at": "2025-07-18 00:53:18.736843+00"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440016",
      "stage_id": "550e8400-e29b-41d4-a716-446655440002",
      "requirement_type": "cost_constraint",
      "title": "Stay Within Community Budget",
      "description": "The community fund only has $500/month. Design an efficient solution that doesn't exceed this budget.",
      "validation_config": {
        "max_monthly_cost": 500,
        "cost_optimization_required": true
      },
      "error_message": "Your design costs more than the $500/month community budget! Alex can't afford this - optimize your component choices.",
      "hint_message": "Try using smaller instance sizes or fewer components. The community is funding this from donations, so every dollar matters.",
      "success_message": "Fantastic! You've created a solution that can handle the traffic while staying within the community's limited budget.",
      "priority": 1,
      "points_value": 30,
      "unlock_order": 6,
      "initially_visible": false,
      "show_after_requirements": [
        "660e8400-e29b-41d4-a716-446655440015"
      ],
      "created_at": "2025-07-18 00:53:18.736843+00",
      "updated_at": "2025-07-18 00:53:18.736843+00"
    }
  ]