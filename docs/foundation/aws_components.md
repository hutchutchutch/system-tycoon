# AWS Components Reference for System Design Tycoon

**Version:** 3.0  
**Date:** January 2025  
**Purpose:** Comprehensive AWS service specifications for game implementation

---

## Overview

This document provides detailed technical specifications for AWS services used in System Design Tycoon. Each component includes pricing, performance limits, runtime characteristics, and implementation constraints based on official AWS documentation.

---

## Compute Services

### Serverless Compute
- **AWS Lambda**
  - *Game Component:* Serverless Function
  - *Use Case:* Event-driven processing, API backends, microservices
  - *Scaling:* Automatic, pay-per-execution
  - *Best For:* Intermittent workloads, rapid prototyping
  
  **📊 Pricing & Performance:**
  - **Cost:** $0.20 per 1M requests + $0.0000166667 per GB-second
  - **Free Tier:** 1M requests/month, 400,000 GB-seconds
  - **Memory:** 128MB - 10,240MB (64MB increments)
  - **Timeout:** 15 minutes maximum
  - **Concurrent Executions:** 1,000 (default), can request increase
  - **Cold Start:** 100ms-5s (varies by runtime and memory)
  - **Warm Execution:** <10ms overhead
  
  **🔧 Technical Specifications:**
  - **Runtime Environment:** Isolated containers with 512MB-10GB /tmp
  - **Init Phase:** 10-second limit for initialization
  - **Execution Environment Lifecycle:** Init → Invoke → Shutdown
  - **Network:** VPC support, IPv4/IPv6, no persistent connections
  - **Storage:** Read-only file system, /tmp for temporary files
  - **CPU:** Proportional to memory allocation
  
  **🎮 Game Implementation:**
  - **Scaling Animation:** Instant spawn with brief "warming" indicator
  - **Failure Modes:** Timeout failures, memory exceeded, cold start delays
  - **Connection Constraints:** Must connect through API Gateway or ALB
  - **Performance Degradation:** Cold starts under burst traffic
  - **Cost Implications:** Pay-per-use makes it cost-effective for low traffic

- **Amazon ECS (Elastic Container Service)**
  - *Game Component:* Container Service
  - *Use Case:* Microservices, batch processing, long-running applications
  - *Scaling:* Horizontal auto-scaling based on metrics
  - *Best For:* Containerized applications, consistent workloads

  **📊 Pricing & Performance:**
  - **Cost:** EC2 pricing + $0.0464 per vCPU-hour (Fargate)
  - **Fargate:** $0.04048 per vCPU-hour, $0.004445 per GB-hour
  - **EC2 Mode:** Only pay for underlying EC2 instances
  - **Scaling:** 0-1000 tasks per service (default)
  - **Start Time:** 1-4 minutes for new tasks
  - **CPU:** 0.25-4 vCPU (Fargate), unlimited (EC2)
  - **Memory:** 512MB-30GB (Fargate), instance-dependent (EC2)

  **🔧 Technical Specifications:**
  - **Task Definition:** JSON specification for containers
  - **Service Discovery:** AWS Cloud Map integration
  - **Load Balancing:** ALB/NLB integration
  - **Networking:** VPC, security groups, ENI per task
  - **Storage:** EBS volumes, EFS mounts, ephemeral storage
  - **Health Checks:** Container and load balancer health checks

  **🎮 Game Implementation:**
  - **Scaling Animation:** Gradual task spawning with progress indicators
  - **Failure Modes:** Task failures, capacity constraints, health check failures
  - **Connection Constraints:** Requires VPC, security groups, load balancer
  - **Performance Degradation:** Slower scaling than Lambda, resource contention
  - **Cost Implications:** Fixed costs for running containers

- **Amazon EC2 (Elastic Compute Cloud)**
  - *Game Component:* Virtual Server
  - *Use Case:* Traditional applications, databases, custom environments
  - *Scaling:* Manual or auto-scaling groups
  - *Best For:* Predictable workloads, legacy applications

  **📊 Pricing & Performance:**
  - **On-Demand:** $0.0116-$24.48 per hour (varies by instance type)
  - **Reserved:** Up to 75% savings with 1-3 year commitment
  - **Spot:** Up to 90% savings, can be interrupted
  - **Instance Types:** 400+ combinations of CPU, memory, storage, network
  - **Scaling:** Manual or Auto Scaling (1-10,000 instances)
  - **Boot Time:** 1-5 minutes depending on AMI and instance type

  **🔧 Technical Specifications:**
  - **Instance Types:** t3.nano (0.5GB) to u-24tb1.metal (24TB RAM)
  - **CPU:** Intel, AMD, ARM-based (Graviton) processors
  - **Network:** Up to 100 Gbps networking
  - **Storage:** EBS, instance store, EFS
  - **Virtualization:** Xen, Nitro hypervisor
  - **Operating Systems:** Linux, Windows, custom AMIs

  **🎮 Game Implementation:**
  - **Scaling Animation:** Slower instance launch with boot sequence
  - **Failure Modes:** Instance failures, capacity limits, AZ outages
  - **Connection Constraints:** Security groups, VPC, key pairs
  - **Performance Degradation:** CPU/memory limits, network throttling
  - **Cost Implications:** Continuous billing while running

---

## Storage Services

### Database Services
- **Amazon DynamoDB**
  - *Game Component:* NoSQL Database
  - *Use Case:* High-performance applications, gaming, mobile backends
  - *Scaling:* Automatic, serverless scaling
  - *Best For:* Single-digit millisecond latency, flexible data models

  **📊 Pricing & Performance:**
  - **On-Demand:** $0.25 per million read requests, $1.25 per million write requests
  - **Provisioned:** $0.0065 per RCU-hour, $0.0065 per WCU-hour
  - **Storage:** $0.25 per GB-month
  - **Global Tables:** Additional charges for cross-region replication
  - **Performance:** <10ms latency, unlimited throughput
  - **Consistency:** Eventually consistent reads (default), strongly consistent available

  **🔧 Technical Specifications:**
  - **Item Size:** 400KB maximum per item
  - **Partition Key Design:** Critical for performance distribution
  - **Read/Write Capacity:** Auto-scaling or provisioned
  - **Indexes:** Global Secondary Index (GSI), Local Secondary Index (LSI)
  - **Transactions:** ACID transactions across multiple items
  - **Backup:** Point-in-time recovery, on-demand backups

  **🎮 Game Implementation:**
  - **Scaling Animation:** Instant scaling with capacity indicators
  - **Failure Modes:** Hot partition issues, throttling, capacity exceeded
  - **Connection Constraints:** IAM roles, VPC endpoints optional
  - **Performance Degradation:** Throttling under burst traffic
  - **Cost Implications:** Pay-per-request or provisioned capacity

- **Amazon RDS (Relational Database Service)**
  - *Game Component:* SQL Database
  - *Use Case:* Traditional applications, complex queries, ACID compliance
  - *Scaling:* Vertical scaling, read replicas for horizontal reads
  - *Best For:* Structured data, complex relationships, reporting

  **📊 Pricing & Performance:**
  - **Cost:** $0.017-$13.338 per hour (varies by instance type)
  - **Storage:** $0.115 per GB-month (gp2), $0.125 per GB-month (gp3)
  - **IOPS:** $0.10 per provisioned IOPS-month
  - **Backup:** $0.095 per GB-month for backup storage
  - **Multi-AZ:** ~2x cost for high availability
  - **Performance:** Depends on instance type and storage configuration

  **🔧 Technical Specifications:**
  - **Engines:** MySQL, PostgreSQL, MariaDB, Oracle, SQL Server
  - **Instance Types:** db.t3.micro to db.x1e.32xlarge
  - **Storage Types:** gp2, gp3, io1, io2, magnetic
  - **Read Replicas:** Up to 5 per source, cross-region supported
  - **Multi-AZ:** Synchronous replication for high availability
  - **Backup:** Automated backups, manual snapshots

  **🎮 Game Implementation:**
  - **Scaling Animation:** Vertical scaling with brief downtime indicator
  - **Failure Modes:** Instance failures, storage full, connection limits
  - **Connection Constraints:** Security groups, parameter groups, subnet groups
  - **Performance Degradation:** CPU/memory limits, IOPS throttling
  - **Cost Implications:** Continuous billing, storage costs

### Object Storage
- **Amazon S3 (Simple Storage Service)**
  - *Game Component:* Object Storage
  - *Use Case:* Static websites, backups, data archiving, content distribution
  - *Scaling:* Virtually unlimited storage
  - *Best For:* Unstructured data, static content, data lakes

  **📊 Pricing & Performance:**
  - **Standard:** $0.023 per GB-month
  - **Infrequent Access:** $0.0125 per GB-month + retrieval fees
  - **Glacier:** $0.004 per GB-month (3-5 hour retrieval)
  - **Deep Archive:** $0.00099 per GB-month (12+ hour retrieval)
  - **Requests:** $0.0004 per 1,000 PUT requests, $0.0004 per 10,000 GET requests
  - **Transfer Acceleration:** $0.04-$0.08 per GB

  **🔧 Technical Specifications:**
  - **Object Size:** 0 bytes to 5TB per object
  - **Bucket Limits:** 100 buckets per account (can request increase)
  - **Durability:** 99.999999999% (11 9's)
  - **Availability:** 99.99% (Standard), varies by storage class
  - **Consistency:** Strong read-after-write consistency
  - **Transfer Acceleration:** CloudFront edge locations for faster uploads

  **🎮 Game Implementation:**
  - **Scaling Animation:** Instant storage expansion
  - **Failure Modes:** Bucket policy errors, access denied, rate limiting
  - **Connection Constraints:** IAM policies, bucket policies, CORS
  - **Performance Degradation:** Request rate limiting (3,500 PUT/5,500 GET per prefix)
  - **Cost Implications:** Pay for storage used and requests made

### Caching Services
- **Amazon ElastiCache**
  - *Game Component:* Cache
  - *Use Case:* Session storage, database caching, real-time analytics
  - *Scaling:* Horizontal scaling with sharding
  - *Best For:* Sub-millisecond latency, high-throughput applications

  **📊 Pricing & Performance:**
  - **Redis:** $0.0255-$54.72 per hour (varies by node type)
  - **Memcached:** $0.0255-$54.72 per hour (varies by node type)
  - **Data Transfer:** $0.02 per GB within AZ, $0.01 per GB cross-AZ
  - **Backup:** $0.085 per GB-month for Redis backups
  - **Performance:** <1ms latency, up to 25 Gbps network performance

  **🔧 Technical Specifications:**
  - **Node Types:** cache.t3.micro to cache.r7g.16xlarge
  - **Memory:** 512MB to 6.38TB per node
  - **Network:** 0.064 to 30 Gbps baseline bandwidth
  - **Clustering:** Redis Cluster mode, Memcached auto-discovery
  - **Replication:** Multi-AZ with automatic failover (Redis)
  - **Persistence:** Redis snapshots and AOF

  **🎮 Game Implementation:**
  - **Scaling Animation:** Node addition/removal with rebalancing
  - **Failure Modes:** Node failures, memory pressure, network issues
  - **Connection Constraints:** VPC, security groups, subnet groups
  - **Performance Degradation:** Memory pressure, CPU throttling
  - **Cost Implications:** Continuous billing for provisioned nodes

---

## Networking Services

### Load Balancing
- **Application Load Balancer (ALB)**
  - *Game Component:* Load Balancer
  - *Use Case:* HTTP/HTTPS traffic distribution, microservices routing
  - *Scaling:* Automatic scaling based on traffic
  - *Best For:* Layer 7 routing, SSL termination, advanced routing

  **📊 Pricing & Performance:**
  - **Cost:** $0.0225 per hour + $0.008 per LCU-hour
  - **Load Balancer Capacity Unit (LCU):** Based on connections, requests, bandwidth
  - **SSL Certificates:** Free with AWS Certificate Manager
  - **Performance:** Millions of requests per second
  - **Latency:** <1ms additional latency

  **🔧 Technical Specifications:**
  - **Protocols:** HTTP, HTTPS, gRPC
  - **Targets:** EC2 instances, IP addresses, Lambda functions
  - **Target Groups:** Health checks, sticky sessions, deregistration delay
  - **Rules:** Host-based, path-based, header-based routing
  - **SSL/TLS:** SNI support, perfect forward secrecy
  - **Zones:** Minimum 2 AZs, automatic cross-zone load balancing

  **🎮 Game Implementation:**
  - **Scaling Animation:** Capacity scaling with traffic indicators
  - **Failure Modes:** Target failures, health check failures, capacity limits
  - **Connection Constraints:** Security groups, target group configuration
  - **Performance Degradation:** Target overload, unhealthy targets
  - **Cost Implications:** Hourly + usage-based pricing

- **Network Load Balancer (NLB)**
  - *Game Component:* Network Load Balancer
  - *Use Case:* TCP/UDP traffic, extreme performance, static IP
  - *Scaling:* Automatic scaling, millions of requests per second
  - *Best For:* Layer 4 routing, ultra-low latency, high throughput

  **📊 Pricing & Performance:**
  - **Cost:** $0.0225 per hour + $0.006 per NLCU-hour
  - **Network Load Balancer Capacity Unit (NLCU):** Based on connections, bandwidth
  - **Performance:** Millions of requests per second, <100μs latency
  - **Bandwidth:** Up to 100 Gbps
  - **Connections:** Millions of concurrent connections

  **🔧 Technical Specifications:**
  - **Protocols:** TCP, UDP, TLS
  - **Targets:** EC2 instances, IP addresses, ALB
  - **Static IP:** Elastic IP addresses per AZ
  - **Preserve Source IP:** Client IP preservation
  - **Health Checks:** TCP, HTTP, HTTPS
  - **Cross-Zone:** Optional cross-zone load balancing

  **🎮 Game Implementation:**
  - **Scaling Animation:** High-performance scaling indicators
  - **Failure Modes:** Target failures, network issues, capacity limits
  - **Connection Constraints:** Security groups, target registration
  - **Performance Degradation:** Target capacity limits
  - **Cost Implications:** Lower cost per unit than ALB

### Content Delivery
- **Amazon CloudFront**
  - *Game Component:* CDN
  - *Use Case:* Global content delivery, static asset caching, API acceleration
  - *Scaling:* Global edge network, automatic scaling
  - *Best For:* Global applications, static content, low latency

  **📊 Pricing & Performance:**
  - **Data Transfer:** $0.085-$0.170 per GB (varies by region)
  - **Requests:** $0.0075 per 10,000 HTTP requests, $0.0100 per 10,000 HTTPS requests
  - **Origin Shield:** $0.0009 per 10,000 requests
  - **Real-time Logs:** $0.01 per 1 million log lines
  - **Performance:** <50ms latency globally, 54 Tbps network capacity

  **🔧 Technical Specifications:**
  - **Edge Locations:** 400+ locations in 90+ cities
  - **Cache Behaviors:** Path-based routing, TTL settings
  - **Origins:** S3, EC2, ALB, custom origins
  - **SSL/TLS:** Free certificates, custom certificates
  - **Compression:** Gzip, Brotli compression
  - **Security:** AWS WAF integration, DDoS protection

  **🎮 Game Implementation:**
  - **Scaling Animation:** Global distribution with edge indicators
  - **Failure Modes:** Origin failures, cache misses, geographic issues
  - **Connection Constraints:** Origin access identity, security headers
  - **Performance Degradation:** Cache miss penalties, origin overload
  - **Cost Implications:** Pay for data transfer and requests

---

## Security Services

### Authentication & Authorization
- **Amazon Cognito**
  - *Game Component:* Authentication Service
  - *Use Case:* User authentication, authorization, user management
  - *Scaling:* Automatic scaling, pay-per-active-user
  - *Best For:* Web/mobile apps, social identity, enterprise federation

  **📊 Pricing & Performance:**
  - **Monthly Active Users (MAU):** $0.0055 per MAU (first 50,000 free)
  - **SAML/OIDC:** $0.015 per MAU
  - **SMS:** $0.00545 per SMS (varies by region)
  - **Advanced Security:** $0.05 per MAU
  - **Performance:** 25,000 requests per second per category

  **🔧 Technical Specifications:**
  - **User Pools:** 40 million users per pool
  - **Identity Pools:** Unlimited identities
  - **Request Rate Quotas:** 
    - User Authentication: 25,000 RPS
    - User Creation: 50 RPS
    - User Account Recovery: 25 RPS
  - **Token Lifetime:** 30 minutes to 24 hours (configurable)
  - **MFA:** SMS, TOTP, hardware tokens
  - **Social Providers:** Facebook, Google, Amazon, Apple

  **🎮 Game Implementation:**
  - **Scaling Animation:** User pool scaling with active user indicators
  - **Failure Modes:** Rate limiting, SMS delivery failures, token expiration
  - **Connection Constraints:** App client configuration, IAM roles
  - **Performance Degradation:** Rate limiting under burst traffic
  - **Cost Implications:** Pay per active user, SMS charges

### Web Application Firewall
- **AWS WAF**
  - *Game Component:* Web Application Firewall
  - *Use Case:* Protection against common web exploits
  - *Scaling:* Automatic scaling with traffic
  - *Best For:* Application layer protection, DDoS mitigation

  **📊 Pricing & Performance:**
  - **Web ACL:** $1.00 per month per web ACL
  - **Rules:** $0.60 per month per rule
  - **Requests:** $0.60 per 1 million requests
  - **Managed Rules:** $1.00-$2.00 per month per rule group
  - **Performance:** <1ms latency impact

  **🔧 Technical Specifications:**
  - **Rule Types:** Rate limiting, IP filtering, geographic blocking
  - **Managed Rules:** AWS and third-party rule sets
  - **Custom Rules:** SQL injection, XSS, size constraints
  - **Integration:** CloudFront, ALB, API Gateway
  - **Logging:** Real-time logs to CloudWatch, S3, Kinesis
  - **Capacity:** Web ACL capacity units (WCU) for rule complexity

  **🎮 Game Implementation:**
  - **Scaling Animation:** Protection layer with threat indicators
  - **Failure Modes:** False positives, rule conflicts, capacity limits
  - **Connection Constraints:** Web ACL association, rule priorities
  - **Performance Degradation:** Complex rule evaluation overhead
  - **Cost Implications:** Monthly fees plus request charges

---

## AI/ML Services

### Generative AI
- **Amazon Bedrock**
  - *Game Component:* AI Service
  - *Use Case:* Text generation, chatbots, content creation
  - *Scaling:* Serverless, pay-per-token
  - *Best For:* Generative AI applications, content automation

  **📊 Pricing & Performance:**
  - **Claude 3 Sonnet:** $0.003 per 1K input tokens, $0.015 per 1K output tokens
  - **GPT-4:** $0.03 per 1K input tokens, $0.06 per 1K output tokens
  - **Titan Text:** $0.0008 per 1K input tokens, $0.0016 per 1K output tokens
  - **Rate Limits:** Varies by model (100-10,000 tokens per minute)
  - **Performance:** 1-10 seconds response time

  **🔧 Technical Specifications:**
  - **Token Limits:** 4K-200K tokens per request (model dependent)
  - **Quotas:** 
    - Requests per minute: 100-10,000 (model dependent)
    - Tokens per minute: 1,000-100,000 (model dependent)
    - Tokens per day: Limited for new accounts
  - **Models:** Anthropic Claude, Amazon Titan, AI21 Jurassic
  - **Fine-tuning:** Custom model training available
  - **Guardrails:** Content filtering, safety controls

  **🎮 Game Implementation:**
  - **Scaling Animation:** Token processing with quota indicators
  - **Failure Modes:** Rate limiting, quota exceeded, content filtering
  - **Connection Constraints:** IAM permissions, model access requests
  - **Performance Degradation:** Queue delays under high demand
  - **Cost Implications:** Pay per token, varies significantly by model

---

## Operations Services

### Monitoring & Observability
- **Amazon CloudWatch**
  - *Game Component:* Monitoring Service
  - *Use Case:* Metrics, logs, alarms, dashboards
  - *Scaling:* Automatic scaling with usage
  - *Best For:* Operational monitoring, alerting, troubleshooting

  **📊 Pricing & Performance:**
  - **Metrics:** $0.30 per metric per month
  - **Alarms:** $0.10 per alarm per month
  - **Logs:** $0.50 per GB ingested, $0.03 per GB stored
  - **Dashboard:** $3.00 per dashboard per month
  - **API Requests:** $0.01 per 1,000 requests
  - **Performance:** 1-minute metric resolution (5-minute free)

  **🔧 Technical Specifications:**
  - **Metrics:** 15-month retention, 1-minute resolution
  - **Logs:** Unlimited retention, real-time streaming
  - **Alarms:** Composite alarms, anomaly detection
  - **Dashboards:** Custom widgets, cross-region views
  - **Events:** Event-driven automation with EventBridge
  - **Insights:** Log analysis, application performance monitoring

  **🎮 Game Implementation:**
  - **Scaling Animation:** Metric collection with health indicators
  - **Failure Modes:** Metric delays, alarm false positives, log ingestion limits
  - **Connection Constraints:** IAM permissions, log groups configuration
  - **Performance Degradation:** High-frequency metrics cost increase
  - **Cost Implications:** Pay per metric, log volume, and dashboard

---

## Game Implementation Notes

### Performance Simulation
- **Cold Start Modeling:** Lambda functions show 1-5 second delays for first invocation
- **Scaling Delays:** ECS tasks take 1-4 minutes to start, EC2 instances 1-5 minutes
- **Network Latency:** CloudFront reduces latency by 50-80% for global users
- **Database Performance:** DynamoDB <10ms, RDS varies by instance type and query complexity

### Cost Optimization Strategies
- **Reserved Instances:** 75% savings for predictable workloads (EC2, RDS)
- **Spot Instances:** 90% savings for fault-tolerant workloads
- **Auto Scaling:** Automatic capacity adjustment based on demand
- **Storage Classes:** S3 Intelligent Tiering for automatic cost optimization

### Failure Scenarios
- **Cascade Failures:** Load balancer target failures cause upstream impacts
- **Capacity Limits:** DynamoDB throttling, Lambda concurrency limits
- **Network Partitions:** Multi-AZ deployments handle AZ failures
- **Data Consistency:** Eventual consistency in distributed systems

### Security Considerations
- **IAM Roles:** Least privilege access, temporary credentials
- **VPC Security:** Security groups, NACLs, private subnets
- **Encryption:** At-rest and in-transit encryption for all data
- **Compliance:** GDPR, HIPAA, SOC compliance frameworks

---

*This document serves as the technical foundation for System Design Tycoon's realistic AWS component behavior and constraints.*

**Document Version:** 3.0  
**Last Updated:** January 2025  
**Next Review:** Quarterly or with major AWS updates  
**Owner:** Game Design Team 