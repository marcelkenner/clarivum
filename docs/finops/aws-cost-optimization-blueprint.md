# AWS Cost-Optimized Deployment Blueprint

Clarivum often needs to stand up full-stack workloads on AWS without locking into a single pricing tier too early. This blueprint packages the lowest-idle-cost starting point and the next step up once traffic steadies. Pair it with the monthly Cost Review runbook (`docs/runbooks/cost-review.md`) so spend, tagging, and alerts stay enforceable.

## Scope & prerequisites

- **Use cases:** marketing sites, APIs, editorial CMS, email, and supporting automations hosted fully on AWS.
- **Regions:** assume `eu-central-1` as the primary region with DR capacity in `eu-west-1`; adjust pricing with the AWS Pricing Calculator before committing.[22]
- **Inputs required:** forecasted traffic bands (RPS, email volume, CMS usage), data residency constraints, and target uptime so we know when Multi-AZ or heavier caching becomes mandatory.

## Track selection

### Track A — Serverless-first (lowest idle cost)

- **Frontend:** Host static assets on S3 with CloudFront + Origin Access Control for TLS and caching; AWS-origin fetches avoid extra egress fees.[1]
- **Backend/API:** Use API Gateway **HTTP APIs** with AWS Lambda on Graviton to stay pay-per-invoke; enable provisioned concurrency only when latency SLOs demand it.[2]
- **Primary datastore (NoSQL):** Start with DynamoDB **On-Demand** for unpredictable load; switch to **Provisioned + auto scaling** or purchase **Reserved Capacity** once traffic is steady.[3]
- **Primary datastore (SQL):** Deploy Aurora Serverless v2 with the lowest supported ACU floor (0–0.5 ACU depending on engine/patch level) so compute pauses during idle windows.[4]
- **CMS:** For lightweight marketing content, Lightsail’s managed WordPress bundle keeps pricing predictable at ~$5–6/month until headless scale is required.[5]
- **Email & comms:** Use Amazon SES for outbound messaging (first 3k messages free in year one, $0.10/1k afterwards), WorkMail for team inboxes ($4/user/month), and Pinpoint for campaigns/journeys as volumes justify it.[6]
- **When this wins:** prototypes, MVPs, bursty workloads where idle spend must approach zero and scale-out is handled by managed services.

### Track B — Managed containers (predictable baseline load)

- **Frontend:** Same S3 + CloudFront foundation as Track A.[1]
- **Backend/CMS:** Run workloads on AWS App Runner (simpler) or ECS Fargate (more control). Prefer container images built for Graviton to shrink per-vCPU pricing.[8]
- **Databases:** Use RDS Single-AZ for steady relational workloads; add Multi-AZ only when HA requirements justify the ~2× compute cost. Start on Graviton instance classes for better price/perf.[9]
- **When this wins:** services with known baseline traffic, long-running workers, or compliance requirements that demand VPC networking while still avoiding EC2 management overhead.

## Twelve cost levers to enforce regardless of track

1. **Adopt Graviton everywhere** (Lambda, ECS, RDS, Aurora) for ~20% better $/performance vs. x86 families.[10]
2. **Commit when usage stabilizes:** buy Compute or EC2 Savings Plans and RDS Reserved Instances once 30–50% of monthly baseline is predictable (up to ~72% discount).[11]
3. **Right-size continuously:** enable Compute Optimizer and Cost Explorer rightsizing to flag oversized EC2, Lambda concurrency, and RDS instances.[12]
4. **Migrate all gp2 EBS volumes to gp3** to cut storage $/GB ~20% and decouple IO from size.[13]
5. **Co-locate chatty components** (app + DB) in the same AZ to avoid cross-AZ transfer fees (~$0.01/GB each direction).[14]
6. **Eliminate NAT gateway waste:** replace S3/DynamoDB traffic with gateway endpoints (free) and consider interface endpoints for other AWS APIs.[15]
7. **Push traffic through CloudFront:** cache aggressively; origin fetches from AWS services to CloudFront do not incur egress, and CDN pricing favors internet delivery.[16]
8. **Tune DynamoDB billing mode:** stay On-Demand until usage is predictable, then swap to Provisioned + auto scaling or Reserved Capacity to lock in savings.[3]
9. **Use Spot capacity for non-critical compute:** CI, batch, analytics, and async workers can mix Spot with On-Demand to save up to 90%.[17]
10. **Tier object storage automatically:** enable S3 Intelligent-Tiering or lifecycle policies to move cold assets to cheaper classes.[18]
11. **Enforce budgets and anomaly detection:** configure AWS Budgets, alerts, and Cost Anomaly Detection routed to #finops-alerts.[19]
12. **Expire logs/metrics intentionally:** keep CloudWatch retention tight, exporting long-term archives to S3 for cost-efficient retention.

## Data transfer guardrails

- Keep high-chatter services within a single AZ unless HA requirements override the cost.[14]
- Prefer private connectivity (gateway/interface endpoints) instead of routing through NAT gateways for AWS API calls.[15]
- Terminate public traffic at CloudFront to reduce origin egress and improve cache hit ratios.[16]

## Quick wins to verify on every account

- Convert any remaining gp2 EBS volumes to gp3 immediately.[13]
- Act on the highest-impact Compute Optimizer rightsizing recommendations each sprint.[12]
- Confirm AWS Budgets and Cost Anomaly Detection are active and routed to the FinOps Slack channel.[19]
- Swap EC2/ECS/Lambda instance families to Graviton where workloads allow it.[10]
- Replace NAT egress to S3/DynamoDB with gateway endpoints; document any exceptions.[15][20]
- Stop non-production RDS instances during off-hours to shed compute spend while retaining storage.[21]
- Revisit Savings Plans and Reserved Instances quarterly as baselines become clearer.[11]

## Integration with Clarivum processes

- **Discovery:** Use this blueprint during PTRD Section 10 (“Cost guardrails”) to justify the initial stack and highlight future upgrade paths.
- **Runbooks:** The FinOps owner must cross-link action items in the Monthly Cost Review runbook so rightsizing and budgeting tasks stay enforced.
- **ADR alignment:** Reference ADR-001 (primary cloud/database) and ADR-016 (CI/CD platform) when choosing between Track A and Track B so deployment automation remains consistent.

## References

[1]: https://aws.amazon.com/cloudfront/pricing/?utm_source=chatgpt.com "Amazon CloudFront Pricing"
[2]: https://docs.aws.amazon.com/whitepapers/latest/best-practices-api-gateway-private-apis-integration/cost-optimization.html?utm_source=chatgpt.com "API Gateway Cost Optimization"
[3]: https://aws.amazon.com/dynamodb/pricing/?utm_source=chatgpt.com "Amazon DynamoDB Pricing"
[4]: https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.requirements.html?utm_source=chatgpt.com "Aurora Serverless v2 requirements"
[5]: https://aws.amazon.com/lightsail/pricing/?utm_source=chatgpt.com "Amazon Lightsail Pricing"
[6]: https://aws.amazon.com/ses/pricing/?utm_source=chatgpt.com "Amazon SES Pricing"
[7]: https://aws.amazon.com/lightsail/?utm_source=chatgpt.com "Amazon Lightsail Overview"
[8]: https://aws.amazon.com/apprunner/pricing/?utm_source=chatgpt.com "AWS App Runner Pricing"
[9]: https://www.bytebase.com/blog/understanding-aws-rds-pricing/?utm_source=chatgpt.com "Understanding AWS RDS Pricing"
[10]: https://aws.amazon.com/ec2/graviton/?utm_source=chatgpt.com "AWS Graviton"
[11]: https://aws.amazon.com/savingsplans/?utm_source=chatgpt.com "AWS Savings Plans"
[12]: https://docs.aws.amazon.com/compute-optimizer/latest/ug/rightsizing-preferences.html?utm_source=chatgpt.com "AWS Compute Optimizer Rightsizing"
[13]: https://aws.amazon.com/ebs/general-purpose/?utm_source=chatgpt.com "Amazon EBS gp3"
[14]: https://aws.amazon.com/blogs/architecture/overview-of-data-transfer-costs-for-common-architectures/?utm_source=chatgpt.com "AWS Data Transfer Costs"
[15]: https://aws.amazon.com/vpc/pricing/?utm_source=chatgpt.com "Amazon VPC Pricing (Endpoints, NAT)"
[16]: https://aws.amazon.com/cloudfront/?utm_source=chatgpt.com "Amazon CloudFront Overview"
[17]: https://aws.amazon.com/ec2/spot/pricing/?utm_source=chatgpt.com "EC2 Spot Pricing"
[18]: https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering.html?utm_source=chatgpt.com "S3 Intelligent-Tiering"
[19]: https://aws.amazon.com/aws-cost-management/aws-budgets/pricing/?utm_source=chatgpt.com "AWS Budgets Pricing"
[20]: https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints-s3.html?utm_source=chatgpt.com "Gateway endpoints for Amazon S3"
[21]: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_StopInstance.html?utm_source=chatgpt.com "Stopping Amazon RDS instances"
[22]: https://calculator.aws/?utm_source=chatgpt.com "AWS Pricing Calculator"
