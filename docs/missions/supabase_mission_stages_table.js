[
    {
      "id": "451be472-4aa0-4972-be70-c63705e436cd",
      "mission_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "stage_number": 3,
      "title": "Database Crash Crisis",
      "problem_description": "Database crashed and lost 2 hours of critical symptom reports. Environmental lawyer needs every report for the case.",
      "initial_system_state": {
        "edges": [
          {
            "id": "e1-2",
            "source": "1",
            "target": "2"
          },
          {
            "id": "e1-3",
            "source": "1",
            "target": "3"
          },
          {
            "id": "e2-4",
            "source": "2",
            "target": "4"
          },
          {
            "id": "e3-4",
            "source": "3",
            "target": "4"
          }
        ],
        "nodes": [
          {
            "id": "1",
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 200
            }
          },
          {
            "id": "3",
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 200
            }
          },
          {
            "id": "4",
            "data": {
              "status": "crashed"
            },
            "type": "database",
            "position": {
              "x": 300,
              "y": 350
            }
          }
        ]
      },
      "error_messages": [
        "Database connection lost",
        "2 hours of data lost",
        "No backup available"
      ],
      "performance_issues": {
        "downtime_minutes": 120,
        "data_loss_incidents": 1
      },
      "required_components": [
        "load_balancer",
        "web_server",
        "web_server",
        "database",
        "database_replica"
      ],
      "optional_components": [],
      "validation_rules": {
        "max_cost": 110,
        "min_replicas": 1,
        "requires_replication": true
      },
      "budget_limit": "110",
      "performance_requirements": {
        "max_data_loss": 0,
        "min_availability": 0.999
      },
      "special_constraints": null,
      "time_pressure_seconds": 3600,
      "concepts_taught": [
        "database_replication",
        "failover",
        "data_durability"
      ],
      "components_unlocked": [
        "database_replica"
      ],
      "created_at": "2025-07-16 23:02:03.732081+00",
      "success_system_state": {
        "edges": [
          {
            "id": "e1-2",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "2"
          },
          {
            "id": "e1-3",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "3"
          },
          {
            "id": "e2-4",
            "data": {
              "label": "Database queries"
            },
            "source": "2",
            "target": "4"
          },
          {
            "id": "e3-4",
            "data": {
              "label": "Database queries"
            },
            "source": "3",
            "target": "4"
          },
          {
            "id": "e4-5",
            "data": {
              "label": "Replication",
              "status": "healthy"
            },
            "source": "4",
            "target": "5"
          }
        ],
        "nodes": [
          {
            "id": "1",
            "data": {
              "label": "Load Balancer",
              "status": "healthy"
            },
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "data": {
              "label": "Web Server 1",
              "status": "healthy"
            },
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 200
            }
          },
          {
            "id": "3",
            "data": {
              "label": "Web Server 2",
              "status": "healthy"
            },
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 200
            }
          },
          {
            "id": "4",
            "data": {
              "label": "Primary Database",
              "status": "healthy",
              "replication": "master"
            },
            "type": "database",
            "position": {
              "x": 200,
              "y": 350
            }
          },
          {
            "id": "5",
            "data": {
              "label": "Database Replica",
              "lag_ms": 10,
              "status": "healthy",
              "replication": "slave"
            },
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 350
            }
          }
        ]
      },
      "system_requirements": [
        {
          "id": "data_redundancy",
          "type": "architecture",
          "priority": "critical",
          "validation": "nodes.filter(n => n.data.category === \"database\").length >= 2",
          "description": "Implement database replication to prevent data loss",
          "required_nodes": [
            "database"
          ],
          "validation_type": "node_count",
          "min_nodes_of_type": {
            "database": 2
          }
        },
        {
          "id": "database_replication",
          "type": "connectivity",
          "priority": "critical",
          "validation": "edges.some(e => { const source = nodes.find(n => n.id === e.source); const target = nodes.find(n => n.id === e.target); return source?.data.category === \"database\" && target?.data.category === \"database\"; })",
          "description": "Connect primary database to replica for replication",
          "validation_type": "edge_connection",
          "required_connection": {
            "to": "database",
            "from": "database"
          }
        },
        {
          "id": "zero_data_loss",
          "type": "reliability",
          "priority": "critical",
          "validation": "true",
          "description": "Ensure no data loss during failures",
          "target_value": 0,
          "target_metric": "data_loss",
          "validation_type": "metric"
        }
      ]
    },
    {
      "id": "512a075e-4671-4b0b-bdee-732af0a2c5f4",
      "mission_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "stage_number": 5,
      "title": "Video Bandwidth Crisis",
      "problem_description": "News provided symptom video (50MB) but it's killing bandwidth. City inspector coming tomorrow morning!",
      "initial_system_state": {
        "nodes": [
          {
            "id": "1",
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 200
            }
          },
          {
            "id": "3",
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 200
            }
          },
          {
            "id": "4",
            "type": "cache",
            "position": {
              "x": 300,
              "y": 200
            }
          },
          {
            "id": "5",
            "type": "database",
            "position": {
              "x": 200,
              "y": 350
            }
          },
          {
            "id": "6",
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 350
            }
          },
          {
            "id": "7",
            "data": {
              "label": "Video Storage (50MB)"
            },
            "type": "storage",
            "position": {
              "x": 500,
              "y": 200
            }
          }
        ]
      },
      "error_messages": [
        "Bandwidth exhausted",
        "Video buffering",
        "Site crawling"
      ],
      "performance_issues": {
        "bandwidth_usage_percent": 98,
        "video_requests_per_minute": 200
      },
      "required_components": [
        "cdn",
        "storage"
      ],
      "optional_components": [],
      "validation_rules": {
        "max_cost": 150,
        "requires_cdn": true,
        "static_content_via_cdn": true
      },
      "budget_limit": "150",
      "performance_requirements": {
        "bandwidth_usage": 50,
        "video_load_time_ms": 2000
      },
      "special_constraints": null,
      "time_pressure_seconds": null,
      "concepts_taught": [
        "content_delivery_networks",
        "edge_caching",
        "static_assets"
      ],
      "components_unlocked": [
        "cdn",
        "storage"
      ],
      "created_at": "2025-07-16 23:02:29.329233+00",
      "success_system_state": {
        "edges": [
          {
            "id": "e1-2",
            "data": {
              "label": "Dynamic content"
            },
            "source": "1",
            "target": "2"
          },
          {
            "id": "e1-3",
            "data": {
              "label": "Dynamic content"
            },
            "source": "1",
            "target": "3"
          },
          {
            "id": "e2-4",
            "data": {
              "label": "Cache lookup"
            },
            "source": "2",
            "target": "4"
          },
          {
            "id": "e3-4",
            "data": {
              "label": "Cache lookup"
            },
            "source": "3",
            "target": "4"
          },
          {
            "id": "e4-5",
            "data": {
              "label": "Database queries"
            },
            "source": "4",
            "target": "5"
          },
          {
            "id": "e5-6",
            "data": {
              "label": "Replication"
            },
            "source": "5",
            "target": "6"
          },
          {
            "id": "e7-8",
            "data": {
              "label": "Static content delivery"
            },
            "source": "7",
            "target": "8"
          },
          {
            "id": "e8-9",
            "data": {
              "label": "Video storage"
            },
            "source": "8",
            "target": "9"
          }
        ],
        "nodes": [
          {
            "id": "1",
            "data": {
              "label": "Load Balancer",
              "status": "healthy"
            },
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "data": {
              "label": "Web Server 1",
              "status": "healthy",
              "bandwidth_usage": 40
            },
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 150
            }
          },
          {
            "id": "3",
            "data": {
              "label": "Web Server 2",
              "status": "healthy",
              "bandwidth_usage": 40
            },
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 150
            }
          },
          {
            "id": "4",
            "data": {
              "label": "Cache Layer",
              "status": "healthy"
            },
            "type": "cache",
            "position": {
              "x": 300,
              "y": 200
            }
          },
          {
            "id": "5",
            "data": {
              "label": "Primary Database",
              "status": "healthy"
            },
            "type": "database",
            "position": {
              "x": 200,
              "y": 350
            }
          },
          {
            "id": "6",
            "data": {
              "label": "Database Replica",
              "status": "healthy"
            },
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 350
            }
          },
          {
            "id": "7",
            "data": {
              "label": "CDN",
              "status": "healthy",
              "edge_locations": 12,
              "cache_hit_ratio": 0.95
            },
            "type": "cdn",
            "position": {
              "x": 500,
              "y": 50
            }
          },
          {
            "id": "8",
            "data": {
              "label": "Video Storage",
              "status": "healthy",
              "video_load_time_ms": 1800
            },
            "type": "storage",
            "position": {
              "x": 500,
              "y": 200
            }
          }
        ]
      },
      "system_requirements": [
        {
          "id": "content_delivery_network",
          "type": "architecture",
          "priority": "critical",
          "validation": "Must have cdn component",
          "description": "Implement CDN to serve static video content from edge locations"
        },
        {
          "id": "bandwidth_optimization",
          "type": "performance",
          "priority": "critical",
          "validation": "bandwidth_usage <= 50",
          "description": "Reduce server bandwidth usage to 50% or less"
        },
        {
          "id": "video_performance",
          "type": "performance",
          "priority": "high",
          "validation": "video_load_time_ms <= 2000",
          "description": "Ensure video loads in under 2 seconds"
        },
        {
          "id": "static_content_offload",
          "type": "architecture",
          "priority": "high",
          "validation": "static_content_via_cdn = true",
          "description": "Serve all static content through CDN, not origin servers"
        }
      ]
    },
    {
      "id": "a5647e32-c201-4112-b1f7-1ca8af6186ee",
      "mission_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "stage_number": 2,
      "title": "News Media Traffic Surge",
      "problem_description": "Local news coverage brings 1000+ families trying to report. Single web server is overwhelmed.",
      "initial_system_state": {
        "edges": [
          {
            "id": "e1-2",
            "source": "1",
            "target": "2"
          }
        ],
        "nodes": [
          {
            "id": "1",
            "data": {
              "label": "Web Server",
              "status": "overloaded"
            },
            "type": "web_server",
            "position": {
              "x": 300,
              "y": 100
            }
          },
          {
            "id": "2",
            "data": {
              "label": "Database",
              "status": "ok"
            },
            "type": "database",
            "position": {
              "x": 300,
              "y": 300
            }
          }
        ]
      },
      "error_messages": [
        "503 Service Unavailable",
        "Server timeout",
        "Connection refused"
      ],
      "performance_issues": {
        "success_rate": 0.3,
        "concurrent_users": 1000
      },
      "required_components": [
        "load_balancer",
        "web_server",
        "web_server",
        "database"
      ],
      "optional_components": [],
      "validation_rules": {
        "max_cost": 80,
        "min_web_servers": 2,
        "requires_load_balancer": true
      },
      "budget_limit": "80",
      "performance_requirements": {
        "min_success_rate": 0.95,
        "min_concurrent_users": 1000
      },
      "special_constraints": null,
      "time_pressure_seconds": 1800,
      "concepts_taught": [
        "horizontal_scaling",
        "load_balancing",
        "high_availability"
      ],
      "components_unlocked": [
        "load_balancer"
      ],
      "created_at": "2025-07-16 23:01:52.781962+00",
      "success_system_state": {
        "edges": [
          {
            "id": "e1-2",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "2"
          },
          {
            "id": "e1-3",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "3"
          },
          {
            "id": "e2-4",
            "data": {
              "label": "Database queries"
            },
            "source": "2",
            "target": "4"
          },
          {
            "id": "e3-4",
            "data": {
              "label": "Database queries"
            },
            "source": "3",
            "target": "4"
          }
        ],
        "nodes": [
          {
            "id": "1",
            "data": {
              "label": "Load Balancer",
              "status": "healthy",
              "traffic_distribution": "even"
            },
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "data": {
              "load": "balanced",
              "label": "Web Server 1",
              "status": "healthy"
            },
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 200
            }
          },
          {
            "id": "3",
            "data": {
              "load": "balanced",
              "label": "Web Server 2",
              "status": "healthy"
            },
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 200
            }
          },
          {
            "id": "4",
            "data": {
              "label": "Database",
              "status": "healthy",
              "concurrent_connections": 1000
            },
            "type": "database",
            "position": {
              "x": 300,
              "y": 350
            }
          }
        ]
      },
      "system_requirements": [
        {
          "id": "horizontal_scaling",
          "type": "architecture",
          "priority": "critical",
          "validation": "nodes.filter(n => n.data.category === \"compute\").length >= 2",
          "description": "Scale web servers horizontally to handle traffic surge",
          "required_nodes": [
            "compute"
          ],
          "validation_type": "node_count",
          "min_nodes_of_type": {
            "compute": 2
          }
        },
        {
          "id": "load_distribution",
          "type": "architecture",
          "priority": "critical",
          "validation": "nodes.some(n => n.data.category === \"load_balancer\") && edges.some(e => { const source = nodes.find(n => n.id === e.source); const target = nodes.find(n => n.id === e.target); return source?.data.category === \"load_balancer\" && target?.data.category === \"compute\"; })",
          "description": "Implement load balancing to distribute traffic evenly",
          "required_nodes": [
            "load_balancer",
            "compute"
          ],
          "validation_type": "node_and_connection",
          "required_connection": {
            "to": "compute",
            "from": "load_balancer"
          }
        },
        {
          "id": "high_availability",
          "type": "performance",
          "priority": "high",
          "validation": "true",
          "description": "Maintain 95% success rate under high load",
          "target_value": 0.95,
          "target_metric": "success_rate",
          "validation_type": "metric"
        }
      ]
    },
    {
      "id": "10212d88-62bb-4bf1-830c-8adedc6635f0",
      "mission_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "stage_number": 7,
      "title": "CDC Real-time Updates",
      "problem_description": "CDC wants real-time updates! But notifications block everything. Similar cases found in 3 other states!",
      "initial_system_state": {
        "edges": [],
        "nodes": [
          {
            "id": "1",
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 150
            }
          },
          {
            "id": "3",
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 150
            }
          },
          {
            "id": "4",
            "type": "cache",
            "position": {
              "x": 300,
              "y": 100
            }
          },
          {
            "id": "5",
            "type": "session_store",
            "position": {
              "x": 100,
              "y": 150
            }
          },
          {
            "id": "6",
            "type": "database",
            "position": {
              "x": 200,
              "y": 300
            }
          },
          {
            "id": "7",
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 300
            }
          },
          {
            "id": "8",
            "type": "cdn",
            "position": {
              "x": 500,
              "y": 50
            }
          },
          {
            "id": "9",
            "type": "storage",
            "position": {
              "x": 500,
              "y": 150
            }
          }
        ]
      },
      "error_messages": [
        "Notification system blocking requests",
        "Report processing backing up",
        "Analysis delayed"
      ],
      "performance_issues": {
        "blocking_operations": true,
        "processing_delay_minutes": 30
      },
      "required_components": [
        "message_queue"
      ],
      "optional_components": [],
      "validation_rules": {
        "max_cost": 190,
        "decoupled_notifications": true,
        "requires_async_processing": true
      },
      "budget_limit": "190",
      "performance_requirements": {
        "async_processing": true,
        "notification_delay_seconds": 5
      },
      "special_constraints": null,
      "time_pressure_seconds": null,
      "concepts_taught": [
        "message_queues",
        "async_processing",
        "decoupling",
        "pub_sub"
      ],
      "components_unlocked": [
        "message_queue"
      ],
      "created_at": "2025-07-16 23:03:03.353165+00",
      "success_system_state": {
        "edges": [
          {
            "id": "e1-2",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "2"
          },
          {
            "id": "e1-3",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "3"
          },
          {
            "id": "e2-4",
            "data": {
              "label": "Cache lookup"
            },
            "source": "2",
            "target": "4"
          },
          {
            "id": "e3-4",
            "data": {
              "label": "Cache lookup"
            },
            "source": "3",
            "target": "4"
          },
          {
            "id": "e2-5",
            "data": {
              "label": "Session data"
            },
            "source": "2",
            "target": "5"
          },
          {
            "id": "e3-5",
            "data": {
              "label": "Session data"
            },
            "source": "3",
            "target": "5"
          },
          {
            "id": "e4-6",
            "data": {
              "label": "Database queries"
            },
            "source": "4",
            "target": "6"
          },
          {
            "id": "e6-7",
            "data": {
              "label": "Replication"
            },
            "source": "6",
            "target": "7"
          },
          {
            "id": "e8-9",
            "data": {
              "label": "Static content"
            },
            "source": "8",
            "target": "9"
          },
          {
            "id": "e2-10",
            "data": {
              "label": "Async notifications"
            },
            "source": "2",
            "target": "10"
          },
          {
            "id": "e3-10",
            "data": {
              "label": "Async notifications"
            },
            "source": "3",
            "target": "10"
          }
        ],
        "nodes": [
          {
            "id": "1",
            "data": {
              "label": "Load Balancer",
              "status": "healthy"
            },
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "data": {
              "label": "Web Server 1",
              "status": "healthy"
            },
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 150
            }
          },
          {
            "id": "3",
            "data": {
              "label": "Web Server 2",
              "status": "healthy"
            },
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 150
            }
          },
          {
            "id": "4",
            "data": {
              "label": "Cache Layer",
              "status": "healthy"
            },
            "type": "cache",
            "position": {
              "x": 300,
              "y": 100
            }
          },
          {
            "id": "5",
            "data": {
              "label": "Session Store",
              "status": "healthy"
            },
            "type": "session_store",
            "position": {
              "x": 100,
              "y": 150
            }
          },
          {
            "id": "6",
            "data": {
              "label": "Primary Database",
              "status": "healthy"
            },
            "type": "database",
            "position": {
              "x": 200,
              "y": 300
            }
          },
          {
            "id": "7",
            "data": {
              "label": "Database Replica",
              "status": "healthy"
            },
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 300
            }
          },
          {
            "id": "8",
            "data": {
              "label": "CDN",
              "status": "healthy"
            },
            "type": "cdn",
            "position": {
              "x": 500,
              "y": 50
            }
          },
          {
            "id": "9",
            "data": {
              "label": "Video Storage",
              "status": "healthy"
            },
            "type": "storage",
            "position": {
              "x": 500,
              "y": 150
            }
          },
          {
            "id": "10",
            "data": {
              "label": "Message Queue",
              "status": "healthy",
              "processing": "async",
              "notification_delay_seconds": 3
            },
            "type": "message_queue",
            "position": {
              "x": 300,
              "y": 250
            }
          }
        ]
      },
      "system_requirements": [
        {
          "id": "async_processing",
          "type": "architecture",
          "priority": "critical",
          "validation": "Must have message_queue component",
          "description": "Implement asynchronous message processing for notifications"
        },
        {
          "id": "decoupled_notifications",
          "type": "architecture",
          "priority": "critical",
          "validation": "decoupled_notifications = true",
          "description": "Decouple notification processing from main request flow"
        },
        {
          "id": "notification_latency",
          "type": "performance",
          "priority": "high",
          "validation": "notification_delay_seconds <= 5",
          "description": "Ensure notifications are sent within 5 seconds"
        },
        {
          "id": "non_blocking_operations",
          "type": "performance",
          "priority": "high",
          "validation": "async_processing = true",
          "description": "Prevent notifications from blocking main application flow"
        }
      ]
    },
    {
      "id": "eb88d7c4-00e6-4438-9f89-b50789abfd7b",
      "mission_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "stage_number": 9,
      "title": "Congressional Hearing Preparation",
      "problem_description": "Congressional hearing in 6 hours! Geographic correlation queries too complex for current database. Need more power!",
      "initial_system_state": {
        "edges": [],
        "nodes": [
          {
            "id": "1",
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 150
            }
          },
          {
            "id": "3",
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 150
            }
          },
          {
            "id": "4",
            "type": "cache",
            "position": {
              "x": 300,
              "y": 100
            }
          },
          {
            "id": "5",
            "type": "session_store",
            "position": {
              "x": 100,
              "y": 150
            }
          },
          {
            "id": "6",
            "type": "database",
            "position": {
              "x": 200,
              "y": 300
            }
          },
          {
            "id": "7",
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 300
            }
          },
          {
            "id": "8",
            "type": "cdn",
            "position": {
              "x": 500,
              "y": 50
            }
          },
          {
            "id": "9",
            "type": "storage",
            "position": {
              "x": 500,
              "y": 150
            }
          },
          {
            "id": "10",
            "type": "message_queue",
            "position": {
              "x": 300,
              "y": 250
            }
          },
          {
            "id": "11",
            "type": "monitoring",
            "position": {
              "x": 100,
              "y": 50
            }
          }
        ]
      },
      "error_messages": [
        "Query timeout on geographic analysis",
        "Complex JOIN operations failing",
        "Heat map generation: 45 seconds"
      ],
      "performance_issues": {
        "database_cpu": 100,
        "complex_query_time_seconds": 45
      },
      "required_components": [
        "database_xl"
      ],
      "optional_components": [],
      "validation_rules": {
        "max_cost": 250,
        "database_upgrade": true,
        "requires_vertical_scaling": true
      },
      "budget_limit": "250",
      "performance_requirements": {
        "concurrent_analytics": 10,
        "complex_query_time_seconds": 5
      },
      "special_constraints": null,
      "time_pressure_seconds": 21600,
      "concepts_taught": [
        "vertical_scaling",
        "database_optimization",
        "query_performance",
        "scaling_strategies"
      ],
      "components_unlocked": [
        "database_xl"
      ],
      "created_at": "2025-07-16 23:03:27.859971+00",
      "success_system_state": {
        "edges": [
          {
            "id": "e1-2",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "2"
          },
          {
            "id": "e1-3",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "3"
          },
          {
            "id": "e2-4",
            "data": {
              "label": "Cache lookup"
            },
            "source": "2",
            "target": "4"
          },
          {
            "id": "e3-4",
            "data": {
              "label": "Cache lookup"
            },
            "source": "3",
            "target": "4"
          },
          {
            "id": "e2-5",
            "data": {
              "label": "Session data"
            },
            "source": "2",
            "target": "5"
          },
          {
            "id": "e3-5",
            "data": {
              "label": "Session data"
            },
            "source": "3",
            "target": "5"
          },
          {
            "id": "e4-12",
            "data": {
              "label": "Analytics queries"
            },
            "source": "4",
            "target": "12"
          },
          {
            "id": "e12-7",
            "data": {
              "label": "Replication"
            },
            "source": "12",
            "target": "7"
          },
          {
            "id": "e8-9",
            "data": {
              "label": "Static content"
            },
            "source": "8",
            "target": "9"
          },
          {
            "id": "e2-10",
            "data": {
              "label": "Async notifications"
            },
            "source": "2",
            "target": "10"
          },
          {
            "id": "e3-10",
            "data": {
              "label": "Async notifications"
            },
            "source": "3",
            "target": "10"
          },
          {
            "id": "e11-1",
            "data": {
              "label": "Monitoring"
            },
            "source": "11",
            "target": "1"
          },
          {
            "id": "e11-12",
            "data": {
              "label": "Monitoring"
            },
            "source": "11",
            "target": "12"
          }
        ],
        "nodes": [
          {
            "id": "1",
            "data": {
              "label": "Load Balancer",
              "status": "healthy"
            },
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "data": {
              "label": "Web Server 1",
              "status": "healthy"
            },
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 150
            }
          },
          {
            "id": "3",
            "data": {
              "label": "Web Server 2",
              "status": "healthy"
            },
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 150
            }
          },
          {
            "id": "4",
            "data": {
              "label": "Cache Layer",
              "status": "healthy"
            },
            "type": "cache",
            "position": {
              "x": 300,
              "y": 100
            }
          },
          {
            "id": "5",
            "data": {
              "label": "Session Store",
              "status": "healthy"
            },
            "type": "session_store",
            "position": {
              "x": 100,
              "y": 150
            }
          },
          {
            "id": "7",
            "data": {
              "label": "Database Replica",
              "status": "healthy"
            },
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 300
            }
          },
          {
            "id": "8",
            "data": {
              "label": "CDN",
              "status": "healthy"
            },
            "type": "cdn",
            "position": {
              "x": 500,
              "y": 50
            }
          },
          {
            "id": "9",
            "data": {
              "label": "Video Storage",
              "status": "healthy"
            },
            "type": "storage",
            "position": {
              "x": 500,
              "y": 150
            }
          },
          {
            "id": "10",
            "data": {
              "label": "Message Queue",
              "status": "healthy"
            },
            "type": "message_queue",
            "position": {
              "x": 300,
              "y": 250
            }
          },
          {
            "id": "11",
            "data": {
              "label": "Monitoring System",
              "status": "healthy"
            },
            "type": "monitoring",
            "position": {
              "x": 100,
              "y": 50
            }
          },
          {
            "id": "12",
            "data": {
              "label": "High-Performance Database",
              "status": "healthy",
              "compute_power": "enhanced",
              "concurrent_analytics": 12,
              "complex_query_time_seconds": 4.2
            },
            "type": "database_xl",
            "position": {
              "x": 200,
              "y": 300
            }
          }
        ]
      },
      "system_requirements": [
        {
          "id": "vertical_scaling",
          "type": "architecture",
          "priority": "critical",
          "validation": "Must have database_xl component",
          "description": "Upgrade database to handle complex analytical queries"
        },
        {
          "id": "analytics_performance",
          "type": "performance",
          "priority": "critical",
          "validation": "concurrent_analytics >= 10",
          "description": "Support 10 concurrent complex analytical queries"
        },
        {
          "id": "query_optimization",
          "type": "performance",
          "priority": "high",
          "validation": "complex_query_time_seconds <= 5",
          "description": "Complex geographic queries must complete in under 5 seconds"
        },
        {
          "id": "high_compute_capacity",
          "type": "scalability",
          "priority": "high",
          "validation": "database_upgrade = true",
          "description": "Provide sufficient compute power for large-scale data analysis"
        }
      ]
    },
    {
      "id": "330b3463-4152-48d0-b4a9-129026964bcc",
      "mission_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "stage_number": 4,
      "title": "Slow Symptom Checker",
      "problem_description": "Symptom checker page takes 15 seconds to load. Families give up before submitting reports. City council meeting tomorrow!",
      "initial_system_state": {
        "edges": [
          {
            "id": "e1-2",
            "source": "1",
            "target": "2"
          },
          {
            "id": "e1-3",
            "source": "1",
            "target": "3"
          },
          {
            "id": "e2-4",
            "source": "2",
            "target": "4"
          },
          {
            "id": "e3-5",
            "source": "3",
            "target": "5"
          },
          {
            "id": "e4-5",
            "data": {
              "label": "replication"
            },
            "source": "4",
            "target": "5"
          }
        ],
        "nodes": [
          {
            "id": "1",
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 200
            }
          },
          {
            "id": "3",
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 200
            }
          },
          {
            "id": "4",
            "type": "database",
            "position": {
              "x": 200,
              "y": 350
            }
          },
          {
            "id": "5",
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 350
            }
          }
        ]
      },
      "error_messages": [
        "Symptom checker query: 15s response time",
        "Same query runs 500 times/minute",
        "Database CPU at 89%"
      ],
      "performance_issues": {
        "repeated_queries": 500,
        "page_load_time_ms": 15000
      },
      "required_components": [
        "load_balancer",
        "web_server",
        "web_server",
        "database",
        "database_replica",
        "cache"
      ],
      "optional_components": [],
      "validation_rules": {
        "max_cost": 130,
        "requires_cache": true,
        "cache_hit_ratio": 0.9
      },
      "budget_limit": "130",
      "performance_requirements": {
        "database_cpu": 50,
        "max_response_time_ms": 1000
      },
      "special_constraints": null,
      "time_pressure_seconds": 7200,
      "concepts_taught": [
        "caching_strategies",
        "cache_invalidation",
        "performance_optimization"
      ],
      "components_unlocked": [
        "cache"
      ],
      "created_at": "2025-07-16 23:02:16.880294+00",
      "success_system_state": {
        "edges": [
          {
            "id": "e1-2",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "2"
          },
          {
            "id": "e1-3",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "3"
          },
          {
            "id": "e2-6",
            "data": {
              "label": "Cache lookup"
            },
            "source": "2",
            "target": "6"
          },
          {
            "id": "e3-6",
            "data": {
              "label": "Cache lookup"
            },
            "source": "3",
            "target": "6"
          },
          {
            "id": "e6-4",
            "data": {
              "label": "Cache miss -> DB query"
            },
            "source": "6",
            "target": "4"
          },
          {
            "id": "e4-5",
            "data": {
              "label": "Replication"
            },
            "source": "4",
            "target": "5"
          }
        ],
        "nodes": [
          {
            "id": "1",
            "data": {
              "label": "Load Balancer",
              "status": "healthy"
            },
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "data": {
              "label": "Web Server 1",
              "status": "healthy"
            },
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 150
            }
          },
          {
            "id": "3",
            "data": {
              "label": "Web Server 2",
              "status": "healthy"
            },
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 150
            }
          },
          {
            "id": "4",
            "data": {
              "label": "Primary Database",
              "status": "healthy",
              "cpu_usage": 45
            },
            "type": "database",
            "position": {
              "x": 200,
              "y": 350
            }
          },
          {
            "id": "5",
            "data": {
              "label": "Database Replica",
              "status": "healthy"
            },
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 350
            }
          },
          {
            "id": "6",
            "data": {
              "label": "Cache Layer",
              "status": "healthy",
              "hit_ratio": 0.92,
              "response_time_ms": 800
            },
            "type": "cache",
            "position": {
              "x": 300,
              "y": 250
            }
          }
        ]
      },
      "system_requirements": [
        {
          "id": "caching_layer",
          "type": "architecture",
          "priority": "critical",
          "validation": "Must have cache component",
          "description": "Implement caching to reduce repeated database queries"
        },
        {
          "id": "response_optimization",
          "type": "performance",
          "priority": "critical",
          "validation": "max_response_time_ms <= 1000",
          "description": "Reduce page load time to under 1 second"
        },
        {
          "id": "database_load_reduction",
          "type": "performance",
          "priority": "high",
          "validation": "database_cpu <= 50",
          "description": "Reduce database CPU usage below 50%"
        },
        {
          "id": "cache_efficiency",
          "type": "performance",
          "priority": "high",
          "validation": "cache_hit_ratio >= 0.9",
          "description": "Achieve 90% cache hit ratio for repeated queries"
        }
      ]
    },
    {
      "id": "1bf29cb6-ca60-424c-811b-0703ccb974da",
      "mission_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "stage_number": 6,
      "title": "State Health Department Integration",
      "problem_description": "State epidemiologists using the data! But sessions keep getting lost when scaling. Families losing half-completed reports.",
      "initial_system_state": {
        "nodes": [
          {
            "id": "1",
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "data": {
              "sessions": "local"
            },
            "type": "web_server",
            "position": {
              "x": 150,
              "y": 200
            }
          },
          {
            "id": "3",
            "data": {
              "sessions": "local"
            },
            "type": "web_server",
            "position": {
              "x": 300,
              "y": 200
            }
          },
          {
            "id": "4",
            "data": {
              "sessions": "local"
            },
            "type": "web_server",
            "position": {
              "x": 450,
              "y": 200
            }
          },
          {
            "id": "5",
            "type": "cache",
            "position": {
              "x": 300,
              "y": 125
            }
          },
          {
            "id": "6",
            "type": "database",
            "position": {
              "x": 200,
              "y": 350
            }
          },
          {
            "id": "7",
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 350
            }
          },
          {
            "id": "8",
            "type": "cdn",
            "position": {
              "x": 500,
              "y": 50
            }
          },
          {
            "id": "9",
            "type": "storage",
            "position": {
              "x": 500,
              "y": 200
            }
          }
        ]
      },
      "error_messages": [
        "Session lost on server switch",
        "Form data disappeared",
        "User logged out randomly"
      ],
      "performance_issues": {
        "user_complaints": 47,
        "session_loss_rate": 0.3
      },
      "required_components": [
        "session_store"
      ],
      "optional_components": [],
      "validation_rules": {
        "max_cost": 170,
        "stateless_servers": true,
        "requires_external_sessions": true
      },
      "budget_limit": "170",
      "performance_requirements": {
        "session_persistence": 1,
        "auto_scaling_enabled": true
      },
      "special_constraints": null,
      "time_pressure_seconds": null,
      "concepts_taught": [
        "stateless_architecture",
        "session_management",
        "horizontal_scaling_advanced"
      ],
      "components_unlocked": [
        "session_store"
      ],
      "created_at": "2025-07-16 23:02:43.231382+00",
      "success_system_state": {
        "edges": [
          {
            "id": "e1-2",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "2"
          },
          {
            "id": "e1-3",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "3"
          },
          {
            "id": "e1-4",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "4"
          },
          {
            "id": "e2-5",
            "data": {
              "label": "Cache lookup"
            },
            "source": "2",
            "target": "5"
          },
          {
            "id": "e3-5",
            "data": {
              "label": "Cache lookup"
            },
            "source": "3",
            "target": "5"
          },
          {
            "id": "e4-5",
            "data": {
              "label": "Cache lookup"
            },
            "source": "4",
            "target": "5"
          },
          {
            "id": "e2-11",
            "data": {
              "label": "Session data"
            },
            "source": "2",
            "target": "11"
          },
          {
            "id": "e3-11",
            "data": {
              "label": "Session data"
            },
            "source": "3",
            "target": "11"
          },
          {
            "id": "e4-11",
            "data": {
              "label": "Session data"
            },
            "source": "4",
            "target": "11"
          },
          {
            "id": "e5-6",
            "data": {
              "label": "Database queries"
            },
            "source": "5",
            "target": "6"
          },
          {
            "id": "e6-7",
            "data": {
              "label": "Replication"
            },
            "source": "6",
            "target": "7"
          },
          {
            "id": "e8-9",
            "data": {
              "label": "Static content"
            },
            "source": "8",
            "target": "9"
          }
        ],
        "nodes": [
          {
            "id": "1",
            "data": {
              "label": "Load Balancer",
              "status": "healthy"
            },
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "data": {
              "label": "Web Server 1",
              "status": "healthy",
              "sessions": "external"
            },
            "type": "web_server",
            "position": {
              "x": 150,
              "y": 200
            }
          },
          {
            "id": "3",
            "data": {
              "label": "Web Server 2",
              "status": "healthy",
              "sessions": "external"
            },
            "type": "web_server",
            "position": {
              "x": 300,
              "y": 200
            }
          },
          {
            "id": "4",
            "data": {
              "label": "Web Server 3",
              "status": "healthy",
              "sessions": "external"
            },
            "type": "web_server",
            "position": {
              "x": 450,
              "y": 200
            }
          },
          {
            "id": "5",
            "data": {
              "label": "Cache Layer",
              "status": "healthy"
            },
            "type": "cache",
            "position": {
              "x": 300,
              "y": 125
            }
          },
          {
            "id": "6",
            "data": {
              "label": "Primary Database",
              "status": "healthy"
            },
            "type": "database",
            "position": {
              "x": 200,
              "y": 350
            }
          },
          {
            "id": "7",
            "data": {
              "label": "Database Replica",
              "status": "healthy"
            },
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 350
            }
          },
          {
            "id": "8",
            "data": {
              "label": "CDN",
              "status": "healthy"
            },
            "type": "cdn",
            "position": {
              "x": 500,
              "y": 50
            }
          },
          {
            "id": "9",
            "data": {
              "label": "Video Storage",
              "status": "healthy"
            },
            "type": "storage",
            "position": {
              "x": 500,
              "y": 200
            }
          },
          {
            "id": "11",
            "data": {
              "label": "Session Store",
              "status": "healthy",
              "persistence": "100%"
            },
            "type": "session_store",
            "position": {
              "x": 100,
              "y": 150
            }
          }
        ]
      },
      "system_requirements": [
        {
          "id": "session_persistence",
          "type": "architecture",
          "priority": "critical",
          "validation": "Must have session_store component",
          "description": "Implement external session storage for stateless web servers"
        },
        {
          "id": "stateless_servers",
          "type": "architecture",
          "priority": "critical",
          "validation": "stateless_servers = true",
          "description": "Make web servers stateless to enable auto-scaling"
        },
        {
          "id": "session_reliability",
          "type": "reliability",
          "priority": "high",
          "validation": "session_persistence = 1",
          "description": "Ensure 100% session persistence across server restarts"
        },
        {
          "id": "auto_scaling",
          "type": "scalability",
          "priority": "high",
          "validation": "auto_scaling_enabled = true",
          "description": "Enable automatic scaling based on demand"
        }
      ]
    },
    {
      "id": "589e63ee-b900-4b1f-9bf2-771997d71cc6",
      "mission_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "stage_number": 8,
      "title": "Mystery Performance Issues",
      "problem_description": "Random slowdowns but can't identify cause. EPA visiting tomorrow to review evidence. 10,000 reports now!",
      "initial_system_state": {
        "edges": [],
        "nodes": [
          {
            "id": "1",
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 150
            }
          },
          {
            "id": "3",
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 150
            }
          },
          {
            "id": "4",
            "type": "cache",
            "position": {
              "x": 300,
              "y": 100
            }
          },
          {
            "id": "5",
            "type": "session_store",
            "position": {
              "x": 100,
              "y": 150
            }
          },
          {
            "id": "6",
            "type": "database",
            "position": {
              "x": 200,
              "y": 300
            }
          },
          {
            "id": "7",
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 300
            }
          },
          {
            "id": "8",
            "type": "cdn",
            "position": {
              "x": 500,
              "y": 50
            }
          },
          {
            "id": "9",
            "type": "storage",
            "position": {
              "x": 500,
              "y": 150
            }
          },
          {
            "id": "10",
            "type": "message_queue",
            "position": {
              "x": 300,
              "y": 250
            }
          }
        ]
      },
      "error_messages": [
        "Random slowdowns",
        "Can't identify bottleneck",
        "No visibility into system"
      ],
      "performance_issues": {
        "unknown_issues": true,
        "troubleshooting_time_hours": 4
      },
      "required_components": [
        "monitoring"
      ],
      "optional_components": [],
      "validation_rules": {
        "max_cost": 200,
        "metrics_coverage": 0.95,
        "requires_monitoring": true
      },
      "budget_limit": "200",
      "performance_requirements": {
        "observability": true,
        "alert_response_time_seconds": 60
      },
      "special_constraints": null,
      "time_pressure_seconds": 21600,
      "concepts_taught": [
        "observability",
        "monitoring",
        "metrics",
        "logging",
        "alerting"
      ],
      "components_unlocked": [
        "monitoring"
      ],
      "created_at": "2025-07-16 23:03:15.591673+00",
      "success_system_state": {
        "edges": [
          {
            "id": "e1-2",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "2"
          },
          {
            "id": "e1-3",
            "data": {
              "label": "Load balanced traffic"
            },
            "source": "1",
            "target": "3"
          },
          {
            "id": "e2-4",
            "data": {
              "label": "Cache lookup"
            },
            "source": "2",
            "target": "4"
          },
          {
            "id": "e3-4",
            "data": {
              "label": "Cache lookup"
            },
            "source": "3",
            "target": "4"
          },
          {
            "id": "e2-5",
            "data": {
              "label": "Session data"
            },
            "source": "2",
            "target": "5"
          },
          {
            "id": "e3-5",
            "data": {
              "label": "Session data"
            },
            "source": "3",
            "target": "5"
          },
          {
            "id": "e4-6",
            "data": {
              "label": "Database queries"
            },
            "source": "4",
            "target": "6"
          },
          {
            "id": "e6-7",
            "data": {
              "label": "Replication"
            },
            "source": "6",
            "target": "7"
          },
          {
            "id": "e8-9",
            "data": {
              "label": "Static content"
            },
            "source": "8",
            "target": "9"
          },
          {
            "id": "e2-10",
            "data": {
              "label": "Async notifications"
            },
            "source": "2",
            "target": "10"
          },
          {
            "id": "e3-10",
            "data": {
              "label": "Async notifications"
            },
            "source": "3",
            "target": "10"
          },
          {
            "id": "e11-1",
            "data": {
              "label": "Monitoring"
            },
            "source": "11",
            "target": "1"
          },
          {
            "id": "e11-2",
            "data": {
              "label": "Monitoring"
            },
            "source": "11",
            "target": "2"
          },
          {
            "id": "e11-3",
            "data": {
              "label": "Monitoring"
            },
            "source": "11",
            "target": "3"
          },
          {
            "id": "e11-4",
            "data": {
              "label": "Monitoring"
            },
            "source": "11",
            "target": "4"
          },
          {
            "id": "e11-6",
            "data": {
              "label": "Monitoring"
            },
            "source": "11",
            "target": "6"
          },
          {
            "id": "e11-10",
            "data": {
              "label": "Monitoring"
            },
            "source": "11",
            "target": "10"
          }
        ],
        "nodes": [
          {
            "id": "1",
            "data": {
              "label": "Load Balancer",
              "status": "healthy"
            },
            "type": "load_balancer",
            "position": {
              "x": 300,
              "y": 50
            }
          },
          {
            "id": "2",
            "data": {
              "label": "Web Server 1",
              "status": "healthy"
            },
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 150
            }
          },
          {
            "id": "3",
            "data": {
              "label": "Web Server 2",
              "status": "healthy"
            },
            "type": "web_server",
            "position": {
              "x": 400,
              "y": 150
            }
          },
          {
            "id": "4",
            "data": {
              "label": "Cache Layer",
              "status": "healthy"
            },
            "type": "cache",
            "position": {
              "x": 300,
              "y": 100
            }
          },
          {
            "id": "5",
            "data": {
              "label": "Session Store",
              "status": "healthy"
            },
            "type": "session_store",
            "position": {
              "x": 100,
              "y": 150
            }
          },
          {
            "id": "6",
            "data": {
              "label": "Primary Database",
              "status": "healthy"
            },
            "type": "database",
            "position": {
              "x": 200,
              "y": 300
            }
          },
          {
            "id": "7",
            "data": {
              "label": "Database Replica",
              "status": "healthy"
            },
            "type": "database_replica",
            "position": {
              "x": 400,
              "y": 300
            }
          },
          {
            "id": "8",
            "data": {
              "label": "CDN",
              "status": "healthy"
            },
            "type": "cdn",
            "position": {
              "x": 500,
              "y": 50
            }
          },
          {
            "id": "9",
            "data": {
              "label": "Video Storage",
              "status": "healthy"
            },
            "type": "storage",
            "position": {
              "x": 500,
              "y": 150
            }
          },
          {
            "id": "10",
            "data": {
              "label": "Message Queue",
              "status": "healthy"
            },
            "type": "message_queue",
            "position": {
              "x": 300,
              "y": 250
            }
          },
          {
            "id": "11",
            "data": {
              "label": "Monitoring System",
              "status": "healthy",
              "metrics_coverage": 0.98,
              "alert_response_time_seconds": 45
            },
            "type": "monitoring",
            "position": {
              "x": 100,
              "y": 50
            }
          }
        ]
      },
      "system_requirements": [
        {
          "id": "observability",
          "type": "architecture",
          "priority": "critical",
          "validation": "Must have monitoring component",
          "description": "Implement comprehensive monitoring and observability"
        },
        {
          "id": "metrics_coverage",
          "type": "monitoring",
          "priority": "critical",
          "validation": "metrics_coverage >= 0.95",
          "description": "Monitor 95% of system components and performance metrics"
        },
        {
          "id": "alert_responsiveness",
          "type": "monitoring",
          "priority": "high",
          "validation": "alert_response_time_seconds <= 60",
          "description": "Alerts must trigger within 60 seconds of issues"
        },
        {
          "id": "performance_visibility",
          "type": "monitoring",
          "priority": "high",
          "validation": "observability = true",
          "description": "Provide visibility into application performance bottlenecks"
        }
      ]
    },
    {
      "id": "bcd0760f-c920-44e8-b658-1674341ea1d8",
      "mission_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "stage_number": 1,
      "title": "The Crashing Laptop",
      "problem_description": "Alex's laptop is running both web server and database, causing crashes when 200+ families try to report symptoms.",
      "initial_system_state": {
        "edges": [],
        "nodes": [
          {
            "id": "1",
            "data": {
              "label": "Alex's Laptop (Web + DB)",
              "status": "critical",
              "combined": true
            },
            "type": "web_server",
            "position": {
              "x": 300,
              "y": 200
            }
          }
        ]
      },
      "error_messages": [
        "Database queries blocking web requests",
        "Connection timeout - server not responding",
        "Lost 47 symptom reports due to crashes"
      ],
      "performance_issues": {
        "cpu_usage": 98,
        "memory_usage": 95,
        "response_time_ms": 15000
      },
      "required_components": [
        "web_server",
        "database"
      ],
      "optional_components": [],
      "validation_rules": {
        "max_cost": 50,
        "must_connect": true,
        "min_components": 2,
        "required_separation": [
          "web_server",
          "database"
        ]
      },
      "budget_limit": "50",
      "performance_requirements": {
        "max_response_time_ms": 3000,
        "min_concurrent_users": 200
      },
      "special_constraints": null,
      "time_pressure_seconds": null,
      "concepts_taught": [
        "separation_of_concerns",
        "database_basics",
        "web_server_basics"
      ],
      "components_unlocked": [
        "database",
        "storage"
      ],
      "created_at": "2025-07-16 23:01:41.133622+00",
      "success_system_state": {
        "edges": [
          {
            "id": "e1-2",
            "data": {
              "label": "Database queries",
              "status": "healthy"
            },
            "source": "1",
            "target": "2"
          }
        ],
        "nodes": [
          {
            "id": "1",
            "data": {
              "label": "Web Server",
              "status": "healthy",
              "concurrent_users": 250
            },
            "type": "web_server",
            "position": {
              "x": 200,
              "y": 150
            }
          },
          {
            "id": "2",
            "data": {
              "label": "Database",
              "status": "healthy",
              "response_time_ms": 2500
            },
            "type": "database",
            "position": {
              "x": 400,
              "y": 150
            }
          }
        ]
      },
      "system_requirements": [
        {
          "id": "separate_server",
          "type": "architecture",
          "priority": "critical",
          "min_nodes": 2,
          "validation": "nodes.length >= 2 && nodes.some(n => n.data.category === \"compute\") && nodes.some(n => n.data.category === \"database\")",
          "description": "Separate web server from database",
          "required_nodes": [
            "compute",
            "database"
          ],
          "validation_type": "node_categories"
        },
        {
          "id": "connect_server_db",
          "type": "connectivity",
          "priority": "critical",
          "validation": "edges.some(e => { const source = nodes.find(n => n.id === e.source); const target = nodes.find(n => n.id === e.target); return (source?.data.category === \"compute\" && target?.data.category === \"database\") || (source?.data.category === \"database\" && target?.data.category === \"compute\"); })",
          "description": "Connect web server to database",
          "validation_type": "edge_connection",
          "required_connection": {
            "to": "database",
            "from": "compute"
          }
        },
        {
          "id": "connect_families",
          "type": "connectivity",
          "priority": "high",
          "validation": "edges.some(e => { const source = nodes.find(n => n.id === e.source); const target = nodes.find(n => n.id === e.target); return (source?.data.label === \"Families\" && target?.data.category === \"compute\") || (source?.data.category === \"compute\" && target?.data.label === \"Families\"); })",
          "description": "Connect families to web server",
          "validation_type": "edge_connection",
          "required_connection": {
            "to": "compute",
            "from": "families"
          }
        }
      ]
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "mission_id": "11111111-1111-1111-1111-111111111111",
      "stage_number": 1,
      "title": "Separate Database from Web Server",
      "problem_description": "The current system has both web server and database running on the same machine, causing crashes when 200+ families try to submit health data simultaneously.",
      "initial_system_state": {
        "edges": [],
        "nodes": [
          {
            "id": "combined-server-1",
            "data": {
              "label": "Alex's Laptop",
              "specs": {
                "cpu": "2 cores",
                "ram": "8GB",
                "storage": "256GB SSD"
              },
              "services": [
                "web_server",
                "mysql_database"
              ],
              "component_type": "combined_server"
            },
            "type": "server",
            "position": {
              "x": 250,
              "y": 200
            }
          }
        ],
        "problems": [
          "Database queries blocking web requests",
          "Memory exhausted",
          "Single point of failure"
        ]
      },
      "error_messages": [],
      "performance_issues": [],
      "required_components": [
        "web_server",
        "database"
      ],
      "optional_components": [],
      "validation_rules": {},
      "budget_limit": null,
      "performance_requirements": null,
      "special_constraints": null,
      "time_pressure_seconds": null,
      "concepts_taught": [
        "client_server_separation",
        "database_isolation",
        "load_distribution"
      ],
      "components_unlocked": [],
      "created_at": "2025-07-18 00:52:24.50029+00",
      "success_system_state": null,
      "system_requirements": null
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "mission_id": "11111111-1111-1111-1111-111111111111",
      "stage_number": 2,
      "title": "Handle Media Traffic Surge",
      "problem_description": "Local news coverage caused traffic to spike to 1000+ concurrent users uploading symptom photos. The single web server can't handle the load.",
      "initial_system_state": {
        "edges": [
          {
            "id": "e1",
            "source": "web-server-1",
            "target": "database-1"
          }
        ],
        "nodes": [
          {
            "id": "web-server-1",
            "data": {
              "label": "Web Server",
              "component_type": "web_server"
            },
            "type": "server",
            "position": {
              "x": 150,
              "y": 150
            }
          },
          {
            "id": "database-1",
            "data": {
              "label": "Database",
              "component_type": "database"
            },
            "type": "database",
            "position": {
              "x": 350,
              "y": 150
            }
          }
        ],
        "problems": [
          "503 Service Unavailable",
          "Response time > 10 seconds",
          "Photo uploads failing"
        ]
      },
      "error_messages": [],
      "performance_issues": [],
      "required_components": [
        "load_balancer",
        "web_server",
        "database",
        "storage"
      ],
      "optional_components": [],
      "validation_rules": {},
      "budget_limit": null,
      "performance_requirements": null,
      "special_constraints": null,
      "time_pressure_seconds": null,
      "concepts_taught": [
        "horizontal_scaling",
        "load_balancing",
        "media_storage"
      ],
      "components_unlocked": [],
      "created_at": "2025-07-18 00:52:24.50029+00",
      "success_system_state": null,
      "system_requirements": null
    }
  ]